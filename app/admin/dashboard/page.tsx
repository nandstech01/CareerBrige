'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Briefcase,
  FileText,
  CreditCard,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  UserPlus,
  CheckCircle2,
  Download,
  Sparkles,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'

interface PlatformStats {
  totalUsers: number
  totalEngineers: number
  totalCompanies: number
  totalJobs: number
  openJobs: number
  totalContracts: number
  activeContracts: number
  totalRevenue: number
  monthlyRevenue: { month: string; revenue: number }[]
  recentUsers: { id: string; display_name: string; role: string; created_at: string }[]
  jobsByStatus: { status: string; count: number }[]
}

interface MonitorStats {
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

type ActiveTab = 'platform' | 'monitor'

export default function AdminDashboardPage() {
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null)
  const [monitorStats, setMonitorStats] = useState<MonitorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>('platform')

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.allSettled([
        fetch('/api/admin/stats').then(r => r.ok ? r.json() : null),
        fetch('/api/monitor/admin/dashboard').then(r => r.ok ? r.json() : null),
      ])

      if (results[0].status === 'fulfilled') setPlatformStats(results[0].value)
      if (results[1].status === 'fulfilled') setMonitorStats(results[1].value)
      setLoading(false)
    }

    fetchAll()
  }, [])

  const statusLabels: Record<string, string> = {
    open: '公開中',
    closed: '終了',
    draft: '下書き',
    paused: '一時停止',
  }

  const barColors = ['#22d3ee', '#a855f7', '#f59e0b', '#ef4444']

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">ダッシュボード</h1>
            <p className="text-slate-500 dark:text-slate-300 mt-1">統合管理パネル</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
              <div className="h-24 bg-slate-200 dark:bg-slate-700/50 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-sky-500 dark:text-purple-400 animate-spin" />
        </div>
      </div>
    )
  }

  // Summary cards — platform + monitor
  const summaryCards = [
    // Platform stats
    {
      title: '総ユーザー数',
      value: platformStats?.totalUsers || 0,
      icon: Users,
      description: `エンジニア: ${platformStats?.totalEngineers || 0} / 企業: ${platformStats?.totalCompanies || 0}`,
      color: 'text-sky-600 dark:text-cyan-400',
      bgColor: 'bg-sky-500/10 dark:bg-cyan-500/10',
      borderColor: 'border-sky-500/30 dark:border-cyan-500/30',
      trend: '+12%',
      trendUp: true,
      visible: !!platformStats,
    },
    {
      title: '案件数',
      value: platformStats?.totalJobs || 0,
      icon: Briefcase,
      description: `公開中: ${platformStats?.openJobs || 0}件`,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      trend: '+8%',
      trendUp: true,
      visible: !!platformStats,
    },
    {
      title: '契約数',
      value: platformStats?.totalContracts || 0,
      icon: FileText,
      description: `アクティブ: ${platformStats?.activeContracts || 0}件`,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      trend: '+23%',
      trendUp: true,
      visible: !!platformStats,
    },
    {
      title: '総売上',
      value: `¥${((platformStats?.totalRevenue || 0) / 10000).toFixed(0)}万`,
      icon: CreditCard,
      description: '手数料収入',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      trend: '+15%',
      trendUp: true,
      visible: !!platformStats,
    },
    // Monitor stats
    {
      title: 'セッション数',
      value: monitorStats?.stats.totalSessions || 0,
      icon: Sparkles,
      description: `アクティブ: ${monitorStats?.stats.activeSessions || 0}件`,
      color: 'text-brand-cyan',
      bgColor: 'bg-brand-cyan/10',
      borderColor: 'border-brand-cyan/30',
      trend: '',
      trendUp: true,
      visible: !!monitorStats,
    },
    {
      title: '完了数',
      value: monitorStats?.stats.completedSessions || 0,
      icon: CheckCircle2,
      description: `離脱: ${monitorStats?.stats.abandonedSessions || 0}件`,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      trend: '',
      trendUp: true,
      visible: !!monitorStats,
    },
    {
      title: '完了率',
      value: `${monitorStats?.stats.completionRate || 0}%`,
      icon: TrendingUp,
      description: 'モニター完了率',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
      trend: '',
      trendUp: true,
      visible: !!monitorStats,
    },
    {
      title: 'PDF数',
      value: monitorStats?.stats.pdfDownloads || 0,
      icon: Download,
      description: `AI呼出平均: ${monitorStats?.stats.avgAiCalls || 0}回`,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      trend: '',
      trendUp: true,
      visible: !!monitorStats,
    },
  ].filter(c => c.visible)

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'platform', label: 'プラットフォーム' },
    { id: 'monitor', label: 'モニター' },
  ]

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">ダッシュボード</h1>
          <p className="text-slate-500 dark:text-slate-300 mt-1">統合管理パネル</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">システム正常</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className={`glass-card rounded-2xl p-6 border ${stat.borderColor} hover-lift border-hover transition-all duration-350 ease-out-expo`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color} icon-hover`} />
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.trendUp ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="font-medium">{stat.trend}</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">{stat.title}</p>
              <p className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{stat.value}</p>
              <p className="text-xs text-slate-400 dark:text-slate-400">{stat.description}</p>
            </div>
          )
        })}
      </div>

      {/* Tab switcher */}
      <div className="border-b border-slate-200 dark:border-midnight-600">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-cyan text-brand-cyan'
                  : 'border-transparent text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Tab */}
      {activeTab === 'platform' && platformStats && (
        <div className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="glass-card rounded-2xl p-6 border-hover">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white tracking-tight">月次売上推移</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-300">過去6ヶ月の売上推移</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">+15%</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={platformStats.monthlyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                      }}
                      labelStyle={{ color: '#94a3b8' }}
                      formatter={(value: number) => [`¥${value.toLocaleString()}`, '売上']}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="url(#purpleGradient)"
                      strokeWidth={3}
                      dot={{ fill: '#a855f7', strokeWidth: 2, stroke: '#1e1b4b', r: 5 }}
                      activeDot={{ fill: '#a855f7', strokeWidth: 2, stroke: '#fff', r: 7 }}
                    />
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Jobs by Status */}
            <div className="glass-card rounded-2xl p-6 border-hover">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white tracking-tight">案件ステータス分布</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-300">現在の案件状況</p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformStats.jobsByStatus?.map(item => ({
                    ...item,
                    status: statusLabels[item.status] || item.status
                  })) || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="status" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                      }}
                      labelStyle={{ color: '#94a3b8' }}
                      formatter={(value: number) => [value, '件数']}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {(platformStats.jobsByStatus || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="glass-card rounded-2xl overflow-hidden border-hover">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white tracking-tight">最近の登録ユーザー</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-300">直近の新規登録</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                  <UserPlus className="w-4 h-4" />
                  <span>新規</span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-300">名前</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-300">ロール</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-300">登録日</th>
                  </tr>
                </thead>
                <tbody>
                  {platformStats.recentUsers?.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-200/50 dark:border-slate-700/30 last:border-0 table-row-hover"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-sm ${
                            user.role === 'engineer'
                              ? 'bg-sky-500/10 text-sky-600 dark:text-cyan-400'
                              : user.role === 'company'
                              ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                              : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          }`}>
                            {user.display_name.slice(0, 1)}
                          </div>
                          <span className="font-medium text-slate-900 dark:text-white">{user.display_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                          user.role === 'engineer'
                            ? 'bg-sky-500/10 text-sky-600 dark:text-cyan-400 border border-sky-500/30 dark:border-cyan-500/30'
                            : user.role === 'company'
                            ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30'
                            : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                        }`}>
                          {user.role === 'engineer' ? 'エンジニア' : user.role === 'company' ? '企業' : '管理者'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-300">
                        {new Date(user.created_at).toLocaleDateString('ja-JP')}
                      </td>
                    </tr>
                  ))}
                  {(!platformStats.recentUsers || platformStats.recentUsers.length === 0) && (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-400 dark:text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        ユーザーがいません
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'platform' && !platformStats && (
        <div className="text-center py-12 text-slate-400">
          プラットフォームデータを取得できませんでした
        </div>
      )}

      {/* Monitor Tab */}
      {activeTab === 'monitor' && monitorStats && (
        <div className="space-y-6">
          {/* Recent Sessions */}
          <div className="glass-card rounded-2xl overflow-hidden border-hover">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white tracking-tight">最新セッション</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-300">モニタープログラムの最近のセッション</p>
                </div>
                <Link
                  href="/admin/monitor/sessions"
                  className="text-sm text-brand-cyan hover:underline"
                >
                  すべて表示
                </Link>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-midnight-700">
              {monitorStats.recentSessions?.map((session) => {
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
                        ) : (
                          <FileText className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-slate-900 dark:text-white text-sm">{name}</span>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500 dark:text-slate-300">
                          <span className="capitalize">{session.status}</span>
                          <span>Step {session.step_reached}/4</span>
                          <span>{new Date(session.started_at).toLocaleDateString('ja-JP')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
              {(!monitorStats.recentSessions || monitorStats.recentSessions.length === 0) && (
                <div className="py-12 text-center text-slate-400 dark:text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  セッションがありません
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/admin/monitor/analytics"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 text-brand-cyan rounded-lg hover:bg-brand-cyan/20 transition-colors text-sm font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              詳細分析を見る
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'monitor' && !monitorStats && (
        <div className="text-center py-12 text-slate-400">
          モニターデータを取得できませんでした
        </div>
      )}
    </div>
  )
}
