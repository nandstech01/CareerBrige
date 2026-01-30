import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | CareerBridge モニタープログラム',
    default: '履歴書完成保証モニタープログラム | CareerBridge',
  },
  description:
    'AIとプロの知見を融合した履歴書完成保証プログラム。音声入力だけで書類選考の通過率を高める職務経歴書を作成。無料モニター参加受付中。',
  keywords: [
    '履歴書',
    '職務経歴書',
    '履歴書作成',
    'AI履歴書',
    '書類選考',
    '転職',
    '退職',
    'キャリア',
    'モニタープログラム',
    '無料',
  ],
  openGraph: {
    title: '履歴書完成保証モニタープログラム | CareerBridge',
    description:
      'AIとプロの知見を融合した履歴書完成保証プログラム。音声入力だけで書類選考の通過率を高める職務経歴書を作成。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'CareerBridge',
  },
  twitter: {
    card: 'summary_large_image',
    title: '履歴書完成保証モニタープログラム | CareerBridge',
    description:
      'AIとプロの知見を融合した履歴書完成保証プログラム。音声入力だけで書類選考の通過率を高める職務経歴書を作成。',
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
