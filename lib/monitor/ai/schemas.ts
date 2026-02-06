import { z } from 'zod'

// ============================================================
// Stage1: 志望動機、本人希望記入欄、自己PR
// ============================================================
export const Stage1Schema = z.object({
  motivation: z.string().describe('志望の動機（3-5文程度）'),
  preferences: z.string().describe('本人希望記入欄（勤務地・勤務時間・給与などの希望）'),
  selfPR: z.string().describe('自己PR（強み、特技、性格的な長所、具体的なエピソード。3-5文程度）'),
})

export type Stage1Output = z.infer<typeof Stage1Schema>

// ============================================================
// Stage2: 生年月日、学歴、職歴、資格
// ============================================================
export const Stage2Schema = z.object({
  birthDate: z.object({
    year: z.number().describe('生年（西暦）'),
    month: z.number().describe('生月'),
    day: z.number().optional().describe('生日（不明な場合は省略）'),
  }).nullable().describe('生年月日。抽出できない場合はnull'),
  education: z.array(z.object({
    schoolName: z.string().describe('学校名'),
    department: z.string().optional().describe('学部・学科'),
    graduationYear: z.number().describe('卒業年（西暦）'),
    graduationMonth: z.number().describe('卒業月'),
    isGraduated: z.boolean().describe('卒業済みかどうか'),
    status: z.enum(['卒業', '中退', '在学中', '卒業見込']).describe('卒業状況'),
  })).describe('学歴（高校以降、新しい順）'),
  workHistory: z.array(z.object({
    companyName: z.string().describe('会社名'),
    position: z.string().optional().describe('役職'),
    department: z.string().optional().describe('部署'),
    startYear: z.number().describe('入社年（西暦）'),
    startMonth: z.number().describe('入社月'),
    endYear: z.number().optional().describe('退社年（西暦）'),
    endMonth: z.number().optional().describe('退社月'),
    isCurrent: z.boolean().describe('現職かどうか'),
    description: z.string().optional().describe('業務内容'),
  })).describe('職歴（新しい順）'),
  qualifications: z.array(z.object({
    name: z.string().describe('資格名'),
    year: z.number().optional().describe('取得年（西暦）'),
    month: z.number().optional().describe('取得月'),
  })).describe('資格'),
})

export type Stage2Output = z.infer<typeof Stage2Schema>

// ============================================================
// Resume: 履歴書データ
// ============================================================
export const ResumeSchema = z.object({
  personalInfo: z.object({
    name: z.string().describe('氏名'),
    phone: z.string().describe('電話番号'),
    age: z.string().describe('年齢'),
    prefecture: z.string().describe('都道府県'),
  }),
  workHistory: z.array(z.object({
    companyName: z.string().describe('会社名'),
    period: z.string().describe('期間（YYYY年MM月〜YYYY年MM月 形式）'),
    position: z.string().describe('役職'),
    description: z.string().describe('業務内容（2-3文）'),
  })).describe('職歴（新しい順）'),
  education: z.array(z.object({
    schoolName: z.string().describe('学校名'),
    major: z.string().describe('専攻/学部'),
    graduationYear: z.string().describe('卒業年（YYYY年 形式）'),
  })).describe('学歴（新しい順）'),
  qualifications: z.array(z.string()).describe('資格名の配列'),
  skills: z.array(z.string()).describe('スキル名の配列'),
  selfPR: z.string().describe('自己PR（3-5文程度）'),
})

export type ResumeOutput = z.infer<typeof ResumeSchema>

// ============================================================
// CompanyAnalysis: 企業分析
// ============================================================
export const CompanyAnalysisSchema = z.object({
  companyName: z.string().describe('企業名'),
  industry: z.string().describe('業界・分野'),
  businessDescription: z.string().describe('事業内容の概要（2-3文）'),
  desiredTalent: z.string().describe('この企業が求めていそうな人材像（2-3文）'),
  companyCulture: z.string().describe('企業文化・社風（1-2文）'),
  keyPoints: z.array(z.string()).describe('履歴書作成時に意識すべきポイント（3-5項目）'),
})

export type CompanyAnalysisOutput = z.infer<typeof CompanyAnalysisSchema>

// ============================================================
// QualityCheck: 品質検証
// ============================================================
export const QualityCheckSchema = z.object({
  isAcceptable: z.boolean().describe('品質が十分かどうか'),
  missingFields: z.array(z.string()).describe('不足しているフィールド名'),
  suggestions: z.array(z.string()).describe('改善のための提案'),
})

export type QualityCheckOutput = z.infer<typeof QualityCheckSchema>
