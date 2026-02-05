'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { Stage1HearingUI } from '@/components/monitor/Stage1HearingUI'
import { Stage2HearingUI } from '@/components/monitor/Stage2HearingUI'
import { HeadshotUploader } from '@/components/monitor/HeadshotUploader'
import { RirekishoPdf } from '@/components/monitor/RirekishoPdf'
import { ShokumukeirekishoPdf } from '@/components/monitor/ShokumukeirekishoPdf'
import type { Stage1Data, Stage2Data } from '@/types/database'

interface BasicInfo {
  name?: string
  postalCode?: string
  prefecture?: string
  city?: string
  streetAddress?: string
  gender?: string
  lineId?: string
}

interface SessionData {
  id: string
  status: string
  source: string
  basic_info: BasicInfo | null
  stage1_data: Stage1Data | null
  stage1_transcript: string | null
  stage2_data: Stage2Data | null
  stage2_transcript: string | null
  headshot_url: string | null
  current_stage: number
}

type HearingStep = 'loading' | 'stage1' | 'stage2' | 'headshot' | 'pdf' | 'completed'

export default function HearingSessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const [session, setSession] = useState<SessionData | null>(null)
  const [step, setStep] = useState<HearingStep>('loading')
  const [error, setError] = useState<string | null>(null)
  const [stage1Data, setStage1Data] = useState<Stage1Data | null>(null)
  const [stage2Data, setStage2Data] = useState<Stage2Data | null>(null)
  const [headshotUrl, setHeadshotUrl] = useState<string | null>(null)
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    name: '',
    postalCode: '',
    prefecture: '',
    city: '',
    streetAddress: '',
  })

  // Fetch session data
  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`/api/monitor/sessions/${sessionId}`)
        if (!response.ok) {
          throw new Error('セッションが見つかりません')
        }
        const data = await response.json()
        setSession(data)

        // Set basicInfo from session data
        if (data.basic_info) {
          setBasicInfo({
            name: data.basic_info.name || '',
            postalCode: data.basic_info.postalCode || '',
            prefecture: data.basic_info.prefecture || '',
            city: data.basic_info.city || '',
            streetAddress: data.basic_info.streetAddress || '',
          })
        }

        // Determine current step based on session data
        if (data.stage2_data && data.headshot_url) {
          setStep('pdf')
          setStage1Data(data.stage1_data)
          setStage2Data(data.stage2_data)
          setHeadshotUrl(data.headshot_url)
        } else if (data.stage2_data) {
          setStep('headshot')
          setStage1Data(data.stage1_data)
          setStage2Data(data.stage2_data)
        } else if (data.stage1_data) {
          setStep('stage2')
          setStage1Data(data.stage1_data)
        } else {
          setStep('stage1')
        }
      } catch (err) {
        console.error('Error fetching session:', err)
        setError(err instanceof Error ? err.message : 'エラーが発生しました')
      }
    }

    if (sessionId) {
      fetchSession()
    }
  }, [sessionId])

  const handleStage1Complete = useCallback((data: Stage1Data, _transcript: string, updatedBasicInfo: BasicInfo) => {
    setStage1Data(data)
    setBasicInfo(updatedBasicInfo)
    setStep('stage2')
  }, [])

  const handleStage2Complete = useCallback((data: Stage2Data) => {
    setStage2Data(data)
    setStep('headshot')
  }, [])

  const handleHeadshotComplete = useCallback((url: string) => {
    setHeadshotUrl(url)
    setStep('pdf')
  }, [])

  const handleSkipHeadshot = useCallback(() => {
    setStep('pdf')
  }, [])

  const handlePdfDownloadComplete = useCallback(() => {
    setStep('completed')
  }, [])

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-midnight-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-brand-cyan animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-midnight-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            href="/admin/monitor/sessions"
            className="text-brand-cyan hover:underline"
          >
            セッション一覧に戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight-900">
      {/* Header */}
      <header className="bg-white dark:bg-midnight-800 border-b border-slate-200 dark:border-midnight-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/monitor/sessions"
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-midnight-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </Link>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-white">
                {basicInfo.name || '匿名'} さんのヒアリング
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {basicInfo.prefecture && basicInfo.prefecture}
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            <StepIndicator step={1} label="志望動機" isActive={step === 'stage1'} isComplete={!!stage1Data} />
            <div className="w-4 h-0.5 bg-slate-200 dark:bg-midnight-600" />
            <StepIndicator step={2} label="経歴" isActive={step === 'stage2'} isComplete={!!stage2Data} />
            <div className="w-4 h-0.5 bg-slate-200 dark:bg-midnight-600" />
            <StepIndicator step={3} label="写真" isActive={step === 'headshot'} isComplete={!!headshotUrl} />
            <div className="w-4 h-0.5 bg-slate-200 dark:bg-midnight-600" />
            <StepIndicator step={4} label="PDF" isActive={step === 'pdf' || step === 'completed'} isComplete={step === 'completed'} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-midnight-800 rounded-2xl shadow-lg border border-slate-200 dark:border-midnight-700 p-6 md:p-8">
          {step === 'stage1' && (
            <Stage1HearingUI
              sessionId={sessionId}
              initialBasicInfo={{
                name: basicInfo.name || '',
                postalCode: basicInfo.postalCode || '',
                prefecture: basicInfo.prefecture || '',
                city: basicInfo.city || '',
                streetAddress: basicInfo.streetAddress || '',
              }}
              onComplete={handleStage1Complete}
            />
          )}

          {step === 'stage2' && stage1Data && (
            <Stage2HearingUI
              sessionId={sessionId}
              stage1Data={stage1Data}
              basicInfo={{
                name: basicInfo.name || '',
                prefecture: basicInfo.prefecture || '',
              }}
              onComplete={handleStage2Complete}
            />
          )}

          {step === 'headshot' && (
            <div className="space-y-6">
              <HeadshotUploader
                sessionId={sessionId}
                onUploadComplete={handleHeadshotComplete}
              />
              <div className="text-center">
                <button
                  onClick={handleSkipHeadshot}
                  className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 underline"
                >
                  写真なしで続ける
                </button>
              </div>
            </div>
          )}

          {step === 'pdf' && stage1Data && stage2Data && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-4">
                  <CheckCircle className="w-4 h-4" />
                  ヒアリング完了
                </div>

                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  履歴書・職務経歴書を出力
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  下のボタンをクリックしてPDFをダウンロードしてください
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RirekishoPdf
                  basicInfo={{
                    name: basicInfo.name || '',
                    postalCode: basicInfo.postalCode || '',
                    prefecture: basicInfo.prefecture || '',
                    city: basicInfo.city || '',
                    streetAddress: basicInfo.streetAddress || '',
                  }}
                  stage1Data={stage1Data}
                  stage2Data={stage2Data}
                  headshotUrl={headshotUrl}
                  onDownloadComplete={handlePdfDownloadComplete}
                />

                <ShokumukeirekishoPdf
                  basicInfo={{
                    name: basicInfo.name || '',
                    postalCode: basicInfo.postalCode || '',
                    prefecture: basicInfo.prefecture || '',
                    city: basicInfo.city || '',
                    streetAddress: basicInfo.streetAddress || '',
                  }}
                  stage1Data={stage1Data}
                  stage2Data={stage2Data}
                  onDownloadComplete={handlePdfDownloadComplete}
                />
              </div>

              {/* Summary */}
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">生成内容サマリー</h3>

                <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">志望の動機</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stage1Data.motivation}</p>
                </div>

                <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">学歴</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {stage2Data.education.map((edu, i) => (
                      <li key={i}>
                        {edu.graduationYear}年{edu.graduationMonth}月 {edu.schoolName} {edu.status}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">職歴</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {stage2Data.workHistory.map((work, i) => (
                      <li key={i}>
                        {work.startYear}年{work.startMonth}月〜
                        {work.isCurrent ? '現在' : `${work.endYear}年${work.endMonth}月`}
                        {' '}{work.companyName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 'completed' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                履歴書作成完了
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                PDFのダウンロードが完了しました
              </p>
              <Link
                href="/admin/monitor/sessions"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-white font-semibold rounded-lg hover:bg-brand-cyan-dark transition-colors"
              >
                セッション一覧に戻る
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function StepIndicator({
  step,
  label,
  isActive,
  isComplete
}: {
  step: number
  label: string
  isActive: boolean
  isComplete: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          isComplete
            ? 'bg-green-500 text-white'
            : isActive
            ? 'bg-brand-cyan text-white'
            : 'bg-slate-200 dark:bg-midnight-600 text-slate-500 dark:text-slate-400'
        }`}
      >
        {isComplete ? <CheckCircle className="w-3.5 h-3.5" /> : step}
      </div>
      <span
        className={`text-xs hidden md:inline ${
          isActive || isComplete
            ? 'text-slate-700 dark:text-slate-300 font-medium'
            : 'text-slate-400 dark:text-slate-500'
        }`}
      >
        {label}
      </span>
    </div>
  )
}
