import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | CareerBridge',
    default: 'AI書類作成プラットフォーム | CareerBridge',
  },
  description:
    '人材紹介会社向けAI書類作成プラットフォーム。候補者の履歴書・職務経歴書をAIで高品質に自動生成し、書類作成工数を大幅削減。無料トライアル受付中。',
  keywords: [
    '人材紹介',
    '履歴書作成',
    'AI',
    '職務経歴書',
    '書類作成自動化',
    '人材紹介会社向け',
    'SaaS',
    'HRTech',
    '業務効率化',
    '無料トライアル',
  ],
  openGraph: {
    title: 'AI書類作成プラットフォーム | CareerBridge',
    description:
      '人材紹介会社向けAI書類作成プラットフォーム。候補者の応募書類をAIで高品質に自動生成し、紹介業務の効率を最大化。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'CareerBridge',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI書類作成プラットフォーム | CareerBridge',
    description:
      '人材紹介会社向けAI書類作成プラットフォーム。候補者の応募書類をAIで高品質に自動生成し、紹介業務の効率を最大化。',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function MonitorProgramLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
