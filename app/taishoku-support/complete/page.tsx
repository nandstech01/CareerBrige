'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Home, Sparkles } from 'lucide-react'
import { LineCtaCard } from '@/components/taishoku/LineCtaCard'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function CompletePage() {
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    // sessionStorageから名前を取得
    const storedName = sessionStorage.getItem('taishoku_user_name')
    if (storedName) {
      setUserName(storedName)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-midnight-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-midnight-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-cyan">CareerBridge</span>
            <span className="text-xs px-2 py-1 bg-brand-cyan/10 text-brand-cyan rounded-full font-medium">
              退職サポート
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        {/* 成功カード */}
        <LineCtaCard variant="success" userName={userName} />

        {/* 追加アクション */}
        <div className="mt-8 space-y-4">
          {/* 再作成リンク */}
          <Link
            href="/taishoku-support/resume"
            className="flex items-center justify-between p-4 bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 hover:border-brand-cyan/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-brand-cyan/10 text-brand-cyan rounded-lg group-hover:bg-brand-cyan group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  別の履歴書を作成
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  もう一度最初から作成する
                </p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180" />
          </Link>

          {/* トップページリンク */}
          <Link
            href="/taishoku-support"
            className="flex items-center justify-between p-4 bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 hover:border-brand-cyan/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-midnight-700 text-slate-600 dark:text-slate-400 rounded-lg group-hover:bg-brand-cyan group-hover:text-white transition-colors">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  退職サポートトップ
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  サービス概要に戻る
                </p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180" />
          </Link>
        </div>

        {/* 追加メッセージ */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 dark:bg-brand-cyan/20 text-brand-cyan rounded-full text-sm">
            <Sparkles className="w-4 h-4" />
            CareerBridgeをご利用いただきありがとうございます
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-midnight-700 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-brand-cyan font-semibold">
                CareerBridge
              </Link>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                運営: 株式会社エヌアンドエス
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/terms" className="hover:text-brand-cyan transition-colors">
                利用規約
              </Link>
              <Link href="/privacy" className="hover:text-brand-cyan transition-colors">
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
