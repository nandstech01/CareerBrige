'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Shield, CheckSquare, Loader2 } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const CONSENT_VERSION = '1.0.0'

function ConsentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/monitor-program/resume'

  const [consents, setConsents] = useState({
    data_collection: false,
    ai_processing: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const allConsented = consents.data_collection && consents.ai_processing

  const handleSubmit = async () => {
    if (!allConsented) return
    setIsSubmitting(true)

    try {
      const sessionToken = sessionStorage.getItem('monitor_session_token')

      // Record each consent
      for (const [type, value] of Object.entries(consents)) {
        await fetch('/api/monitor/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionToken,
            consentType: type,
            consented: value,
            consentVersion: CONSENT_VERSION,
          }),
        })
      }

      router.push(redirectTo)
    } catch (err) {
      console.error('Consent error:', err)
      // Proceed anyway
      router.push(redirectTo)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-midnight-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-midnight-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/monitor-program" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-cyan">CareerBridge</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        <Link
          href="/monitor-program"
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-brand-cyan transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Link>

        <div className="bg-white dark:bg-midnight-800 rounded-2xl shadow-lg border border-slate-200 dark:border-midnight-600 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-brand-cyan" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              同意事項の確認
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              サービスのご利用にあたり、以下の事項にご同意ください。
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {/* Data Collection Consent */}
            <label className="flex items-start gap-3 p-4 border border-slate-200 dark:border-midnight-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-midnight-700/50 transition-colors">
              <input
                type="checkbox"
                checked={consents.data_collection}
                onChange={(e) => setConsents(prev => ({ ...prev, data_collection: e.target.checked }))}
                className="mt-1 w-4 h-4 text-brand-cyan border-slate-300 rounded focus:ring-brand-cyan"
              />
              <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  データの収集・保存
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  入力いただいた基本情報、音声データ、生成された履歴書データを、サービス提供の目的で収集・保存します。
                  データは暗号化して保管され、利用規約に基づいて管理されます。
                </p>
              </div>
            </label>

            {/* AI Processing Consent */}
            <label className="flex items-start gap-3 p-4 border border-slate-200 dark:border-midnight-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-midnight-700/50 transition-colors">
              <input
                type="checkbox"
                checked={consents.ai_processing}
                onChange={(e) => setConsents(prev => ({ ...prev, ai_processing: e.target.checked }))}
                className="mt-1 w-4 h-4 text-brand-cyan border-slate-300 rounded focus:ring-brand-cyan"
              />
              <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  AI処理
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  音声データの文字起こしおよび履歴書データの生成に、AIサービス（Google Gemini）を利用します。
                  処理されたデータはAIプロバイダのポリシーに準拠して取り扱われます。
                </p>
              </div>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!allConsented || isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CheckSquare className="w-5 h-5" />
            {isSubmitting ? '処理中...' : '同意して続行'}
          </button>

          <p className="text-xs text-slate-400 text-center mt-4">
            <Link href="/terms" className="text-brand-cyan hover:underline">利用規約</Link>
            {' '}および{' '}
            <Link href="/privacy" className="text-brand-cyan hover:underline">プライバシーポリシー</Link>
            {' '}をご確認ください。
          </p>
        </div>
      </main>
    </div>
  )
}

export default function ConsentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
        </div>
      }
    >
      <ConsentContent />
    </Suspense>
  )
}
