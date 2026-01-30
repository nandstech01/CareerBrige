import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const MODEL_NAME = 'gemini-1.5-flash'

export interface CompanyAnalysis {
  companyName: string
  industry: string
  businessDescription: string
  desiredTalent: string
  companyCulture: string
  keyPoints: string[]
}

/**
 * Fetch and extract text content from a company URL
 */
async function fetchPageContent(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CareerBridge/1.0)',
      'Accept': 'text/html',
    },
    signal: AbortSignal.timeout(10000),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`)
  }

  const html = await response.text()

  // Strip HTML tags and extract text
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Limit to ~8000 chars to stay within Gemini context
  return text.slice(0, 8000)
}

/**
 * Analyze company information from a URL using Gemini
 */
export async function analyzeCompany(url: string): Promise<CompanyAnalysis> {
  // Validate URL
  try {
    new URL(url)
  } catch {
    throw new Error('Invalid URL format')
  }

  // Fetch page content
  const pageContent = await fetchPageContent(url)

  if (!pageContent || pageContent.length < 50) {
    throw new Error('Could not extract sufficient content from the URL')
  }

  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  const prompt = `あなたは企業分析のエキスパートです。
以下のウェブページの内容から、企業情報を抽出・分析してください。

【ウェブページURL】
${url}

【ウェブページの内容】
${pageContent}

【抽出項目】
1. companyName: 企業名
2. industry: 業界・分野
3. businessDescription: 事業内容の概要（2-3文）
4. desiredTalent: この企業が求めていそうな人材像（2-3文、ページ内容から推測）
5. companyCulture: 企業文化・社風（1-2文、ページ内容から推測）
6. keyPoints: 履歴書作成時に意識すべきポイント（3-5項目の配列）

【重要事項】
- ページに情報がない項目は、業界の一般的な傾向から推測してください
- 推測した内容は「〜と考えられます」のように表現してください
- JSONのみを出力してください

\`\`\`json
{
  "companyName": "",
  "industry": "",
  "businessDescription": "",
  "desiredTalent": "",
  "companyCulture": "",
  "keyPoints": []
}
\`\`\``

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  // Parse JSON
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
  let jsonString = jsonMatch ? jsonMatch[1] : text
  jsonString = jsonString.trim()

  try {
    return JSON.parse(jsonString) as CompanyAnalysis
  } catch {
    // Fallback with minimal data
    return {
      companyName: 'Unknown',
      industry: 'Unknown',
      businessDescription: 'ウェブページの内容を解析できませんでした。',
      desiredTalent: '',
      companyCulture: '',
      keyPoints: [],
    }
  }
}

/**
 * Generate a customized resume tailored to a specific company
 */
export async function generateCustomizedResume(
  baseResume: import('@/lib/gemini').ResumeData,
  companyAnalysis: CompanyAnalysis
): Promise<import('@/lib/gemini').ResumeData> {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  const prompt = `あなたは転職支援のプロフェッショナルです。
以下の履歴書データを、応募先企業に合わせて最適化してください。

【応募先企業の分析結果】
- 企業名: ${companyAnalysis.companyName}
- 業界: ${companyAnalysis.industry}
- 事業内容: ${companyAnalysis.businessDescription}
- 求める人材像: ${companyAnalysis.desiredTalent}
- 企業文化: ${companyAnalysis.companyCulture}
- 重要ポイント: ${companyAnalysis.keyPoints.join(', ')}

【現在の履歴書データ】
${JSON.stringify(baseResume, null, 2)}

【最適化の方針】
1. selfPR（自己PR）: 企業が求める人材像に合わせて書き直す。具体的なエピソードは残しつつ、企業に響く表現に変える
2. workHistory の description: 企業に関連する業務経験を強調する表現に調整
3. skills: 企業に関連するスキルを上位に移動（順序変更のみ）
4. personalInfo, education, qualifications: 変更しない

【重要事項】
- 虚偽の情報は追加しないこと
- 既存の経験・スキルの表現を最適化するだけ
- JSONのみを出力してください

\`\`\`json
{
  "personalInfo": {...},
  "workHistory": [...],
  "education": [...],
  "qualifications": [...],
  "skills": [...],
  "selfPR": "..."
}
\`\`\``

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
  let jsonString = jsonMatch ? jsonMatch[1] : text
  jsonString = jsonString.trim()

  try {
    const customized = JSON.parse(jsonString) as import('@/lib/gemini').ResumeData
    customized.rawTranscript = baseResume.rawTranscript
    return customized
  } catch {
    return baseResume
  }
}
