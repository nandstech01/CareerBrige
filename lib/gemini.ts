import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Stage1Data, Stage2Data } from '@/types/database';

// Gemini API クライアントの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// モデル設定 - Gemini Pro
const MODEL_NAME = 'gemini-2.0-flash';

// 履歴書データの型定義
export interface ResumeData {
  personalInfo: {
    name: string;
    phone: string;
    age: string;
    prefecture: string;
  };
  workHistory: Array<{
    companyName: string;
    period: string;
    position: string;
    description: string;
  }>;
  education: Array<{
    schoolName: string;
    major: string;
    graduationYear: string;
  }>;
  qualifications: string[];
  skills: string[];
  selfPR: string;
  rawTranscript?: string;
}

/**
 * 音声ファイルをテキストに文字起こしする
 */
export async function transcribeAudio(audioBase64: string, mimeType: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: mimeType,
        data: audioBase64,
      },
    },
    {
      text: `この音声を正確に文字起こししてください。
話者が自分の経歴や職歴について話している内容を、できるだけ詳細に書き起こしてください。
固有名詞（会社名、学校名など）は正確に聞き取ってください。
数字（年数、期間など）も正確に書き起こしてください。

文字起こし結果のみを出力してください。説明や注釈は不要です。`,
    },
  ]);

  const response = await result.response;
  return response.text();
}

/**
 * 文字起こしテキストから履歴書データを生成する
 */
export async function generateResumeFromText(
  transcript: string,
  personalInfo: {
    name: string;
    phone: string;
    age: string;
    prefecture: string;
  }
): Promise<ResumeData> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `あなたは履歴書作成アシスタントです。
以下の音声書き起こしから、履歴書に必要な情報を抽出し、JSON形式で構造化してください。

【基本情報（事前入力済み）】
- 氏名: ${personalInfo.name}
- 電話番号: ${personalInfo.phone}
- 年齢: ${personalInfo.age}
- 都道府県: ${personalInfo.prefecture}

【音声書き起こし内容】
${transcript}

【抽出項目】
1. 職歴（workHistory）
   - 会社名（companyName）
   - 期間（period）: "YYYY年MM月〜YYYY年MM月" 形式
   - 役職（position）
   - 業務内容（description）: 具体的な業務内容を2-3文で

2. 学歴（education）
   - 学校名（schoolName）
   - 専攻/学部（major）
   - 卒業年（graduationYear）: "YYYY年" 形式

3. 資格（qualifications）: 資格名の配列

4. スキル（skills）: スキル名の配列

5. 自己PR（selfPR）
   - 書き起こし内容から強みや特徴を抽出し、3-5文程度でまとめる
   - 具体的なエピソードがあれば含める

【重要な注意事項】
- 書き起こしに含まれていない情報は推測せず、空の配列または空文字列として返してください
- 曖昧な情報は「〜頃」「約〜」などの表現を使ってください
- 職歴は新しい順（最新の職歴が最初）に並べてください
- 学歴も新しい順に並べてください

【出力形式】
以下のJSON形式で出力してください。JSONのみを出力し、説明は不要です。
\`\`\`json
{
  "personalInfo": {
    "name": "${personalInfo.name}",
    "phone": "${personalInfo.phone}",
    "age": "${personalInfo.age}",
    "prefecture": "${personalInfo.prefecture}"
  },
  "workHistory": [
    {
      "companyName": "会社名",
      "period": "YYYY年MM月〜YYYY年MM月",
      "position": "役職",
      "description": "業務内容"
    }
  ],
  "education": [
    {
      "schoolName": "学校名",
      "major": "専攻",
      "graduationYear": "YYYY年"
    }
  ],
  "qualifications": ["資格1", "資格2"],
  "skills": ["スキル1", "スキル2"],
  "selfPR": "自己PR文"
}
\`\`\``;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // JSONを抽出
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  let jsonString = jsonMatch ? jsonMatch[1] : text;

  // JSONの前後の余分な文字を削除
  jsonString = jsonString.trim();
  if (!jsonString.startsWith('{')) {
    const startIndex = jsonString.indexOf('{');
    if (startIndex !== -1) {
      jsonString = jsonString.substring(startIndex);
    }
  }
  if (!jsonString.endsWith('}')) {
    const endIndex = jsonString.lastIndexOf('}');
    if (endIndex !== -1) {
      jsonString = jsonString.substring(0, endIndex + 1);
    }
  }

  try {
    const resumeData = JSON.parse(jsonString) as ResumeData;
    resumeData.rawTranscript = transcript;
    return resumeData;
  } catch {
    // パースに失敗した場合は、基本情報のみで返す
    return {
      personalInfo,
      workHistory: [],
      education: [],
      qualifications: [],
      skills: [],
      selfPR: '',
      rawTranscript: transcript,
    };
  }
}

