import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import {
  Stage1Schema,
  Stage2Schema,
  ResumeSchema,
  CompanyAnalysisSchema,
  QualityCheckSchema,
  type Stage1Output,
  type Stage2Output,
  type ResumeOutput,
  type CompanyAnalysisOutput,
  type QualityCheckOutput,
} from './schemas'

// ============================================================
// 共通モデルファクトリ
// ============================================================

function createModel(options?: { modelName?: string; temperature?: number }) {
  return new ChatGoogleGenerativeAI({
    model: options?.modelName ?? 'gemini-2.0-flash',
    temperature: options?.temperature ?? 0.2,
    apiKey: process.env.GEMINI_API_KEY,
  })
}

// ============================================================
// Stage1: 志望動機、本人希望記入欄、自己PR
// ============================================================

export function createStage1Chain() {
  const model = createModel()
  const structured = model.withStructuredOutput(Stage1Schema).withRetry({ stopAfterAttempt: 3 })

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `あなたは履歴書作成アシスタントです。
音声書き起こしから、履歴書に必要な「志望の動機」「本人希望記入欄」「自己PR」を生成してください。

【生成ルール】
- 志望の動機（motivation）: なぜその仕事・業界に興味があるのか。過去の経験との関連を含む。3-5文程度。
- 本人希望記入欄（preferences）: 勤務地、勤務時間、給与などの希望。特に希望がなければ「貴社規定に従います」。
- 自己PR（selfPR）: 本人の強み、特技、性格的な長所。具体的なエピソードがあれば含める。3-5文程度。

【重要事項】
- 書き起こしに含まれていない情報は推測しないでください
- 丁寧語で書いてください（です・ます調）
- 前向きで誠実な印象を与える文章にしてください`],
    ['human', `【基本情報】
- 氏名: {name}
- 年齢: {age}歳
- 都道府県: {prefecture}

【音声書き起こし内容】
{transcript}`],
  ])

  return prompt.pipe(structured)
}

// ============================================================
// Stage2: 生年月日、学歴、職歴、資格
// ============================================================

export function createStage2Chain() {
  const model = createModel()
  const structured = model.withStructuredOutput(Stage2Schema).withRetry({ stopAfterAttempt: 3 })

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `あなたは履歴書作成アシスタントです。
音声書き起こしから、生年月日・学歴・職歴・資格情報を正確に抽出し、日付を計算してください。

【日付計算ルール】
- 今日の日付情報は human メッセージに含まれます
- 「4ヶ月前」「去年」「3年前」などの相対的な表現は、今日の日付から計算してください
- 平成・昭和などの和暦は西暦に変換してください（例: 平成8年 → 1996年）

【抽出ルール】
1. 生年月日: 西暦で返す。日が不明な場合は省略可。抽出できない場合はnull。
2. 学歴: 高校以降を記載。生年月日から卒業年を計算（高校卒業=生年+18, 大学卒業=生年+22）。
3. 職歴: 新しい順。「〜ヶ月前まで」は今日の日付から計算。現職ならisCurrent: true。
4. 資格: 取得時期が分かる場合は年月を記載。

【重要事項】
- 日付は必ず数値で返してください
- 不明な情報は推測せず、空欄またはnullにしてください
- 「頃」「約」などの曖昧な表現は避け、計算で導き出してください`],
    ['human', `【日付計算情報】
- 今日は{currentYear}年{currentMonth}月です

【基本情報】
- 氏名: {name}
- 都道府県: {prefecture}

【音声書き起こし内容】
{transcript}`],
  ])

  return prompt.pipe(structured)
}

// ============================================================
// 品質検証チェーン
// ============================================================

export function createQualityCheckChain(stage: 'stage1' | 'stage2') {
  const model = createModel({ temperature: 0.0 })
  const structured = model.withStructuredOutput(QualityCheckSchema).withRetry({ stopAfterAttempt: 3 })

  const stageRules = stage === 'stage1'
    ? `【Stage1品質基準】
- motivation: 50文字以上で、具体的な理由が含まれているか
- selfPR: 50文字以上で、具体的な強みやエピソードが含まれているか
- preferences: 空でないか（「貴社規定に従います」でもOK）`
    : `【Stage2品質基準】
- transcriptに言及がある職歴がすべて抽出されているか
- transcriptに言及がある学歴がすべて抽出されているか
- birthDateがtranscriptに含まれている場合、正しく抽出されているか
- 日付の計算が正しいか（相対的な表現の場合）`

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `あなたは品質検証エージェントです。
音声書き起こし（transcript）と、そこから抽出された構造化データを比較し、品質を評価してください。

${stageRules}

【評価基準】
- isAcceptable: 上記の基準を概ね満たしていればtrue
- missingFields: 不足しているフィールド名のリスト
- suggestions: 改善のための具体的な提案`],
    ['human', `【音声書き起こし】
{transcript}

【抽出された構造化データ】
{extractedData}`],
  ])

  return prompt.pipe(structured)
}

