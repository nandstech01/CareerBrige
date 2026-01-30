'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  MessageCircle,
  ArrowRight,
  Users,
  Clock,
  Shield,
  CheckSquare,
  AlertTriangle,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

// LINE友達追加URL
const LINE_ADD_URL = 'https://lin.ee/B7yynyF'

export default function CareerConsultPage() {
  const [consentChecked, setConsentChecked] = useState(false)
  const [showLineSection, setShowLineSection] = useState(false)

  const handleConsent = async () => {
    if (!consentChecked) return
    try {
      const sessionToken = typeof window !== 'undefined'
        ? sessionStorage.getItem('monitor_session_token')
        : null

      await fetch('/api/monitor/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken,
          consentType: 'career_consult',
          consented: true,
          consentVersion: '1.0.0',
        }),
      })
    } catch (err) {
      console.error('Consent record error (non-blocking):', err)
    }
    setShowLineSection(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-midnight-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-midnight-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/monitor-program" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-cyan">CareerBridge</span>
            <span className="text-xs px-2 py-1 bg-brand-cyan/10 text-brand-cyan rounded-full font-medium">
              キャリア相談
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        {/* Back link */}
        <Link
          href="/monitor-program/complete"
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-brand-cyan transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Link>

        {/* 説明カード */}
        <div className="bg-white dark:bg-midnight-800 rounded-2xl shadow-lg border border-slate-200 dark:border-midnight-600 overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-midnight-700 dark:to-midnight-800 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              キャリア相談サービス
            </h1>
            <p className="text-slate-300 text-sm">
              履歴書作成とは別のサービスです
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* 注意事項 */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800 dark:text-amber-300">
                  <p className="font-medium mb-1">ご確認ください</p>
                  <p>
                    キャリア相談は履歴書作成モニタープログラムとは別のサービスです。
                    ご利用にあたり、以下の同意が必要です。
                  </p>
                </div>
              </div>
            </div>

            {/* サービス内容 */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                相談できること
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-8 h-8 flex items-center justify-center bg-brand-cyan/10 text-brand-cyan rounded-lg">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>専任担当者がマンツーマンでサポート</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-8 h-8 flex items-center justify-center bg-brand-cyan/10 text-brand-cyan rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>あなたに合った求人を優先的にご紹介</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-8 h-8 flex items-center justify-center bg-brand-cyan/10 text-brand-cyan rounded-lg">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span>履歴書の添削・面接対策も無料</span>
                </div>
              </div>
            </div>

            {/* 同意セクション */}
            {!showLineSection && (
              <div className="space-y-4">
                <div className="border border-slate-200 dark:border-midnight-600 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-1 w-4 h-4 text-brand-cyan bg-white border-slate-300 rounded focus:ring-brand-cyan focus:ring-2"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      キャリア相談サービスの利用にあたり、
                      <Link href="/terms" className="text-brand-cyan underline">
                        利用規約
                      </Link>
                      および
                      <Link href="/privacy" className="text-brand-cyan underline">
                        プライバシーポリシー
                      </Link>
                      に同意します。キャリア相談では、求人情報のご案内やキャリアアドバイスを受けることがあります。
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleConsent}
                  disabled={!consentChecked}
                  className="w-full py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckSquare className="w-5 h-5" />
                  同意してキャリア相談へ進む
                </button>
              </div>
            )}

            {/* LINE CTA（同意後に表示） */}
            {showLineSection && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                    同意が完了しました
                  </p>
                </div>

                <a
                  href={LINE_ADD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full py-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  LINEで友達追加する
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  LINEを追加いただくと、担当者からスムーズにご連絡できます
                </p>
              </div>
            )}
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
