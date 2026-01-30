'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building2, Sparkles, FileText } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { CompanyAnalyzer, type CompanyAnalysis } from '@/components/monitor/CompanyAnalyzer'
import { CustomizedResumePreview } from '@/components/monitor/CustomizedResumePreview'
import type { ResumeData } from '@/lib/gemini'

// ステップ定義
const STEPS = [
  { id: 1, title: '企業分析', icon: Building2 },
  { id: 2, title: 'AI最適化', icon: Sparkles },
  { id: 3, title: 'PDF出力', icon: FileText },
]

export default function CustomizePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [baseResume, setBaseResume] = useState<ResumeData | null>(null)
  const [companyAnalysis, setCompanyAnalysis] = useState<CompanyAnalysis | null>(null)
  const [hasResume, setHasResume] = useState(true)

  // sessionStorageからベース履歴書を取得
  useEffect(() => {
    const stored = sessionStorage.getItem('monitor_base_resume')
    if (stored) {
      try {
        setBaseResume(JSON.parse(stored))
      } catch {
        setHasResume(false)
      }
    } else {
      setHasResume(false)
    }
  }, [])

  const handleAnalysisComplete = (analysis: CompanyAnalysis) => {
    setCompanyAnalysis(analysis)
    setCurrentStep(2)
  }

  const handleCustomizeComplete = () => {
    // 完了ページへ遷移
    router.push('/monitor-program/complete')
  }

  // ベース履歴書がない場合
  if (!hasResume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-midnight-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-midnight-700">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/monitor-program" className="flex items-center gap-2">
              <span className="text-xl font-bold text-brand-cyan">CareerBridge</span>
              <span className="text-xs px-2 py-1 bg-brand-cyan/10 text-brand-cyan rounded-full font-medium">
                企業特化履歴書
              </span>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="bg-white dark:bg-midnight-800 rounded-2xl shadow-lg border border-slate-200 dark:border-midnight-600 p-8">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              まずベースの履歴書を作成してください
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              企業特化履歴書を作成するには、先にベースとなる履歴書が必要です。
            </p>
            <Link
              href="/monitor-program/resume"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-medium rounded-lg hover:shadow-lg hover:shadow-brand-cyan/25 transition-all"
            >
              <FileText className="w-5 h-5" />
              履歴書を作成する
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-midnight-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-midnight-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/monitor-program" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-cyan">CareerBridge</span>
            <span className="text-xs px-2 py-1 bg-brand-cyan/10 text-brand-cyan rounded-full font-medium">
              企業特化履歴書
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-brand-cyan text-white shadow-lg shadow-brand-cyan/25'
                        : 'bg-slate-200 dark:bg-midnight-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium whitespace-nowrap ${
                      currentStep >= step.id
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      currentStep > step.id
                        ? 'bg-green-500'
                        : 'bg-slate-200 dark:bg-midnight-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-brand-cyan transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </button>
        )}

        {/* Step Content */}
        <div className="bg-white dark:bg-midnight-800 rounded-2xl shadow-lg border border-slate-200 dark:border-midnight-600 p-6 md:p-8">
          {/* Step 1: Company Analysis */}
          {currentStep === 1 && (
            <CompanyAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          )}

          {/* Step 2-3: Customized Resume */}
          {currentStep >= 2 && baseResume && companyAnalysis && (
            <CustomizedResumePreview
              baseResume={baseResume}
              companyAnalysis={companyAnalysis}
              onComplete={handleCustomizeComplete}
            />
          )}
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
