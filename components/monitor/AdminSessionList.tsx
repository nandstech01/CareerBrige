'use client'

import Link from 'next/link'
import { FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, User } from 'lucide-react'
import type { MonitorSessionStatus } from '@/types/database'

interface SessionRow {
  id: string
  status: MonitorSessionStatus
  source: string
  basic_info: { name?: string; gender?: string; prefecture?: string; age?: string; lineId?: string; admin_notes?: string } | null
  step_reached: number
  ai_calls_count: number
  pdf_downloaded: boolean
  started_at: string
  completed_at: string | null
}

interface AdminSessionListProps {
  sessions: SessionRow[]
  total: number
  viewMode: 'list' | 'gallery'
}

export const STATUS_LABELS: Record<MonitorSessionStatus, { label: string; color: string }> = {
  applied: { label: '応募受付', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  scheduling: { label: '日程調整中', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  interview_waiting: { label: '面談待ち', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  interviewed: { label: '面談済み', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  screening: { label: '選考中', color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
  decided: { label: '決定済み', color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
  dropped: { label: '離脱', color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' },
  started: { label: '開始', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
  basic_info: { label: '基本情報', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  recording: { label: '録音中', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  transcribing: { label: '文字起こし', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  generating: { label: '生成中', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  reviewing: { label: 'レビュー中', color: 'bg-brand-cyan/10 text-brand-cyan' },
  completed: { label: '完了', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  abandoned: { label: '離脱', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
}

const STATUS_PROGRESS_COLOR: Partial<Record<MonitorSessionStatus, string>> = {
  applied: 'bg-emerald-500',
  scheduling: 'bg-blue-500',
  interview_waiting: 'bg-yellow-500',
  interviewed: 'bg-orange-500',
  screening: 'bg-teal-500',
  decided: 'bg-rose-500',
  dropped: 'bg-gray-400',
  started: 'bg-slate-400',
  basic_info: 'bg-blue-500',
  completed: 'bg-green-500',
  abandoned: 'bg-red-400',
}

const STATUS_PROGRESS_WIDTH: Partial<Record<MonitorSessionStatus, string>> = {
  applied: 'w-[8%]',
  scheduling: 'w-[25%]',
  interview_waiting: 'w-[40%]',
  interviewed: 'w-[60%]',
  screening: 'w-[75%]',
  decided: 'w-full',
  dropped: 'w-[5%]',
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getStatusIcon(status: MonitorSessionStatus) {
  if (status === 'completed' || status === 'decided') {
    return <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />
  }
  if (status === 'abandoned' || status === 'dropped') {
    return <AlertCircle className="w-5 h-5 text-red-400" />
  }
  return <Clock className="w-5 h-5 text-slate-400 dark:text-slate-400" />
}

function getIconBg(status: MonitorSessionStatus) {
  if (status === 'completed' || status === 'decided') return 'bg-green-50 dark:bg-green-900/20'
  if (status === 'abandoned' || status === 'dropped') return 'bg-red-50 dark:bg-red-900/20'
  if (status === 'interviewed') return 'bg-orange-50 dark:bg-orange-900/20'
  if (status === 'interview_waiting') return 'bg-yellow-50 dark:bg-yellow-900/20'
  if (status === 'applied') return 'bg-emerald-50 dark:bg-emerald-900/20'
  return 'bg-slate-50 dark:bg-midnight-700'
}

function SourceBadge({ source }: { source: string }) {
  if (source === 'apply_form') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#06C755]/10 text-[#06C755]">
        LINE応募
      </span>
    )
  }
  if (source === 'company_hearing') {
    return (
      <span className="px-2 py-0.5 text-[10px] rounded font-semibold bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
        ヒアリング
      </span>
    )
  }
  return null
}

/* ─── List View ─── */
function ListView({ sessions, total }: { sessions: SessionRow[]; total: number }) {
  return (
    <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-midnight-600">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          全{total}件
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-midnight-700">
        {sessions.map((session) => {
          const statusInfo = STATUS_LABELS[session.status]
          const name = session.basic_info?.name || '匿名'

          return (
            <Link
              key={session.id}
              href={`/admin/monitor/sessions/${session.id}`}
              className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-midnight-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconBg(session.status)}`}>
                  {getStatusIcon(session.status)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white text-sm">
                      {name}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <SourceBadge source={session.source} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-300">
                    <span>Step {session.step_reached}/4</span>
                    <span>AI呼出: {session.ai_calls_count}回</span>
                    <span>{formatDate(session.started_at)}</span>
                  </div>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-300" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Gallery View ─── */
function GalleryView({ sessions }: { sessions: SessionRow[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {sessions.map((session) => {
        const statusInfo = STATUS_LABELS[session.status]
        const name = session.basic_info?.name || '匿名'
        const info = session.basic_info
        const progressColor = STATUS_PROGRESS_COLOR[session.status] || 'bg-slate-400'
        const progressWidth = STATUS_PROGRESS_WIDTH[session.status] || `w-[${Math.max(5, session.step_reached * 25)}%]`

        return (
          <Link
            key={session.id}
            href={`/admin/monitor/sessions/${session.id}`}
            className="group bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 overflow-hidden hover:shadow-lg hover:border-slate-300 dark:hover:border-midnight-500 transition-all duration-200"
          >
            {/* Card Header */}
            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconBg(session.status)}`}>
                  {session.source === 'apply_form' ? (
                    <User className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                  ) : (
                    getStatusIcon(session.status)
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                    {name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <SourceBadge source={session.source} />
                  </div>
                </div>
              </div>

              {/* Meta info for apply_form */}
              {session.source === 'apply_form' && info && (
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-4 text-xs">
                  {info.age && (
                    <div>
                      <span className="text-slate-400 dark:text-slate-400">年齢</span>
                      <span className="ml-1.5 text-slate-700 dark:text-slate-300">{info.age}歳</span>
                    </div>
                  )}
                  {info.prefecture && (
                    <div>
                      <span className="text-slate-400 dark:text-slate-400">地域</span>
                      <span className="ml-1.5 text-slate-700 dark:text-slate-300">{info.prefecture}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Progress */}
              <div>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-slate-400 dark:text-slate-400">進捗</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Step {session.step_reached}/4</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-midnight-700 rounded-full h-1.5">
                  <div className={`${progressColor} h-1.5 rounded-full transition-all ${progressWidth}`} />
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-5 py-3 bg-slate-50/80 dark:bg-midnight-900/40 border-t border-slate-100 dark:border-midnight-700 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-400">
                <span>AI: {session.ai_calls_count}回</span>
                <span>{formatDate(session.started_at)}</span>
              </div>
              <span className="text-brand-cyan text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                詳細
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

/* ─── Main Export ─── */
export function AdminSessionList({ sessions, total, viewMode }: AdminSessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-12 text-center">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-300">セッションがありません</p>
      </div>
    )
  }

  if (viewMode === 'gallery') {
    return <GalleryView sessions={sessions} />
  }

  return <ListView sessions={sessions} total={total} />
}
