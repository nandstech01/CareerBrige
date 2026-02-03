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
  MessageSquare,
  Save,
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
    gender?: string
    canRelocate?: boolean
    hasResume?: boolean
    jobTemperature?: string
    lineId?: string
    admin_notes?: string
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

const APPLY_STATUS_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: 'applied', label: '応募受付', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { value: 'scheduling', label: '日程調整中', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'interview_waiting', label: '面談待ち', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { value: 'interviewed', label: '面談済み', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'screening', label: '選考中', color: 'bg-teal-100 text-teal-700 border-teal-300' },
  { value: 'decided', label: '決定済み', color: 'bg-rose-100 text-rose-700 border-rose-300' },
  { value: 'dropped', label: '離脱', color: 'bg-gray-100 text-gray-500 border-gray-300' },
]

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
  const [notes, setNotes] = useState('')
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/monitor/admin/sessions?id=${sessionId}`)
      if (!response.ok) throw new Error('Failed to fetch session')
      const data = await response.json()
      setSession(data.session)
      setNotes((data.session?.basic_info as SessionDetail['basic_info'])?.admin_notes || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'データの読み込みに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSession()
  }, [sessionId])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!session) return
    setIsUpdatingStatus(true)
    try {
      const response = await fetch('/api/monitor/admin/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, status: newStatus }),
      })
      if (!response.ok) throw new Error('Failed to update status')
      await fetchSession()
    } catch (err) {
      console.error('Status update error:', err)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleSaveNotes = async () => {
    if (!session) return
    setIsSavingNotes(true)
    try {
      const response = await fetch('/api/monitor/admin/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, status: session.status, notes }),
      })
      if (!response.ok) throw new Error('Failed to save notes')
      await fetchSession()
    } catch (err) {
      console.error('Save notes error:', err)
    } finally {
      setIsSavingNotes(false)
    }
  }

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
          <p className="font-semibold text-slate-900 dark:text-white capitalize">
            {session.source === 'apply_form'
              ? (APPLY_STATUS_OPTIONS.find(o => o.value === session.status)?.label || session.status)
              : session.status}
          </p>
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

      {/* Status Actions for apply_form sessions */}
      {session.source === 'apply_form' && (
        <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">面談ステータス</h2>
          <div className="flex flex-wrap gap-2">
            {APPLY_STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusUpdate(opt.value)}
                disabled={isUpdatingStatus || session.status === opt.value}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  session.status === opt.value
                    ? `${opt.color} ring-2 ring-offset-1 ring-current`
                    : `${opt.color} opacity-60 hover:opacity-100`
                } disabled:cursor-not-allowed`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
            {session.basic_info.phone !== undefined && (
              <div>
                <dt className="text-slate-500 dark:text-slate-400">電話番号</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{session.basic_info.phone || '-'}</dd>
              </div>
            )}
            <div>
              <dt className="text-slate-500 dark:text-slate-400">年齢</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{session.basic_info.age || '-'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">都道府県</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{session.basic_info.prefecture || '-'}</dd>
            </div>
            {session.basic_info.gender && (
              <div>
                <dt className="text-slate-500 dark:text-slate-400">性別</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{session.basic_info.gender}</dd>
              </div>
            )}
            {session.basic_info.canRelocate !== undefined && (
              <div>
                <dt className="text-slate-500 dark:text-slate-400">転居可否</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{session.basic_info.canRelocate ? '可能' : '不可'}</dd>
              </div>
            )}
            {session.basic_info.hasResume !== undefined && (
              <div>
                <dt className="text-slate-500 dark:text-slate-400">履歴書有無</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{session.basic_info.hasResume ? 'あり' : 'なし'}</dd>
              </div>
            )}
            {session.basic_info.jobTemperature && (
              <div>
                <dt className="text-slate-500 dark:text-slate-400">転職温度</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{session.basic_info.jobTemperature}</dd>
              </div>
            )}
            {session.basic_info.lineId && (
              <div>
                <dt className="text-slate-500 dark:text-slate-400">LINE ID</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{session.basic_info.lineId}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Notes */}
      <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          メモ
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="管理者メモを入力..."
          rows={4}
          className="w-full px-4 py-3 bg-white dark:bg-midnight-700 border border-slate-200 dark:border-midnight-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan resize-none text-sm"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleSaveNotes}
            disabled={isSavingNotes}
            className="flex items-center gap-2 px-4 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/90 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            {isSavingNotes ? '保存中...' : 'メモを保存'}
          </button>
        </div>
      </div>

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
