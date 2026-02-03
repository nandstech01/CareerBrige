'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { NAV_SECTIONS } from './AdminSidebar'

interface AdminMobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminMobileNav({ open, onOpenChange }: AdminMobileNavProps) {
  const pathname = usePathname()

  // Close on path change
  useEffect(() => {
    onOpenChange(false)
  }, [pathname, onOpenChange])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-72 p-0 bg-white dark:bg-midnight-800 border-r border-slate-200 dark:border-midnight-600"
      >
        <SheetHeader className="px-4 pt-4 pb-2 border-b border-slate-200 dark:border-midnight-600">
          <SheetTitle className="text-left text-brand-cyan font-bold">
            管理パネル
          </SheetTitle>
        </SheetHeader>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
          {NAV_SECTIONS.map((section, i) => {
            const isTopLevel = !section.title
            return (
              <div key={section.title || i} className={isTopLevel ? 'mb-2' : ''}>
                {section.title && (
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    {section.title}
                  </div>
                )}
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + '/')
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
              </div>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