/**
 * 履歴書データを再構成する（編集後の再生成用）
 */
export async function refineResume(
  currentResume: ResumeData,
  additionalInstructions: string
): Promise<ResumeData> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `あなたは履歴書作成アシスタントです。
以下の履歴書データを、ユーザーの指示に基づいて修正・改善してください。

【現在の履歴書データ】
${JSON.stringify(currentResume, null, 2)}

【ユーザーからの指示】
${additionalInstructions}

【重要事項】
- 指示された部分のみを修正してください
- 指示がない部分はそのまま保持してください
- 出力はJSON形式のみで、説明は不要です

出力形式は以下の通りです：
\`\`\`json
{
  "personalInfo": {...},
  "workHistory": [...],
  "education": [...],
  "qualifications": [...],
  "skills": [...],
  "selfPR": "..."
}
\`\`\``;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  let jsonString = jsonMatch ? jsonMatch[1] : text;
  jsonString = jsonString.trim();

  try {
    const refinedResume = JSON.parse(jsonString) as ResumeData;
    refinedResume.rawTranscript = currentResume.rawTranscript;
    return refinedResume;
  } catch {
    return currentResume;
  }
}

// ============================================================
// 2-Stage Hearing Functions
// ============================================================

/**
 * Stage1: 志望動機、本人希望記入欄、自己PRを生成する
 */
export async function generateStage1Data(
  transcript: string,
  personalInfo: { name: string; age: string; prefecture: string }
): Promise<Stage1Data> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `あなたは履歴書作成アシスタントです。
以下の音声書き起こしから、履歴書に必要な「志望の動機」「本人希望記入欄」「自己PR」を生成してください。

【基本情報】
- 氏名: ${personalInfo.name}
- 年齢: ${personalInfo.age}歳
- 都道府県: ${personalInfo.prefecture}

【音声書き起こし内容】
${transcript}

【生成項目】
1. 志望の動機（motivation）
   - なぜその仕事・業界に興味があるのか
   - 過去の経験との関連があれば含める
   - 3-5文程度でまとめる

2. 本人希望記入欄（preferences）
   - 勤務地、勤務時間、給与などの希望があれば記載
   - 特に希望がなければ「貴社規定に従います」

3. 自己PR（selfPR）
   - 本人の強み、特技、性格的な長所
   - 具体的なエピソードがあれば含める
   - 3-5文程度でまとめる

【重要事項】
- 書き起こしに含まれていない情報は推測しないでください
- 丁寧語で書いてください（です・ます調）
- 前向きで誠実な印象を与える文章にしてください

【出力形式】
以下のJSON形式で出力してください。JSONのみを出力し、説明は不要です。
\`\`\`json
{
  "motivation": "志望の動機",
  "preferences": "本人希望記入欄",
  "selfPR": "自己PR"
}
\`\`\``;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  let jsonString = jsonMatch ? jsonMatch[1] : text;
  jsonString = jsonString.trim();

  if (!jsonString.startsWith('{')) {
    const startIndex = jsonString.indexOf('{');
    if (startIndex !== -1) jsonString = jsonString.substring(startIndex);
  }
  if (!jsonString.endsWith('}')) {
    const endIndex = jsonString.lastIndexOf('}');
    if (endIndex !== -1) jsonString = jsonString.substring(0, endIndex + 1);
  }

  try {
    const data = JSON.parse(jsonString) as Omit<Stage1Data, 'generatedAt'>;
    return {
      ...data,
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return {
      motivation: '',
      preferences: '貴社規定に従います',
      selfPR: '',
      generatedAt: new Date().toISOString(),
    };
  }
}

