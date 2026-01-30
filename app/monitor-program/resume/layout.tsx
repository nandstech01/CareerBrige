import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '履歴書作成',
  description:
    '音声入力だけでプロ品質の職務経歴書を作成。AIが経験を分析し、書類選考の通過率を高める履歴書を自動生成します。',
  openGraph: {
    title: '履歴書作成 | CareerBridge モニタープログラム',
    description:
      '音声入力だけでプロ品質の職務経歴書を作成。AIが経験を分析し、書類選考の通過率を高める履歴書を自動生成します。',
  },
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
