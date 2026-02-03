'use client'

import { useState } from 'react'
import {
  Building2,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Users,
  Heart,
  Star,
} from 'lucide-react'

export interface CompanyAnalysis {
  companyName: string
  industry: string
  businessDescription: string
  desiredTalent: string
  companyCulture: string
  keyPoints: string[]
}

interface CompanyAnalyzerProps {
  onAnalysisComplete: (analysis: CompanyAnalysis) => void
}

export function CompanyAnalyzer({ onAnalysisComplete }: CompanyAnalyzerProps) {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null)

  const handleAnalyze = async () => {
    if (!url.trim()) return
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/monitor/customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze', companyUrl: url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '企業分析に失敗しました')
      }

      const { analysis: result } = await response.json()
      setAnalysis(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '企業分析に失敗しました')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleProceed = () => {
    if (analysis) {
      onAnalysisComplete(analysis)
    }
  }

  return (
    <div className="space-y-6">
      {/* URL入力 */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          応募先企業のURLを入力
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          企業のWebサイトや求人ページのURLを入力すると、AIが企業情報を分析し、
          その企業に最適化された履歴書を生成します。
        </p>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-midnight-600 rounded-lg bg-white dark:bg-midnight-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan"
              disabled={isAnalyzing}
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!url.trim() || isAnalyzing}
            className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-medium rounded-lg hover:shadow-lg hover:shadow-brand-cyan/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAnalyzing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {isAnalyzing ? '分析中...' : '分析'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">企業分析が完了しました</span>
          </div>

          <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-xl p-6 space-y-4">
            {/* Company Name & Industry */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {analysis.companyName}
              </h3>
              <span className="inline-block px-2 py-0.5 bg-brand-cyan/10 text-brand-cyan text-xs rounded-full mt-1">
                {analysis.industry}
              </span>
            </div>

            {/* Business Description */}
            <div className="flex gap-3">
              <Briefcase className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-300 mb-1">
                  事業内容
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {analysis.businessDescription}
                </p>
              </div>
            </div>

            {/* Desired Talent */}
            {analysis.desiredTalent && (
              <div className="flex gap-3">
                <Users className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-300 mb-1">
                    求める人材像
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {analysis.desiredTalent}
                  </p>
                </div>
              </div>
            )}

            {/* Company Culture */}
            {analysis.companyCulture && (
              <div className="flex gap-3">
                <Heart className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-300 mb-1">
                    企業文化
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {analysis.companyCulture}
                  </p>
                </div>
              </div>
            )}

            {/* Key Points */}
            {analysis.keyPoints.length > 0 && (
              <div className="flex gap-3">
                <Star className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-300 mb-1">
                    履歴書作成のポイント
                  </p>
                  <ul className="space-y-1">
                    {analysis.keyPoints.map((point, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-brand-cyan mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* 次へボタン */}
          <button
            onClick={handleProceed}
            className="w-full py-3 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-brand-cyan/25 transition-all flex items-center justify-center gap-2"
          >
            この企業で履歴書を最適化する
          </button>
        </div>
      )}
    </div>
  )
}
