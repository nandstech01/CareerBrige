'use client'

import { FileText, CheckCircle2, Clock, Users } from 'lucide-react'

interface StatsData {
  totalSessions: number
  completedSessions: number
  activeSessions: number
  completionRate: number
}

interface AdminDashboardStatsProps {
  stats: StatsData
}

export function AdminDashboardStats({ stats }: AdminDashboardStatsProps) {
  const cards = [
    {
      label: '総セッション数',
      value: stats.totalSessions,
      icon: FileText,
      color: 'text-brand-cyan',
      bg: 'bg-brand-cyan/10',
    },
    {
      label: '完了セッション',
      value: stats.completedSessions,
      icon: CheckCircle2,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: '進行中',
      value: stats.activeSessions,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
      label: '完了率',
      value: `${stats.completionRate}%`,
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {card.label}
            </span>
            <div className={`w-10 h-10 ${card.bg} ${card.color} rounded-lg flex items-center justify-center`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
