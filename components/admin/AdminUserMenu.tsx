'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, LayoutDashboard } from 'lucide-react'
import type { ProfileWithDetails } from '@/types'

export function AdminUserMenu() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/me')
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      } catch {
        // Not logged in
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
    )
  }

  if (!profile) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-9 w-9 rounded-full ring-2 ring-slate-200 dark:ring-slate-600 hover:ring-brand-cyan/50 transition-all duration-200">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={profile.avatar_url || undefined}
              alt={profile.display_name}
            />
            <AvatarFallback className="bg-gradient-to-br from-sky-500 to-cyan-500 text-white font-semibold text-sm">
              {profile.display_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {profile.display_name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {profile.email}
          </p>
        </div>
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-600" />
        <DropdownMenuItem
          asChild
          className="hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700 cursor-pointer"
        >
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            <span>ダッシュボード</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-600" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-500 dark:text-red-400 cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>ログアウト</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
