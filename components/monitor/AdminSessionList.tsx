'use client'

import Link from 'next/link'
import { FileText, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import type { MonitorSessionStatus } from '@/types/database'

interface SessionRow {
  id: string
  status: MonitorSessionStatus
  source: string
  basic_info: { name?: string } | null
  step_reached: number
  ai_calls_count: number
  pdf_downloaded: boolean
  started_at: string
  completed_at: string | null
}

interface AdminSessionListProps {
  sessions: SessionRow[]
  total: number
}

const STATUS_LABELS: Record<MonitorSessionStatus, { label: string; color: string }> = {
  started: { label: '開始', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  basic_info: { label: '基本情報', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  recording: { label: '録音中', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  transcribing: { label: '文字起こし', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  generating: { label: '生成中', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  reviewing: { label: 'レビュー中', color: 'bg-brand-cyan/10 text-brand-cyan' },
  completed: { label: '完了', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  abandoned: { label: '離脱', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
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

export function AdminSessionList({ sessions, total }: AdminSessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-12 text-center">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400">セッションがありません</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-midnight-600 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          全{total}件
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-midnight-700">
        {sessions.map((session) => {
          const statusInfo = STATUS_LABELS[session.status]
          const name = (session.basic_info as { name?: string } | null)?.name || '匿名'

          return (
            <Link
              key={session.id}
              href={`/admin/monitor/sessions/${session.id}`}
              className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-midnight-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  session.status === 'completed'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-slate-100 dark:bg-midnight-700'
                }`}>
                  {session.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : session.status === 'abandoned' ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white text-sm">
                      {name}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    {session.source === 'company_hearing' && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 font-medium">
                        ヒアリング
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
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
