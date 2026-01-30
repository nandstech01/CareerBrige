'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AdminUserMenu } from '@/components/admin/AdminUserMenu'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminMobileNav } from '@/components/admin/AdminMobileNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-midnight-800 border-b border-slate-200 dark:border-midnight-600">
        <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/admin/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <Image
                src="/logo.png"
                alt="キャリアブリッジ"
                width={160}
                height={36}
                className="h-9 w-auto"
                priority
              />
              <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-midnight-700 text-slate-600 dark:text-slate-400 rounded-full font-medium">
                管理パネル
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AdminUserMenu />
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <AdminMobileNav open={mobileOpen} onOpenChange={setMobileOpen} />

      {/* Body */}
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 min-w-0 relative">
          {/* Background Pattern */}
          <div className="fixed inset-0 pointer-events-none">
            <div
              className="absolute inset-0 opacity-30 dark:opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(14, 165, 233, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 165, 233, 0.03) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
          </div>
          <div className="relative z-10 p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
