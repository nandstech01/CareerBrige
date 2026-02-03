'use client'

import { useEffect, useState } from 'react'
import { Loader2, ScrollText, Search } from 'lucide-react'

interface LogEntry {
  id: string
  action: string
  resource_type: string
  resource_id: string | null
  details: Record<string, unknown>
  created_at: string
  actor_profile_id: string | null
  session_id: string | null
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState('')

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({ limit: '100' })
        if (actionFilter) params.set('action', actionFilter)

        const response = await fetch(`/api/monitor/admin/logs?${params}`)
        if (response.ok) {
          const data = await response.json()
          setLogs(data.logs || [])
          setTotal(data.total || 0)
        }
      } catch (err) {
        console.error('Failed to fetch logs:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [actionFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          操作ログ
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
          すべての操作履歴を確認できます（12ヶ月保持）
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            placeholder="アクションで検索..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-midnight-600 rounded-lg bg-white dark:bg-midnight-700 text-slate-900 dark:text-white"
          />
        </div>
        <span className="text-sm text-slate-500">全{total}件</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-12 text-center">
          <ScrollText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">操作ログがありません</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-midnight-600 bg-slate-50 dark:bg-midnight-700/50">
                <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-300 font-medium">日時</th>
                <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-300 font-medium">アクション</th>
                <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-300 font-medium">リソース</th>
                <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-300 font-medium">詳細</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-midnight-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-midnight-700/30">
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-300 whitespace-nowrap">
                    {formatDateTime(log.created_at)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {log.resource_type}
                    {log.resource_id && (
                      <span className="text-xs text-slate-400 ml-1">
                        ({log.resource_id.slice(0, 8)}...)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono max-w-xs truncate">
                    {Object.keys(log.details).length > 0
                      ? JSON.stringify(log.details)
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
