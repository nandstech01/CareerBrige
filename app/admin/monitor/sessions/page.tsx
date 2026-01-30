'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { AdminSessionList } from '@/components/monitor/AdminSessionList'

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'すべて' },
  { value: 'started', label: '開始' },
  { value: 'basic_info', label: '基本情報' },
  { value: 'reviewing', label: 'レビュー中' },
  { value: 'completed', label: '完了' },
  { value: 'abandoned', label: '離脱' },
]

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<never[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchSessions = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (statusFilter) params.set('status', statusFilter)

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
  }, [statusFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          セッション一覧
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          すべての履歴書作成セッションを確認できます
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600 dark:text-slate-400">ステータス:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 dark:border-midnight-600 rounded-lg bg-white dark:bg-midnight-700 text-slate-900 dark:text-white"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
        </div>
      ) : (
        <AdminSessionList sessions={sessions} total={total} />
      )}
    </div>
  )
}
