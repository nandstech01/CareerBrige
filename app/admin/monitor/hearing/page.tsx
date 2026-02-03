'use client'

import { useState, useCallback } from 'react'
import { Mic, Upload, Loader2, Check, FileText } from 'lucide-react'
import { BasicInfoForm, type BasicInfo } from '@/components/taishoku/BasicInfoForm'
import { VoiceRecorder } from '@/components/taishoku/VoiceRecorder'
import { ResumePreview } from '@/components/taishoku/ResumePreview'
import { ResumePdf } from '@/components/taishoku/ResumePdf'
import type { ResumeData } from '@/lib/gemini'

const STEPS = [
  { id: 1, title: '基本情報', icon: Mic },
  { id: 2, title: '音声アップロード', icon: Upload },
  { id: 3, title: 'AI生成・編集', icon: FileText },
  { id: 4, title: 'PDF出力', icon: Check },
]

export default function AdminHearingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    name: '',
    phone: '',
    age: '',
    prefecture: '',
  })
  const [resume, setResume] = useState<ResumeData | null>(null)

  const handleBasicInfoNext = useCallback(() => {
    setCurrentStep(2)
  }, [])

  const handleAudioReady = useCallback(async (audioBlob: Blob, _mimeType: string) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Create session for company hearing
      const sessionRes = await fetch('/api/monitor/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'company_hearing' }),
      })

      let sessionToken: string | undefined
      if (sessionRes.ok) {
        const { session } = await sessionRes.json()
        sessionToken = session.sessionToken
      }

      // Transcribe
      const formData = new FormData()
      formData.append('audio', audioBlob, 'hearing-audio.webm')
      if (sessionToken) formData.append('sessionToken', sessionToken)

      const transcribeResponse = await fetch('/api/monitor/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!transcribeResponse.ok) {
        const errorData = await transcribeResponse.json()
        throw new Error(errorData.error || '文字起こしに失敗しました')
      }

      const { transcript } = await transcribeResponse.json()

      // Generate resume
      const generateResponse = await fetch('/api/monitor/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          personalInfo: basicInfo,
          sessionToken,
        }),
      })

      if (!generateResponse.ok) {
        throw new Error('履歴書生成に失敗しました')
      }

      const { resume: generatedResume } = await generateResponse.json()
      setResume(generatedResume)
      setCurrentStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsProcessing(false)
    }
  }, [basicInfo])

  const handleResumeUpdate = useCallback((updated: ResumeData) => {
    setResume(updated)
  }, [])

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
        }),
      })

      if (!response.ok) throw new Error('修正に失敗しました')
      const { resume: refinedResume } = await response.json()
      setResume(refinedResume)
    } catch (err) {
      setError(err instanceof Error ? err.message : '修正に失敗しました')
    } finally {
      setIsRefining(false)
    }
  }, [resume])

  const handlePdfComplete = useCallback(() => {
    // Reset form for next hearing
    setCurrentStep(1)
    setBasicInfo({ name: '', phone: '', age: '', prefecture: '' })
    setResume(null)
    setError(null)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          ヒアリング実行
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
          Zoom音声をアップロードして、利用者の履歴書を作成します
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-4">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-brand-cyan text-white'
                    : 'bg-slate-200 dark:bg-midnight-700 text-slate-400'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span className={`mt-1 text-xs font-medium ${
                currentStep >= step.id
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400'
              }`}>
                {step.title}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 ${
                currentStep > step.id ? 'bg-green-500' : 'bg-slate-200 dark:bg-midnight-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-6">
        {currentStep === 1 && (
          <BasicInfoForm
            data={basicInfo}
            onChange={setBasicInfo}
            onNext={handleBasicInfoNext}
          />
        )}

        {currentStep === 2 && (
          <VoiceRecorder
            onAudioReady={handleAudioReady}
            isProcessing={isProcessing}
          />
        )}

        {currentStep === 3 && resume && (
          <div className="space-y-6">
            <ResumePreview
              resume={resume}
              onUpdate={handleResumeUpdate}
              onRefine={handleRefine}
              isRefining={isRefining}
            />
            <button
              onClick={() => setCurrentStep(4)}
              className="w-full py-3 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              PDF出力へ
            </button>
          </div>
        )}

        {currentStep === 4 && resume && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white">
                PDF出力
              </h3>
            </div>
            <ResumePdf resume={resume} onDownloadComplete={handlePdfComplete} />
          </div>
        )}
      </div>

      {/* Processing overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-midnight-800 rounded-2xl p-8 max-w-sm text-center shadow-2xl">
            <Loader2 className="w-8 h-8 text-brand-cyan animate-spin mx-auto mb-4" />
            <p className="font-semibold text-slate-900 dark:text-white">AI処理中...</p>
            <p className="text-sm text-slate-500 mt-1">音声の解析と履歴書生成を行っています</p>
          </div>
        </div>
      )}
    </div>
  )
}
