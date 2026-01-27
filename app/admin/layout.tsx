import { Navbar } from '@/components/layout/Navbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-b dark:from-[#0B1120] dark:via-slate-900 dark:to-[#0B1120] transition-colors">
      <Navbar variant="admin" />
      <main className="relative">
        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-30 dark:opacity-30"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(14, 165, 233, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 165, 233, 0.03) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
