'use client'

import { useState } from 'react'
import {
  Loader2,
  Sparkles,
  FileText,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { ResumePreview } from '@/components/taishoku/ResumePreview'
import { ResumePdf } from '@/components/taishoku/ResumePdf'
import type { ResumeData } from '@/lib/gemini'
import type { CompanyAnalysis } from '@/components/monitor/CompanyAnalyzer'

interface CustomizedResumePreviewProps {
  baseResume: ResumeData
  companyAnalysis: CompanyAnalysis
  onComplete: () => void
}

export function CustomizedResumePreview({
  baseResume,
  companyAnalysis,
  onComplete,
}: CustomizedResumePreviewProps) {
  const [customizedResume, setCustomizedResume] = useState<ResumeData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPdf, setShowPdf] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/monitor/customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'customize',
          baseResume,
          companyAnalysis,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '履歴書のカスタマイズに失敗しました')
      }

      const { resume } = await response.json()
      setCustomizedResume(resume)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'カスタマイズに失敗しました')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleResumeUpdate = (updated: ResumeData) => {
    setCustomizedResume(updated)
  }

  const handleRefine = async (instructions: string) => {
    if (!customizedResume) return

    try {
      const response = await fetch('/api/monitor/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refine',
          currentResume: customizedResume,
          instructions,
        }),
      })

      if (!response.ok) throw new Error('修正に失敗しました')
      const { resume } = await response.json()
      setCustomizedResume(resume)
    } catch (err) {
      setError(err instanceof Error ? err.message : '修正に失敗しました')
    }
  }

  // Step 1: Generate button
  if (!customizedResume && !isGenerating) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-brand-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-brand-cyan" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {companyAnalysis.companyName}向けの履歴書を生成
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            あなたの履歴書を、この企業に合わせて自己PRと職務経歴の表現を最適化します。
            <br />
            経歴の事実は変更せず、表現のみを調整します。
          </p>
          <button
            onClick={handleGenerate}
            className="px-8 py-3 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-brand-cyan/25 transition-all flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            企業特化履歴書を生成
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    )
  }

  // Step 2: Generating
  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-brand-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          企業特化履歴書を生成中...
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {companyAnalysis.companyName}に合わせた内容を作成しています
        </p>
      </div>
    )
  }

  // Step 3: Preview & Edit
  if (customizedResume && !showPdf) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <strong>{companyAnalysis.companyName}</strong>向けに最適化されました
          </p>
        </div>

        <ResumePreview
          resume={customizedResume}
          onUpdate={handleResumeUpdate}
          onRefine={handleRefine}
          isRefining={false}
        />

        <button
          onClick={() => setShowPdf(true)}
          className="w-full py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-brand-cyan/25 transition-all flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" />
          内容を確定してPDF出力へ
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    )
  }

  // Step 4: PDF Download
  if (customizedResume && showPdf) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            企業特化履歴書のPDFダウンロード
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {companyAnalysis.companyName}向け
          </p>
        </div>

        <ResumePdf
          resume={customizedResume}
          onDownloadComplete={onComplete}
        />
      </div>
    )
  }

  return null
}
