'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Loader2,
  User,
  Clock,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

interface SessionDetail {
  id: string
  session_token: string
  status: string
  source: string
  basic_info: {
    name?: string
    phone?: string
    age?: string
    prefecture?: string
  } | null
  transcript: string | null
  resume_data: Record<string, unknown> | null
  step_reached: number
  ai_calls_count: number
  pdf_downloaded: boolean
  started_at: string
  completed_at: string | null
  created_at: string
  updated_at: string
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminSessionDetailPage() {
  const params = useParams()
  const sessionId = params.id as string
  const [session, setSession] = useState<SessionDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/monitor/admin/sessions?id=${sessionId}`)
        if (!response.ok) throw new Error('Failed to fetch session')
        const data = await response.json()
        setSession(data.session)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの読み込みに失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/monitor/sessions"
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-brand-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          セッション一覧に戻る
        </Link>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error || 'セッションが見つかりません'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/monitor/sessions"
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-brand-cyan transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          セッション詳細
        </h1>
      </div>

      {/* Status & Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-5">
          <div className="flex items-center gap-2 mb-2">
            {session.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : session.status === 'abandoned' ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <Clock className="w-5 h-5 text-amber-500" />
            )}
            <span className="text-sm text-slate-500">ステータス</span>
          </div>
          <p className="font-semibold text-slate-900 dark:text-white capitalize">{session.status}</p>
        </div>

        <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-brand-cyan" />
            <span className="text-sm text-slate-500">AI呼出回数</span>
          </div>
          <p className="font-semibold text-slate-900 dark:text-white">{session.ai_calls_count}回</p>
        </div>

        <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-slate-500">進捗</span>
          </div>
          <p className="font-semibold text-slate-900 dark:text-white">
            Step {session.step_reached}/4
            {session.pdf_downloaded && ' (PDF済)'}
          </p>
        </div>
      </div>

      {/* Basic Info */}
      {session.basic_info && (
        <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            基本情報
          </h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500 dark:text-slate-400">氏名</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{session.basic_info.name || '-'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">電話番号</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{session.basic_info.phone || '-'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">年齢</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{session.basic_info.age || '-'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">都道府県</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{session.basic_info.prefecture || '-'}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Transcript */}
      {session.transcript && (
        <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
            文字起こし
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {session.transcript}
          </p>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">タイムライン</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400 w-20">開始</span>
            <span className="text-slate-900 dark:text-white">{formatDateTime(session.started_at)}</span>
          </div>
          {session.completed_at && (
            <div className="flex items-center gap-3">
              <span className="text-slate-500 dark:text-slate-400 w-20">完了</span>
              <span className="text-slate-900 dark:text-white">{formatDateTime(session.completed_at)}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400 w-20">更新</span>
            <span className="text-slate-900 dark:text-white">{formatDateTime(session.updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Session Token (debug info) */}
      <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-2">セッション情報</h2>
        <dl className="text-sm space-y-2">
          <div>
            <dt className="text-slate-500 dark:text-slate-400">ID</dt>
            <dd className="font-mono text-xs text-slate-700 dark:text-slate-300">{session.id}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">ソース</dt>
            <dd className="text-slate-700 dark:text-slate-300">{session.source}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