/**
 * 現在の日付から年齢を使って生年を計算する
 */
function calculateBirthYear(age: number, currentYear: number): number {
  return currentYear - age;
}

/**
 * Stage2: 学歴、職歴、資格を生成する（日付計算含む）
 */
export async function generateStage2Data(
  transcript: string,
  personalInfo: { name: string; age: string; prefecture: string }
): Promise<Stage2Data> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const age = parseInt(personalInfo.age, 10);
  const birthYear = calculateBirthYear(age, currentYear);

  const prompt = `あなたは履歴書作成アシスタントです。
以下の音声書き起こしから、学歴・職歴・資格情報を正確に抽出し、日付を計算してください。

【重要な日付計算情報】
- 今日は${currentYear}年${currentMonth}月です
- 本人の年齢: ${age}歳（生年: ${birthYear}年）
- 「4ヶ月前」という表現 → ${currentYear}年${currentMonth - 4 > 0 ? currentMonth - 4 : currentMonth - 4 + 12}月
- 「去年」という表現 → ${currentYear - 1}年
- 「3年前」という表現 → ${currentYear - 3}年

【日付計算の例】
- ${age}歳で高校卒業の場合 → ${birthYear + 18}年3月卒業（18歳時点）
- ${age}歳で大学卒業（4年制）の場合 → ${birthYear + 22}年3月卒業（22歳時点）
- ${age}歳で専門学校卒業（2年制）の場合 → ${birthYear + 20}年3月卒業（20歳時点）

【基本情報】
- 氏名: ${personalInfo.name}
- 年齢: ${age}歳
- 都道府県: ${personalInfo.prefecture}

【音声書き起こし内容】
${transcript}

【抽出項目】
1. 学歴（education）
   - 中学校は省略、高校以降を記載
   - 卒業年月は年齢から逆算して正確に計算
   - status: 「卒業」「中退」「在学中」「卒業見込」のいずれか

2. 職歴（workHistory）
   - 新しい順に並べる
   - 「〜ヶ月前まで」「〜年前まで」は今日の日付から計算
   - isCurrent: 現職の場合はtrue、退職済みはfalse

3. 資格（qualifications）
   - 取得時期が分かる場合は年月を記載

【重要事項】
- 日付は必ず数値（年: number, 月: number）で返してください
- 不明な情報は推測せず、空欄またはnullにしてください
- 「頃」「約」などの曖昧な表現は避け、計算で導き出してください

【出力形式】
以下のJSON形式で出力してください。JSONのみを出力し、説明は不要です。
\`\`\`json
{
  "education": [
    {
      "schoolName": "○○高等学校",
      "department": "普通科",
      "graduationYear": ${birthYear + 18},
      "graduationMonth": 3,
      "isGraduated": true,
      "status": "卒業"
    }
  ],
  "workHistory": [
    {
      "companyName": "○○株式会社",
      "position": "営業",
      "department": "営業部",
      "startYear": 2020,
      "startMonth": 4,
      "endYear": 2024,
      "endMonth": 10,
      "isCurrent": false,
      "description": "法人営業を担当"
    }
  ],
  "qualifications": [
    {
      "name": "普通自動車免許",
      "year": 2020,
      "month": 8
    }
  ]
}
\`\`\``;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  let jsonString = jsonMatch ? jsonMatch[1] : text;
  jsonString = jsonString.trim();

  if (!jsonString.startsWith('{')) {
    const startIndex = jsonString.indexOf('{');
    if (startIndex !== -1) jsonString = jsonString.substring(startIndex);
  }
  if (!jsonString.endsWith('}')) {
    const endIndex = jsonString.lastIndexOf('}');
    if (endIndex !== -1) jsonString = jsonString.substring(0, endIndex + 1);
  }

  try {
    const data = JSON.parse(jsonString) as Omit<Stage2Data, 'generatedAt'>;
    return {
      ...data,
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return {
      education: [],
      workHistory: [],
      qualifications: [],
      generatedAt: new Date().toISOString(),
    };
  }
}
