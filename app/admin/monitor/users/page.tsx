'use client'

import { useEffect, useState } from 'react'
import { Loader2, Users, Shield, Eye, UserPlus } from 'lucide-react'

interface MemberRow {
  id: string
  monitor_role: string
  is_active: boolean
  created_at: string
  profile_id: string
  profiles: {
    id: string
    display_name: string
    email: string | null
    role: string
  }
}

interface Limits {
  maxAdmin: number
  maxGeneral: number
  currentAdmin: number
  currentGeneral: number
}

const ROLE_LABELS: Record<string, { label: string; icon: typeof Shield; color: string }> = {
  owner: { label: 'オーナー', icon: Shield, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
  admin: { label: '管理者', icon: Shield, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400' },
  staff: { label: 'スタッフ', icon: Users, color: 'text-brand-cyan bg-brand-cyan/10' },
  viewer: { label: '閲覧者', icon: Eye, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400' },
}

export default function AdminMonitorUsersPage() {
  const [members, setMembers] = useState<MemberRow[]>([])
  const [limits, setLimits] = useState<Limits | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/monitor/admin/users')
        if (response.ok) {
          const data = await response.json()
          setMembers(data.members || [])
          setLimits(data.limits || null)
        }
      } catch (err) {
        console.error('Failed to fetch users:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            モニターユーザー管理
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            ワークスペースメンバーの管理
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan-dark transition-colors text-sm font-medium">
          <UserPlus className="w-4 h-4" />
          メンバー追加
        </button>
      </div>

      {/* Account Limits */}
      {limits && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">管理者アカウント</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {limits.currentAdmin} / {limits.maxAdmin}
              </span>
            </div>
            <div className="mt-2 h-2 bg-slate-100 dark:bg-midnight-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${(limits.currentAdmin / limits.maxAdmin) * 100}%` }}
              />
            </div>
          </div>
          <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">一般アカウント</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {limits.currentGeneral} / {limits.maxGeneral}
              </span>
            </div>
            <div className="mt-2 h-2 bg-slate-100 dark:bg-midnight-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-cyan rounded-full"
                style={{ width: `${(limits.currentGeneral / limits.maxGeneral) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-midnight-700">
          {members.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">メンバーがいません</p>
            </div>
          ) : (
            members.map((member) => {
              const roleInfo = ROLE_LABELS[member.monitor_role] || ROLE_LABELS.viewer
              return (
                <div key={member.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-midnight-700 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">
                        {member.profiles?.display_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {member.profiles?.email || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                    {!member.is_active && (
                      <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                        無効
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
