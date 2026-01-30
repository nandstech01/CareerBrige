'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  FileText,
  Home,
  Sparkles,
  Building2,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function CompletePage() {
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
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
          <Link href="/monitor-program" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-cyan">CareerBridge</span>
            <span className="text-xs px-2 py-1 bg-brand-cyan/10 text-brand-cyan rounded-full font-medium">
              履歴書作成
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        {/* 成功カード */}
        <div className="bg-white dark:bg-midnight-800 rounded-2xl shadow-lg border border-slate-200 dark:border-midnight-600 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            履歴書の作成が完了しました
          </h1>
          {userName && (
            <p className="text-slate-600 dark:text-slate-400">
              {userName}さん、お疲れさまでした
            </p>
          )}
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            ダウンロードした履歴書はお手元に保存してください。
          </p>
        </div>

        {/* フェーズA内アクション */}
        <div className="mt-8 space-y-4">
          {/* 企業特化履歴書 CTA（メインCTA） */}
          <Link
            href="/monitor-program/customize"
            className="flex items-center justify-between p-5 bg-gradient-to-r from-brand-cyan/5 to-brand-cyan/10 dark:from-brand-cyan/10 dark:to-brand-cyan/20 rounded-xl border-2 border-brand-cyan/30 hover:border-brand-cyan/60 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-brand-cyan text-white rounded-xl shadow-lg shadow-brand-cyan/25">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    企業に合わせた履歴書を作る
                  </p>
                  <span className="px-2 py-0.5 bg-brand-cyan text-white text-xs rounded-full font-medium">
                    NEW
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  応募先企業のURLを入力して、通過率UPの履歴書に
                </p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-brand-cyan rotate-180 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* 再作成リンク */}
          <Link
            href="/monitor-program/resume"
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
            href="/monitor-program"
            className="flex items-center justify-between p-4 bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 hover:border-brand-cyan/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-midnight-700 text-slate-600 dark:text-slate-400 rounded-lg group-hover:bg-brand-cyan group-hover:text-white transition-colors">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  サービストップ
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  サービス概要に戻る
                </p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180" />
          </Link>
        </div>

        {/* 分離線 */}
        <div className="mt-10 mb-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-midnight-600" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900 px-4 text-xs text-slate-400 dark:text-slate-500">
              その他のサービス
            </span>
          </div>
        </div>

        {/* フェーズB導線（明確に分離） */}
        <Link
          href="/monitor-program/career-consult"
          className="flex items-center justify-between p-4 bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 hover:border-slate-300 dark:hover:border-midnight-500 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-midnight-700 text-slate-500 dark:text-slate-400 rounded-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                キャリアの相談をしてみる
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                転職相談をご希望の方はこちら（別途同意が必要です）
              </p>
            </div>
          </div>
          <ArrowLeft className="w-5 h-5 text-slate-300 rotate-180" />
        </Link>

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
