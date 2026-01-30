import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '企業特化履歴書',
  description:
    '志望企業に合わせた履歴書を自動生成。AIが企業情報を分析し、志望動機・自己PRを最適化します。',
  openGraph: {
    title: '企業特化履歴書 | CareerBridge モニタープログラム',
    description:
      '志望企業に合わせた履歴書を自動生成。AIが企業情報を分析し、志望動機・自己PRを最適化します。',
  },
}

export default function CustomizeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
