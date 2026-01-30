'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { AdminDashboardStats } from '@/components/monitor/AdminDashboardStats'
import { AdminSessionList } from '@/components/monitor/AdminSessionList'
import {
  SessionTrendChart,
  StepFunnelChart,
  SourcePieChart,
  AiUsageStats,
} from '@/components/monitor/AdminAnalyticsCharts'
import {
  AdminDateRangePicker,
  getDefaultDateRange,
} from '@/components/monitor/AdminDateRangePicker'

interface DashboardData {
  stats: {
    totalSessions: number
    completedSessions: number
    activeSessions: number
    abandonedSessions: number
    completionRate: number
    pdfDownloads: number
    totalAiCalls: number
    avgAiCalls: number
  }
  sourceBreakdown: {
    public: number
    company_hearing: number
  }
  stepFunnel: Array<{
    step: number
    count: number
  }>
  dailyCounts: Array<{
    date: string
    total: number
    completed: number
  }>
  recentSessions: Array<{
    id: string
    status: string
    source: string
    basic_info: { name?: string } | null
    step_reached: number
    ai_calls_count: number
    pdf_downloaded: boolean
    started_at: string
    completed_at: string | null
  }>
}

interface AnalyticsData {
  summary: {
    totalSessions: number
    completedSessions: number
    completionRate: number
    avgCompletionMinutes: number
    totalAiCalls: number
    avgAiCalls: number
    pdfDownloads: number
  }
  timeSeries: Array<{
    label: string
    total: number
    completed: number
    abandoned: number
  }>
  statusDistribution: Record<string, number>
  sourceDistribution: Record<string, number>
  stepFunnel: Array<{
    step: number
    label: string
    count: number
    rate: number
  }>
}

type TabId = 'overview' | 'analytics'

export default function AdminMonitorAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [data, setData] = useState<DashboardData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState(getDefaultDateRange)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/monitor/admin/dashboard')
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'Failed to load dashboard')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの読み込みに失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const fetchAnalytics = useCallback(async () => {
    setIsAnalyticsLoading(true)
    try {
      const params = new URLSearchParams({
        from: dateRange.from,
        to: dateRange.to,
        granularity: dateRange.granularity,
      })
      const response = await fetch(`/api/monitor/admin/analytics?${params}`)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to load analytics')
      }
      const result = await response.json()
      setAnalyticsData(result)
    } catch (err) {
      console.error('Analytics fetch error:', err)
    } finally {
      setIsAnalyticsLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics()
    }
  }, [activeTab, fetchAnalytics])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!data) return null

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: '概要' },
    { id: 'analytics', label: '分析' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            モニター分析
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            モニタープログラムの利用状況
          </p>
        </div>

        {activeTab === 'analytics' && (
          <div className="flex items-center gap-2">
            <AdminDateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />
            <button
              onClick={fetchAnalytics}
              disabled={isAnalyticsLoading}
              className="p-2 rounded-lg border border-slate-200 dark:border-midnight-600 bg-white dark:bg-midnight-800 hover:border-brand-cyan transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${isAnalyticsLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-midnight-600">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-cyan text-brand-cyan'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <AdminDashboardStats stats={data.stats} />

          {/* Quick charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SessionTrendChart
                data={data.dailyCounts.map(d => ({
                  label: d.date,
                  total: d.total,
                  completed: d.completed,
                  abandoned: 0,
                }))}
              />
            </div>
            <SourcePieChart data={data.sourceBreakdown} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              最新セッション
            </h2>
            <AdminSessionList
              sessions={data.recentSessions as never[]}
              total={data.stats.totalSessions}
            />
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {isAnalyticsLoading && !analyticsData ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
            </div>
          ) : analyticsData ? (
            <>
              {/* Summary stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard
                  label="期間セッション"
                  value={analyticsData.summary.totalSessions}
                />
                <SummaryCard
                  label="完了数"
                  value={analyticsData.summary.completedSessions}
                />
                <SummaryCard
                  label="完了率"
                  value={`${analyticsData.summary.completionRate}%`}
                />
                <SummaryCard
                  label="PDFダウンロード"
                  value={analyticsData.summary.pdfDownloads}
                />
              </div>

              {/* Trend chart */}
              <SessionTrendChart data={analyticsData.timeSeries} />

              {/* Funnel + Source + AI */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StepFunnelChart data={analyticsData.stepFunnel} />
                <div className="space-y-6">
                  <SourcePieChart
                    data={{
                      public: analyticsData.sourceDistribution.public || 0,
                      company_hearing: analyticsData.sourceDistribution.company_hearing || 0,
                    }}
                  />
                  <AiUsageStats
                    totalAiCalls={analyticsData.summary.totalAiCalls}
                    avgAiCalls={analyticsData.summary.avgAiCalls}
                    pdfDownloads={analyticsData.summary.pdfDownloads}
                    avgCompletionMinutes={analyticsData.summary.avgCompletionMinutes}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-400">
              分析データを読み込めませんでした
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-4 text-center">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  )
}
