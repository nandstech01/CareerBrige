'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Camera, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react'
import Image from 'next/image'

interface HeadshotUploaderProps {
  sessionId: string
  initialUrl?: string
  onUploadComplete: (headshotUrl: string) => void
}

export function HeadshotUploader({ sessionId, initialUrl, onUploadComplete }: HeadshotUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(!!initialUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('JPEG、PNG、WebP形式の画像をアップロードしてください。')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('ファイルサイズは10MB以下にしてください。')
      return
    }

    // Show preview immediately
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('sessionId', sessionId)

      const response = await fetch('/api/monitor/headshot/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '写真のアップロードに失敗しました')
      }

      // Update preview with server URL
      setPreviewUrl(data.headshotUrl)
      setIsComplete(true)
      onUploadComplete(data.headshotUrl)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'アップロードに失敗しました')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
      // Clean up local preview URL
      URL.revokeObjectURL(localPreview)
    }
  }, [sessionId, onUploadComplete])

  const handleRemove = useCallback(() => {
    setPreviewUrl(null)
    setIsComplete(false)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          証明写真をアップロード
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          履歴書に添付する顔写真をアップロードしてください
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {previewUrl ? (
        <div className="relative">
          <div className="relative w-40 h-52 mx-auto rounded-lg overflow-hidden border-2 border-slate-200 dark:border-midnight-600 shadow-lg">
            <Image
              src={previewUrl}
              alt="証明写真"
              fill
              className="object-cover"
              unoptimized
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>

          {!isUploading && (
            <button
              onClick={handleRemove}
              className="absolute top-0 right-1/2 translate-x-[88px] -translate-y-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {isComplete && !isUploading && (
            <div className="flex items-center justify-center gap-2 mt-4 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">アップロード完了</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            id="headshot-upload"
          />
          <label
            htmlFor="headshot-upload"
            className="flex flex-col items-center justify-center w-40 h-52 mx-auto border-2 border-dashed border-slate-300 dark:border-midnight-500 rounded-lg cursor-pointer hover:border-brand-cyan hover:bg-brand-cyan/5 transition-colors"
          >
            <Camera className="w-10 h-10 text-slate-400 mb-2" />
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              写真を選択
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              3cm × 4cm推奨
            </span>
          </label>
        </div>
      )}

      {!previewUrl && (
        <div className="text-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Upload className="w-5 h-5" />
            写真をアップロード
          </button>
        </div>
      )}

      <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-lg p-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-2">推奨事項:</p>
        <ul className="text-xs text-slate-500 dark:text-slate-500 space-y-1">
          <li>・正面を向いた顔写真</li>
          <li>・背景は無地（白・青・グレー推奨）</li>
          <li>・3ヶ月以内に撮影したもの</li>
          <li>・JPEG、PNG、WebP形式（最大10MB）</li>
        </ul>
      </div>
    </div>
  )
}
