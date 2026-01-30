'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Mic, Square, Upload, Play, Pause, Trash2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface VoiceRecorderProps {
  onAudioReady: (audioBlob: Blob, mimeType: string) => void
  isProcessing: boolean
}

export function VoiceRecorder({ onAudioReady, isProcessing }: VoiceRecorderProps) {
  const [mode, setMode] = useState<'idle' | 'recording' | 'recorded' | 'uploaded'>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState<string>('audio/webm')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [audioUrl])

  // 録音開始
  const startRecording = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // 対応しているMIMEタイプを確認
      let selectedMimeType = 'audio/webm'
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        selectedMimeType = 'audio/webm;codecs=opus'
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        selectedMimeType = 'audio/webm'
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        selectedMimeType = 'audio/mp4'
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        selectedMimeType = 'audio/ogg'
      }

      setMimeType(selectedMimeType)

      const mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMimeType })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: selectedMimeType })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setMode('recorded')

        // ストリームを停止
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(1000) // 1秒ごとにデータを収集
      setMode('recording')
      setRecordingTime(0)

      // タイマー開始
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Recording error:', err)
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError('マイクへのアクセスが拒否されました。ブラウザの設定でマイクを許可してください。')
      } else {
        setError('録音を開始できませんでした。マイクが接続されているか確認してください。')
      }
    }
  }, [])

  // 録音停止
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // ファイルアップロード
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // 対応形式をチェック
    const supportedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/m4a', 'audio/x-m4a', 'audio/mp4']
    const isSupported = supportedTypes.some(type => file.type.includes(type.split('/')[1]))

    if (!isSupported && !file.name.match(/\.(mp3|wav|webm|ogg|m4a)$/i)) {
      setError('対応していないファイル形式です。MP3, WAV, WebM, OGG, M4A形式の音声ファイルをアップロードしてください。')
      return
    }

    // ファイルサイズをチェック（最大25MB）
    if (file.size > 25 * 1024 * 1024) {
      setError('ファイルサイズが大きすぎます。25MB以下のファイルをアップロードしてください。')
      return
    }

    setAudioBlob(file)
    setMimeType(file.type || 'audio/mpeg')
    const url = URL.createObjectURL(file)
    setAudioUrl(url)
    setMode('uploaded')
    setRecordingTime(0)
  }, [])

  // 再生/一時停止
  const togglePlayback = useCallback(() => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, audioUrl])

  // 音声終了時
  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false)
  }, [])

  // やり直し
  const handleReset = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setMode('idle')
    setRecordingTime(0)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [audioUrl])

  // 次へ進む
  const handleSubmit = useCallback(() => {
    if (audioBlob) {
      onAudioReady(audioBlob, mimeType)
    }
  }, [audioBlob, mimeType, onAudioReady])

  // 録音時間のフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          音声で職歴を入力
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          これまでの職歴や経験について話してください
        </p>
      </div>

      {/* ヒント */}
      <div className="bg-brand-cyan/5 dark:bg-brand-cyan/10 border border-brand-cyan/20 rounded-lg p-4">
        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">
          話す内容の例:
        </p>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>・これまで勤めた会社名と期間</li>
          <li>・担当していた業務内容</li>
          <li>・持っている資格やスキル</li>
          <li>・出身学校や専攻</li>
        </ul>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* メインUI */}
      <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-2xl p-6 border border-slate-200 dark:border-midnight-600">
        {mode === 'idle' && (
          <div className="space-y-4">
            {/* 録音ボタン */}
            <button
              onClick={startRecording}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-brand-cyan/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Mic className="w-6 h-6" />
              録音を開始
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-midnight-500" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-slate-50 dark:bg-midnight-700/50 text-sm text-slate-500 dark:text-slate-400">
                  または
                </span>
              </div>
            </div>

            {/* ファイルアップロード */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.webm,.ogg,.m4a"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <label
                htmlFor="audio-upload"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-midnight-700 border-2 border-dashed border-slate-300 dark:border-midnight-500 text-slate-700 dark:text-slate-300 font-medium rounded-xl cursor-pointer hover:border-brand-cyan hover:text-brand-cyan transition-colors"
              >
                <Upload className="w-5 h-5" />
                音声ファイルをアップロード
              </label>
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center mt-2">
                Zoom・Google Meetの録音ファイル（M4A/MP3）もアップロードできます
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
                対応形式: MP3, WAV, WebM, OGG, M4A（最大25MB）
              </p>
            </div>
          </div>
        )}

        {mode === 'recording' && (
          <div className="space-y-6">
            {/* 録音中のアニメーション */}
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
              <p className="text-sm text-red-500 font-medium animate-pulse">
                録音中...
              </p>
            </div>

            {/* 停止ボタン */}
            <button
              onClick={stopRecording}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg transition-colors"
            >
              <Square className="w-5 h-5" />
              録音を停止
            </button>
          </div>
        )}

        {(mode === 'recorded' || mode === 'uploaded') && audioUrl && (
          <div className="space-y-4">
            {/* 音声プレーヤー */}
            <div className="flex items-center gap-4 bg-white dark:bg-midnight-700 rounded-xl p-4 border border-slate-200 dark:border-midnight-600">
              <button
                onClick={togglePlayback}
                className="w-12 h-12 flex items-center justify-center bg-brand-cyan text-white rounded-full hover:bg-brand-cyan-dark transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {mode === 'recorded' ? '録音した音声' : 'アップロードした音声'}
                </p>
                {mode === 'recorded' && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatTime(recordingTime)}
                  </p>
                )}
              </div>
              <button
                onClick={handleReset}
                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                title="やり直す"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleAudioEnded}
                className="hidden"
              />
            </div>

            {/* 確認メッセージ */}
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              音声の準備ができました
            </div>

            {/* ボタン */}
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
                className="flex-1 py-3 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-brand-cyan/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    処理中...
                  </>
                ) : (
                  '次へ：AIで履歴書作成'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
