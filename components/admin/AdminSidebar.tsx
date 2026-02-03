'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Briefcase,
  FileSignature,
  Cpu,
  FileText,
  Mic,
  Layout,
  TrendingUp,
  Users,
  ScrollText,
  Settings,
  ChevronDown,
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavSection {
  title: string
  items: NavItem[]
  defaultOpen?: boolean
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: '',
    defaultOpen: true,
    items: [
      { href: '/admin/dashboard', label: 'ダッシュボード', icon: BarChart3 },
    ],
  },
  {
    title: '求人管理',
    defaultOpen: true,
    items: [
      { href: '/admin/jobs', label: '案件管理', icon: Briefcase },
      { href: '/admin/contracts', label: '契約管理', icon: FileSignature },
      { href: '/admin/skills', label: 'スキル管理', icon: Cpu },
    ],
  },
  {
    title: 'モニター',
    defaultOpen: true,
    items: [
      { href: '/admin/monitor/sessions', label: 'セッション', icon: FileText },
      { href: '/admin/monitor/hearing', label: 'ヒアリング', icon: Mic },
      { href: '/admin/monitor/templates', label: 'テンプレート', icon: Layout },
      { href: '/admin/monitor/analytics', label: '分析', icon: TrendingUp },
    ],
  },
  {
    title: '共通',
    defaultOpen: true,
    items: [
      { href: '/admin/users', label: 'ユーザー管理', icon: Users },
      { href: '/admin/logs', label: '操作ログ', icon: ScrollText },
      { href: '/admin/settings', label: '設定', icon: Settings },
    ],
  },
]

function SidebarSection({ section }: { section: NavSection }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(section.defaultOpen !== false)

  const isTopLevel = !section.title

  return (
    <div className={isTopLevel ? 'mb-2' : ''}>
      {section.title && (
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          {section.title}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
          />
        </button>
      )}

      {(isTopLevel || open) && (
        <ul className="space-y-0.5">
          {section.items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-cyan/10 text-brand-cyan'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-midnight-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function AdminSidebar() {
  return (
    <nav className="hidden lg:block w-64 flex-shrink-0 bg-white dark:bg-midnight-800 border-r border-slate-200 dark:border-midnight-600 min-h-[calc(100vh-65px)]">
      <div className="p-4 space-y-1">
        {NAV_SECTIONS.map((section, i) => (
          <SidebarSection key={section.title || i} section={section} />
        ))}
      </div>
    </nav>
  )
}

export { NAV_SECTIONS }
