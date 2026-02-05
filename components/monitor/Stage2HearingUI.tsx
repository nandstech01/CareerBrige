'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Mic, Square, Upload, Play, Pause, Trash2, AlertCircle, CheckCircle, Loader2, ChevronRight, Briefcase, GraduationCap, Award, Calendar } from 'lucide-react'
import type { Stage1Data, Stage2Data } from '@/types/database'

interface Stage2HearingUIProps {
  sessionId: string
  stage1Data: Stage1Data
  basicInfo: { name: string; prefecture: string }
  onComplete: (stage2Data: Stage2Data, transcript: string) => void
}

export function Stage2HearingUI({ sessionId, stage1Data, basicInfo, onComplete }: Stage2HearingUIProps) {
  const [step, setStep] = useState<'intro' | 'recording' | 'processing' | 'result'>('intro')
  const [mode, setMode] = useState<'idle' | 'recording' | 'recorded' | 'uploaded'>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mimeType, setMimeType] = useState<string>('audio/webm')
  const [result, setResult] = useState<{ stage2Data: Stage2Data; transcript: string } | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [audioUrl])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      let selectedMimeType = 'audio/webm'
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        selectedMimeType = 'audio/webm;codecs=opus'
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        selectedMimeType = 'audio/mp4'
      }

      setMimeType(selectedMimeType)
      const mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMimeType })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: selectedMimeType })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        setMode('recorded')
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(1000)
      setMode('recording')
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000)
    } catch (err) {
      console.error('Recording error:', err)
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError('マイクへのアクセスが拒否されました。')
      } else {
        setError('録音を開始できませんでした。')
      }
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop()
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    if (file.size > 25 * 1024 * 1024) {
      setError('ファイルサイズは25MB以下にしてください。')
      return
    }

    setAudioBlob(file)
    setMimeType(file.type || 'audio/mpeg')
    setAudioUrl(URL.createObjectURL(file))
    setMode('uploaded')
  }, [])

  const togglePlayback = useCallback(() => {
    if (!audioRef.current || !audioUrl) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
    setIsPlaying(!isPlaying)
  }, [isPlaying, audioUrl])

  const handleReset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioBlob(null)
    setAudioUrl(null)
    setMode('idle')
    setRecordingTime(0)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [audioUrl])

  const handleSubmit = useCallback(async () => {
    if (!audioBlob) return

    setIsProcessing(true)
    setStep('processing')
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, `recording.${mimeType.split('/')[1]}`)
      formData.append('sessionId', sessionId)

      const response = await fetch('/api/monitor/hearing/stage2', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Stage2の処理に失敗しました')
      }

      setResult({ stage2Data: data.stage2Data, transcript: data.transcript })
      setStep('result')
    } catch (err) {
      console.error('Stage2 error:', err)
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      setStep('recording')
    } finally {
      setIsProcessing(false)
    }
  }, [audioBlob, mimeType, sessionId])

  const handleComplete = () => {
    if (result) {
      onComplete(result.stage2Data, result.transcript)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Intro - show Stage1 summary
  if (step === 'intro') {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cyan/10 text-brand-cyan text-sm font-medium rounded-full mb-4">
            Stage 2 / 2
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            経歴をヒアリング
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            学歴・職歴・資格について話してください
          </p>
        </div>

        {/* Stage1 Summary */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium mb-2">
            <CheckCircle className="w-4 h-4" />
            Stage 1 完了済み
          </div>
          <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
            <p><strong>志望の動機:</strong> {stage1Data.motivation.substring(0, 50)}...</p>
            <p><strong>自己PR:</strong> {stage1Data.selfPR.substring(0, 50)}...</p>
          </div>
        </div>

        <div className="bg-brand-cyan/5 border border-brand-cyan/20 rounded-lg p-4">
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">話す内容の例:</p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <li>・「1996年4月15日生まれです」（生年月日）</li>
            <li>・「○○高校を卒業しました」</li>
            <li>・「大学は○○大学の△△学部を卒業」</li>
            <li>・「4ヶ月前まで○○株式会社で営業をしていた」</li>
            <li>・「普通自動車免許を持っています」</li>
          </ul>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            ※ 生年月日から卒業年をAIが自動計算します
          </p>
        </div>

        <button
          onClick={() => setStep('recording')}
          className="w-full py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:from-brand-cyan-dark hover:to-brand-cyan text-white font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
        >
          経歴の録音を開始
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    )
  }

  // Processing
  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-brand-cyan animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          AIが経歴を生成中...
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
          音声を文字起こしし、学歴・職歴を計算しています
        </p>
      </div>
    )
  }

  // Result
  if (step === 'result' && result) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-4">
            <CheckCircle className="w-4 h-4" />
            Stage 2 完了
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            経歴が生成されました
          </h2>
        </div>

        <div className="space-y-4">
          {/* Birth Date */}
          {result.stage2Data.birthDate && result.stage2Data.birthDate.year > 0 && (
            <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4">
              <h4 className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                <Calendar className="w-4 h-4" />
                生年月日
              </h4>
              <p className="text-sm text-slate-900 dark:text-white">
                {result.stage2Data.birthDate.year}年{result.stage2Data.birthDate.month}月
                {result.stage2Data.birthDate.day && `${result.stage2Data.birthDate.day}日`}生まれ
              </p>
            </div>
          )}

          {/* Education */}
          <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              <GraduationCap className="w-4 h-4" />
              学歴
            </h4>
            {result.stage2Data.education.length > 0 ? (
              <ul className="space-y-2">
                {result.stage2Data.education.map((edu, idx) => (
                  <li key={idx} className="text-sm text-slate-900 dark:text-white">
                    {edu.graduationYear}年{edu.graduationMonth}月 {edu.schoolName}
                    {edu.department && ` ${edu.department}`} {edu.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">学歴情報なし</p>
            )}
          </div>

          {/* Work History */}
          <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              <Briefcase className="w-4 h-4" />
              職歴
            </h4>
            {result.stage2Data.workHistory.length > 0 ? (
              <ul className="space-y-3">
                {result.stage2Data.workHistory.map((work, idx) => (
                  <li key={idx} className="text-sm text-slate-900 dark:text-white">
                    <div className="font-medium">{work.companyName}</div>
                    <div className="text-slate-600 dark:text-slate-400">
                      {work.startYear}年{work.startMonth}月〜
                      {work.isCurrent ? '現在' : `${work.endYear}年${work.endMonth}月`}
                      {work.position && ` / ${work.position}`}
                    </div>
                    {work.description && (
                      <div className="text-slate-500 dark:text-slate-400 mt-1">{work.description}</div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">職歴情報なし</p>
            )}
          </div>

          {/* Qualifications */}
          <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              <Award className="w-4 h-4" />
              資格
            </h4>
            {result.stage2Data.qualifications.length > 0 ? (
              <ul className="space-y-1">
                {result.stage2Data.qualifications.map((qual, idx) => (
                  <li key={idx} className="text-sm text-slate-900 dark:text-white">
                    {qual.year && `${qual.year}年${qual.month || ''}月 `}{qual.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">資格情報なし</p>
            )}
          </div>
        </div>

        <button
          onClick={handleComplete}
          className="w-full py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:from-brand-cyan-dark hover:to-brand-cyan text-white font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
        >
          次へ：写真アップロード・PDF出力
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    )
  }

  // Recording UI
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cyan/10 text-brand-cyan text-sm font-medium rounded-full mb-4">
          Stage 2 / 2
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          経歴を録音
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          学歴・職歴・資格について話してください
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-2xl p-6 border border-slate-200 dark:border-midnight-600">
        {mode === 'idle' && (
          <div className="space-y-4">
            <button
              onClick={startRecording}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Mic className="w-6 h-6" />
              録音を開始
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-midnight-500" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-slate-50 dark:bg-midnight-700/50 text-sm text-slate-500">または</span>
              </div>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.webm,.ogg,.m4a"
                onChange={handleFileUpload}
                className="hidden"
                id="stage2-audio-upload"
              />
              <label
                htmlFor="stage2-audio-upload"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-midnight-700 border-2 border-dashed border-slate-300 dark:border-midnight-500 text-slate-700 dark:text-slate-300 font-medium rounded-xl cursor-pointer hover:border-brand-cyan transition-colors"
              >
                <Upload className="w-5 h-5" />
                音声ファイルをアップロード
              </label>
            </div>
          </div>
        )}

        {mode === 'recording' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 bg-red-500/20 rounded-full animate-ping absolute inset-0" />
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center relative">
                  <Mic className="w-10 h-10 text-white" />
                </div>
              </div>
              <p className="mt-4 text-2xl font-mono font-semibold text-slate-900 dark:text-white">
                {formatTime(recordingTime)}
              </p>
              <p className="text-sm text-red-500 font-medium animate-pulse">録音中...</p>
            </div>

            <button
              onClick={stopRecording}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
            >
              <Square className="w-5 h-5" />
              録音を停止
            </button>
          </div>
        )}

        {(mode === 'recorded' || mode === 'uploaded') && audioUrl && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white dark:bg-midnight-700 rounded-xl p-4 border border-slate-200 dark:border-midnight-600">
              <button
                onClick={togglePlayback}
                className="w-12 h-12 flex items-center justify-center bg-brand-cyan text-white rounded-full hover:bg-brand-cyan-dark transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {mode === 'recorded' ? '録音した音声' : 'アップロードした音声'}
                </p>
                {mode === 'recorded' && (
                  <p className="text-xs text-slate-500">{formatTime(recordingTime)}</p>
                )}
              </div>
              <button onClick={handleReset} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
              <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
            </div>

            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              音声の準備ができました
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-slate-200 dark:bg-midnight-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-midnight-500 transition-colors"
              >
                やり直す
              </button>
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="flex-1 py-3 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    処理中...
                  </>
                ) : (
                  '経歴を生成'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
