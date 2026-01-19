import { Navbar } from '@/components/layout/Navbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-900 via-midnight-800 to-midnight-900">
      <Navbar variant="admin" />
      <main className="relative">
        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
          <div className="absolute inset-0 grid-pattern opacity-10" />
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