// ============================================================
// 履歴書生成チェーン
// ============================================================

export function createResumeChain() {
  const model = createModel()
  const structured = model.withStructuredOutput(ResumeSchema).withRetry({ stopAfterAttempt: 3 })

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `あなたは履歴書作成アシスタントです。
音声書き起こしから、履歴書に必要な情報を抽出し、構造化してください。

【抽出項目】
1. 職歴（workHistory）: 会社名、期間（YYYY年MM月〜YYYY年MM月）、役職、業務内容（2-3文）。新しい順。
2. 学歴（education）: 学校名、専攻/学部、卒業年（YYYY年）。新しい順。
3. 資格（qualifications）: 資格名の配列。
4. スキル（skills）: スキル名の配列。
5. 自己PR（selfPR）: 強みや特徴を3-5文でまとめる。具体的なエピソードがあれば含める。

【重要事項】
- 書き起こしに含まれていない情報は推測せず、空の配列または空文字列としてください
- 曖昧な情報は「〜頃」「約〜」などの表現を使ってください
- 職歴・学歴は新しい順に並べてください`],
    ['human', `【基本情報（事前入力済み）】
- 氏名: {name}
- 電話番号: {phone}
- 年齢: {age}
- 都道府県: {prefecture}

【音声書き起こし内容】
{transcript}`],
  ])

  return prompt.pipe(structured)
}

// ============================================================
// 履歴書修正チェーン
// ============================================================

export function createRefineChain() {
  const model = createModel()
  const structured = model.withStructuredOutput(ResumeSchema).withRetry({ stopAfterAttempt: 3 })

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `あなたは履歴書作成アシスタントです。
履歴書データを、ユーザーの指示に基づいて修正・改善してください。

【重要事項】
- 指示された部分のみを修正してください
- 指示がない部分はそのまま保持してください`],
    ['human', `【現在の履歴書データ】
{currentResume}

【ユーザーからの指示】
{instructions}`],
  ])

  return prompt.pipe(structured)
}

// ============================================================
// 企業分析チェーン
// ============================================================

export function createCompanyAnalysisChain() {
  const model = createModel({ modelName: 'gemini-1.5-flash' })
  const structured = model.withStructuredOutput(CompanyAnalysisSchema).withRetry({ stopAfterAttempt: 3 })

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `あなたは企業分析のエキスパートです。
ウェブページの内容から、企業情報を抽出・分析してください。

【抽出項目】
1. companyName: 企業名
2. industry: 業界・分野
3. businessDescription: 事業内容の概要（2-3文）
4. desiredTalent: この企業が求めていそうな人材像（2-3文、ページ内容から推測）
5. companyCulture: 企業文化・社風（1-2文、ページ内容から推測）
6. keyPoints: 履歴書作成時に意識すべきポイント（3-5項目）

【重要事項】
- ページに情報がない項目は、業界の一般的な傾向から推測してください
- 推測した内容は「〜と考えられます」のように表現してください`],
    ['human', `【ウェブページURL】
{url}

【ウェブページの内容】
{pageContent}`],
  ])

  return prompt.pipe(structured)
}

// ============================================================
// 企業カスタマイズチェーン
// ============================================================

export function createCustomizeChain() {
  const model = createModel({ modelName: 'gemini-1.5-flash' })
  const structured = model.withStructuredOutput(ResumeSchema).withRetry({ stopAfterAttempt: 3 })

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', `あなたは転職支援のプロフェッショナルです。
履歴書データを、応募先企業に合わせて最適化してください。

【最適化の方針】
1. selfPR（自己PR）: 企業が求める人材像に合わせて書き直す。具体的なエピソードは残しつつ、企業に響く表現に変える。
2. workHistory の description: 企業に関連する業務経験を強調する表現に調整。
3. skills: 企業に関連するスキルを上位に移動（順序変更のみ）。
4. personalInfo, education, qualifications: 変更しない。

【重要事項】
- 虚偽の情報は追加しないこと
- 既存の経験・スキルの表現を最適化するだけ`],
    ['human', `【応募先企業の分析結果】
- 企業名: {companyName}
- 業界: {industry}
- 事業内容: {businessDescription}
- 求める人材像: {desiredTalent}
- 企業文化: {companyCulture}
- 重要ポイント: {keyPoints}

【現在の履歴書データ】
{baseResume}`],
  ])

  return prompt.pipe(structured)
}
