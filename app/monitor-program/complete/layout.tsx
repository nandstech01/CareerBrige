import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '履歴書完成',
  description:
    '履歴書の作成が完了しました。ダウンロードや企業特化版の作成が可能です。',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CompleteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
