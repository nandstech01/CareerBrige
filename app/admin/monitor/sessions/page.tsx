'use client'

import { useEffect, useState, useMemo } from 'react'
import { Loader2, List, LayoutGrid, Users, CalendarClock, ClipboardCheck, CheckCircle, ChevronRight } from 'lucide-react'
import { AdminSessionList, STATUS_LABELS } from '@/components/monitor/AdminSessionList'
import type { MonitorSessionStatus } from '@/types/database'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'すべて' },
  { value: 'applied', label: '応募受付' },
  { value: 'scheduling', label: '日程調整中' },
  { value: 'interview_waiting', label: '面談待ち' },
  { value: 'interviewed', label: '面談済み' },
  { value: 'screening', label: '選考中' },
  { value: 'decided', label: '決定済み' },
  { value: 'dropped', label: '離脱(応募)' },
  { value: 'started', label: '開始' },
  { value: 'basic_info', label: '基本情報' },
  { value: 'reviewing', label: 'レビュー中' },
  { value: 'completed', label: '完了' },
  { value: 'abandoned', label: '離脱' },
]

const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'すべて' },
  { value: 'public', label: 'セルフ' },
  { value: 'apply_form', label: 'LINE応募' },
  { value: 'company_hearing', label: 'ヒアリング' },
]

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

const FUNNEL_STAGES = [
  { key: 'applied', label: '応募受付', icon: Users, accent: 'emerald' },
  { key: 'interview_waiting', label: '面談待ち', icon: CalendarClock, accent: 'yellow', includes: ['scheduling', 'interview_waiting'] },
  { key: 'interviewed', label: '面談済み', icon: ClipboardCheck, accent: 'orange', includes: ['interviewed', 'screening'] },
  { key: 'decided', label: '決定済み', icon: CheckCircle, accent: 'rose' },
] as const

const ACCENT_CLASSES: Record<string, { bg: string; text: string; iconBg: string; border: string }> = {
  emerald: {
    bg: 'bg-emerald-500/5 dark:bg-emerald-500/10',
    text: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    border: 'border-emerald-100 dark:border-emerald-900/30',
  },
  yellow: {
    bg: 'bg-yellow-500/5 dark:bg-yellow-500/10',
    text: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
    border: 'border-yellow-100 dark:border-yellow-900/30',
  },
  orange: {
    bg: 'bg-orange-500/5 dark:bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
    border: 'border-orange-100 dark:border-orange-900/30',
  },
  rose: {
    bg: 'bg-rose-500/5 dark:bg-rose-500/10',
    text: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
    border: 'border-rose-100 dark:border-rose-900/30',
  },
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'gallery'>('gallery')

  const fetchSessions = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (statusFilter) params.set('status', statusFilter)
      if (sourceFilter) params.set('source', sourceFilter)

      const response = await fetch(`/api/monitor/admin/sessions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
        setTotal(data.total || 0)
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [statusFilter, sourceFilter])

  // Compute funnel stats from all sessions
  const funnelStats = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const s of sessions) {
      counts[s.status] = (counts[s.status] || 0) + 1
    }
    return FUNNEL_STAGES.map((stage) => {
      const keys = 'includes' in stage ? stage.includes : [stage.key]
      const count = keys.reduce((sum, k) => sum + (counts[k] || 0), 0)
      return { ...stage, count }
    })
  }, [sessions])

  const totalSessions = sessions.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          セッション一覧
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          すべてのセッションと進捗状況を確認できます
        </p>
      </div>

      {/* Funnel Stats */}
      {!isLoading && sessions.length > 0 && (
        <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-5">
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
            採用ファネル
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {funnelStats.map((stage, i) => {
              const colors = ACCENT_CLASSES[stage.accent]
              const Icon = stage.icon
              const pct = totalSessions > 0 ? Math.round((stage.count / totalSessions) * 100) : 0

              return (
                <div key={stage.key} className="relative">
                  <div className={`rounded-xl border ${colors.border} ${colors.bg} p-4 flex flex-col items-center text-center`}>
                    <div className={`w-9 h-9 rounded-full ${colors.iconBg} flex items-center justify-center mb-2`}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <span className={`text-[11px] font-semibold ${colors.text} uppercase`}>
                      {stage.label}
                    </span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                      {stage.count}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {pct}%
                    </span>
                  </div>
                  {/* Connector arrow */}
                  {i < funnelStats.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-2.5 -translate-y-1/2 z-10">
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-midnight-600" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Toolbar: Filters + View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1 ml-0.5">ステータス</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-midnight-600 rounded-lg bg-white dark:bg-midnight-700 text-slate-900 dark:text-white min-w-[140px]"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1 ml-0.5">ソース</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 dark:border-midnight-600 rounded-lg bg-white dark:bg-midnight-700 text-slate-900 dark:text-white min-w-[140px]"
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 dark:text-slate-500 mr-1">全{total}件</span>
          <div className="flex rounded-lg border border-slate-200 dark:border-midnight-600 overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-brand-cyan text-white'
                  : 'bg-white dark:bg-midnight-700 text-slate-400 hover:text-slate-600 dark:hover:text-white'
              }`}
              title="一覧"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('gallery')}
              className={`p-2 transition-colors ${
                viewMode === 'gallery'
                  ? 'bg-brand-cyan text-white'
                  : 'bg-white dark:bg-midnight-700 text-slate-400 hover:text-slate-600 dark:hover:text-white'
              }`}
              title="ギャラリー"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Session List / Gallery */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
        </div>
      ) : (
        <AdminSessionList sessions={sessions} total={total} viewMode={viewMode} />
      )}
    </div>
  )
}
