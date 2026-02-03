'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  User,
  Mic,
  Sparkles,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { BasicInfoForm, type BasicInfo } from '@/components/taishoku/BasicInfoForm'
import { VoiceRecorder } from '@/components/taishoku/VoiceRecorder'
import { ResumePreview } from '@/components/taishoku/ResumePreview'
import { ResumePdf } from '@/components/taishoku/ResumePdf'
import type { ResumeData } from '@/lib/gemini'

// ステップ定義
const STEPS = [
  { id: 1, title: '基本情報', icon: User },
  { id: 2, title: '音声入力', icon: Mic },
  { id: 3, title: 'AI生成', icon: Sparkles },
  { id: 4, title: '確認・出力', icon: FileText },
]

// セッション情報の型
interface SessionInfo {
  id: string
  sessionToken: string
}

export default function ResumePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // セッション管理
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const sessionInitialized = useRef(false)

  // フォームデータ
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    name: '',
    phone: '',
    age: '',
    prefecture: '',
  })
  const [transcript, setTranscript] = useState<string>('')
  const [resume, setResume] = useState<ResumeData | null>(null)

  // セッション初期化（ページ読み込み時に1回だけ）
  useEffect(() => {
    if (sessionInitialized.current) return
    sessionInitialized.current = true

    const initSession = async () => {
      try {
        // 既存セッションをsessionStorageから復元
        const existingToken = sessionStorage.getItem('monitor_session_token')
        const existingId = sessionStorage.getItem('monitor_session_id')
        if (existingToken && existingId) {
          setSessionInfo({ id: existingId, sessionToken: existingToken })
          return
        }

        // 新しいセッションを作成
        const response = await fetch('/api/monitor/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source: 'public' }),
        })

        if (response.ok) {
          const { session } = await response.json()
          setSessionInfo({
            id: session.id,
            sessionToken: session.sessionToken,
          })
          sessionStorage.setItem('monitor_session_token', session.sessionToken)
          sessionStorage.setItem('monitor_session_id', session.id)
        }
      } catch (err) {
        // セッション初期化失敗はブロッキングにしない
        console.error('Session init error (non-blocking):', err)
      }
    }

    initSession()
  }, [])

  // セッション更新ヘルパー（非ブロッキング）
  const updateSession = useCallback(
    async (action: string, data?: Record<string, unknown>) => {
      if (!sessionInfo) return
      try {
        await fetch(`/api/monitor/sessions/${sessionInfo.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            sessionToken: sessionInfo.sessionToken,
            data,
          }),
        })
      } catch (err) {
        console.error('Session update error (non-blocking):', err)
      }
    },
    [sessionInfo]
  )

  // Step 1: 基本情報入力完了
  const handleBasicInfoNext = useCallback(() => {
    setCurrentStep(2)
    // セッションに基本情報を保存
    updateSession('basic_info', basicInfo as unknown as Record<string, unknown>)
  }, [basicInfo, updateSession])

  // Step 2: 音声処理
  const handleAudioReady = useCallback(async (audioBlob: Blob, mimeType: string) => {
    setIsProcessing(true)
    setError(null)

    try {
      // 1. 音声を文字起こし（monitor APIを使用）
      const formData = new FormData()
      formData.append('audio', audioBlob, 'audio.webm')
      if (sessionInfo?.sessionToken) {
        formData.append('sessionToken', sessionInfo.sessionToken)
      }

      const transcribeResponse = await fetch('/api/monitor/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!transcribeResponse.ok) {
        const errorData = await transcribeResponse.json()
        throw new Error(errorData.error || 'Failed to transcribe audio')
      }

      const { transcript: transcribedText } = await transcribeResponse.json()
      setTranscript(transcribedText)

      // 2. 履歴書を生成（monitor APIを使用）
      const generateResponse = await fetch('/api/monitor/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcribedText,
          personalInfo: basicInfo,
          sessionToken: sessionInfo?.sessionToken,
        }),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json()
        throw new Error(errorData.error || 'Failed to generate resume')
      }

      const { resume: generatedResume } = await generateResponse.json()
      setResume(generatedResume)
      setCurrentStep(3)
    } catch (err) {
      console.error('Processing error:', err)
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsProcessing(false)
    }
  }, [basicInfo, sessionInfo])

  // Step 3: 履歴書更新
  const handleResumeUpdate = useCallback((updatedResume: ResumeData) => {
    setResume(updatedResume)
  }, [])

  // Step 3: AI修正
  const handleRefine = useCallback(async (instructions: string) => {
    if (!resume) return
    setIsRefining(true)

    try {
      const response = await fetch('/api/monitor/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refine',
          currentResume: resume,
          instructions,
          sessionToken: sessionInfo?.sessionToken,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to refine resume')
      }

      const { resume: refinedResume } = await response.json()
      setResume(refinedResume)
    } catch (err) {
      console.error('Refine error:', err)
      setError(err instanceof Error ? err.message : '修正に失敗しました')
    } finally {
      setIsRefining(false)
    }
  }, [resume, sessionInfo])

  // Step 3: 確認完了 → Step 4へ
  const handleConfirmResume = useCallback(() => {
    setCurrentStep(4)
  }, [])

  // Step 4: PDF出力完了
  const handleDownloadComplete = useCallback(async () => {
    if (!resume) return

    try {
      // スプレッドシートに保存（二重書き込み維持）
      await fetch('/api/taishoku/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume }),
      })

      // セッションを完了に更新
      updateSession('complete')

      // sessionStorageに名前とベース履歴書を保存
      sessionStorage.setItem('taishoku_user_name', resume.personalInfo.name)
      sessionStorage.setItem('monitor_base_resume', JSON.stringify(resume))
      // セッション情報をクリア（次回は新規セッション）
      sessionStorage.removeItem('monitor_session_token')
      sessionStorage.removeItem('monitor_session_id')

      // 完了ページへ遷移
      router.push('/monitor-program/complete')
    } catch (err) {
      console.error('Save error:', err)
      // エラーでも完了ページへ遷移
      sessionStorage.setItem('taishoku_user_name', resume.personalInfo.name)
      sessionStorage.setItem('monitor_base_resume', JSON.stringify(resume))
      sessionStorage.removeItem('monitor_session_token')
      sessionStorage.removeItem('monitor_session_id')
      router.push('/monitor-program/complete')
    }
  }, [resume, router, updateSession])

  // 前のステップに戻る
  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

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

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-brand-cyan text-white shadow-lg shadow-brand-cyan/25'
                        : 'bg-slate-200 dark:bg-midnight-700 text-slate-500 dark:text-slate-300'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium whitespace-nowrap ${
                      currentStep >= step.id
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-300'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-full h-0.5 mx-2 ${
                      currentStep > step.id
                        ? 'bg-green-500'
                        : 'bg-slate-200 dark:bg-midnight-700'
                    }`}
                    style={{ minWidth: '40px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {currentStep > 1 && currentStep < 4 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-brand-cyan transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </button>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">エラーが発生しました</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white dark:bg-midnight-800 rounded-2xl shadow-lg border border-slate-200 dark:border-midnight-600 p-6 md:p-8">
          {/* Step 1: 基本情報 */}
          {currentStep === 1 && (
            <BasicInfoForm
              data={basicInfo}
              onChange={setBasicInfo}
              onNext={handleBasicInfoNext}
            />
          )}

          {/* Step 2: 音声入力 */}
          {currentStep === 2 && (
            <VoiceRecorder
              onAudioReady={handleAudioReady}
              isProcessing={isProcessing}
            />
          )}

          {/* Step 3: 履歴書プレビュー */}
          {currentStep === 3 && resume && (
            <div className="space-y-6">
              <ResumePreview
                resume={resume}
                onUpdate={handleResumeUpdate}
                onRefine={handleRefine}
                isRefining={isRefining}
              />

              {/* 確認完了ボタン */}
              <button
                onClick={handleConfirmResume}
                className="w-full py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-brand-cyan/25 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                内容を確定してPDF出力へ
              </button>
            </div>
          )}

          {/* Step 4: PDF出力 */}
          {currentStep === 4 && resume && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  履歴書の作成が完了しました
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  PDFをダウンロードして保存してください
                </p>
              </div>

              {/* PDF出力 */}
              <ResumePdf
                resume={resume}
                onDownloadComplete={handleDownloadComplete}
              />
            </div>
          )}
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-midnight-800 rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl">
              <div className="w-16 h-16 bg-brand-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                AIが履歴書を作成中...
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                音声を解析して履歴書を生成しています。
                <br />
                しばらくお待ちください。
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-midnight-700 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-brand-cyan font-semibold">
                CareerBridge
              </Link>
              <span className="text-xs text-slate-500 dark:text-slate-300">
                運営: 株式会社エヌアンドエス
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
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
