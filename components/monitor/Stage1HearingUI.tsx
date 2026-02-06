'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Mic, Square, Upload, Play, Pause, Trash2, AlertCircle, CheckCircle, Loader2, User, MapPin, ChevronRight, Home } from 'lucide-react'
import type { Stage1Data } from '@/types/database'

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
]

interface BasicInfo {
  name: string
  postalCode: string
  prefecture: string
  city: string
  streetAddress: string
}

interface Stage1HearingUIProps {
  sessionId: string
  initialBasicInfo?: Partial<BasicInfo>
  onComplete: (stage1Data: Stage1Data, transcript: string, basicInfo: BasicInfo) => void
}

export function Stage1HearingUI({ sessionId, initialBasicInfo, onComplete }: Stage1HearingUIProps) {
  const [step, setStep] = useState<'basic' | 'recording' | 'processing' | 'result'>('basic')
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    name: initialBasicInfo?.name || '',
    postalCode: initialBasicInfo?.postalCode || '',
    prefecture: initialBasicInfo?.prefecture || '',
    city: initialBasicInfo?.city || '',
    streetAddress: initialBasicInfo?.streetAddress || '',
  })
  const [mode, setMode] = useState<'idle' | 'recording' | 'recorded' | 'uploaded'>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mimeType, setMimeType] = useState<string>('audio/webm')
  const [result, setResult] = useState<{ stage1Data: Stage1Data; transcript: string } | null>(null)
  const [postalCodeError, setPostalCodeError] = useState<string | null>(null)

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

  // 録音中・処理中のページ離脱を警告
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (mode === 'recording' || mode === 'recorded' || isProcessing) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [mode, isProcessing])

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBasicInfo(prev => ({ ...prev, [name]: value }))
  }

  // 郵便番号から住所を自動入力
  const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setBasicInfo(prev => ({ ...prev, postalCode: value }))
    setPostalCodeError(null)

    if (value.length === 7) {
      try {
        const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${value}`)
        const data = await response.json()
        if (data.results && data.results[0]) {
          const result = data.results[0]
          setBasicInfo(prev => ({
            ...prev,
            prefecture: result.address1,
            city: result.address2 + result.address3,
          }))
        } else {
          setPostalCodeError('該当する住所が見つかりませんでした。手動で入力してください')
        }
      } catch (err) {
        console.error('Postal code lookup error:', err)
        setPostalCodeError('住所の自動入力に失敗しました。手動で入力してください')
      }
    }
  }

  const isBasicInfoValid = basicInfo.name && basicInfo.postalCode && basicInfo.prefecture && basicInfo.city

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isBasicInfoValid) {
      setStep('recording')
    }
  }

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
      formData.append('name', basicInfo.name)
      // 住所情報も送信
      formData.append('postalCode', basicInfo.postalCode)
      formData.append('prefecture', basicInfo.prefecture)
      formData.append('city', basicInfo.city)
      formData.append('streetAddress', basicInfo.streetAddress)

      const response = await fetch('/api/monitor/hearing/stage1', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Stage1の処理に失敗しました')
      }

      setResult({ stage1Data: data.stage1Data, transcript: data.transcript })
      setStep('result')
    } catch (err) {
      console.error('Stage1 error:', err)
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      setStep('recording')
    } finally {
      setIsProcessing(false)
    }
  }, [audioBlob, mimeType, sessionId, basicInfo])

  const handleComplete = () => {
    if (result) {
      onComplete(result.stage1Data, result.transcript, basicInfo)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 郵便番号フォーマット表示
  const formatPostalCode = (code: string) => {
    if (code.length > 3) {
      return `${code.slice(0, 3)}-${code.slice(3)}`
    }
    return code
  }

  // Basic Info Form
  if (step === 'basic') {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-cyan/10 text-brand-cyan text-sm font-medium rounded-full mb-4">
            Stage 1 / 2
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            基本情報を入力
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            履歴書に記載する氏名と住所を入力してください
          </p>
        </div>

        <form onSubmit={handleBasicInfoSubmit} className="space-y-5">
          {/* 氏名 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <User className="w-4 h-4" />
              氏名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={basicInfo.name}
              onChange={handleBasicInfoChange}
              placeholder="山田 太郎"
              required
              className="w-full px-4 py-3 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
            />
          </div>

          {/* 郵便番号 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <MapPin className="w-4 h-4" />
              郵便番号 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={formatPostalCode(basicInfo.postalCode)}
              onChange={handlePostalCodeChange}
              placeholder="123-4567"
              maxLength={8}
              required
              className="w-full px-4 py-3 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
            />
            {postalCodeError ? (
              <p className="text-xs text-red-500 mt-1">{postalCodeError}</p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">7桁入力で住所を自動入力</p>
            )}
          </div>

          {/* 都道府県 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              都道府県 <span className="text-red-500">*</span>
            </label>
            <select
              name="prefecture"
              value={basicInfo.prefecture}
              onChange={handleBasicInfoChange}
              required
              className="w-full px-4 py-3 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors appearance-none cursor-pointer"
            >
              <option value="">選択してください</option>
              {PREFECTURES.map(pref => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
          </div>

          {/* 市区町村 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              市区町村 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={basicInfo.city}
              onChange={handleBasicInfoChange}
              placeholder="渋谷区渋谷"
              required
              className="w-full px-4 py-3 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
            />
          </div>

          {/* 番地・建物名 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Home className="w-4 h-4" />
              番地・建物名
            </label>
            <input
              type="text"
              name="streetAddress"
              value={basicInfo.streetAddress}
              onChange={handleBasicInfoChange}
              placeholder="1-2-3 〇〇マンション101号室"
              className="w-full px-4 py-3 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!isBasicInfoValid}
            className="w-full py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:from-brand-cyan-dark hover:to-brand-cyan text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            次へ：志望動機を録音
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    )
  }

  // Processing
  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-brand-cyan animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          AIが志望動機を生成中...
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          音声を文字起こしし、志望動機・自己PRを作成しています
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
            Stage 1 完了
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            志望動機が生成されました
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">志望の動機</h4>
            <p className="text-slate-900 dark:text-white whitespace-pre-wrap">{result.stage1Data.motivation}</p>
          </div>

          <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">本人希望記入欄</h4>
            <p className="text-slate-900 dark:text-white whitespace-pre-wrap">{result.stage1Data.preferences}</p>
          </div>

          <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">自己PR</h4>
            <p className="text-slate-900 dark:text-white whitespace-pre-wrap">{result.stage1Data.selfPR}</p>
          </div>
        </div>

        <button
          onClick={handleComplete}
          className="w-full py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:from-brand-cyan-dark hover:to-brand-cyan text-white font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
        >
          次へ：経歴を録音（Stage 2）
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
          Stage 1 / 2
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          志望動機をヒアリング
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          なぜこの仕事に興味があるのか、どんな強みがあるのかを話してください
        </p>
      </div>

      <div className="bg-brand-cyan/5 border border-brand-cyan/20 rounded-lg p-4 mb-4">
        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">話す内容の例:</p>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>・この仕事に興味を持った理由</li>
          <li>・自分の強みや得意なこと</li>
          <li>・希望する勤務条件（あれば）</li>
        </ul>
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
                id="stage1-audio-upload"
              />
              <label
                htmlFor="stage1-audio-upload"
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

            {mode === 'recorded' && recordingTime < 10 ? (
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-4 h-4" />
                録音が短すぎます（最低10秒以上必要です）
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                音声の準備ができました
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 bg-slate-200 dark:bg-midnight-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-midnight-500 transition-colors"
              >
                やり直す
              </button>
              <button
                onClick={handleSubmit}
                disabled={isProcessing || (mode === 'recorded' && recordingTime < 10)}
                className="flex-1 py-3 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    処理中...
                  </>
                ) : (
                  '志望動機を生成'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
