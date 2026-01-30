import { NextResponse } from 'next/server'
import { requireMonitorRole } from '@/lib/monitor/auth'
import { createMonitorAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    await requireMonitorRole('viewer')
    const supabase = createMonitorAdminClient()

    // Get all sessions with key fields for analytics
    const { data: allSessions, count: totalCount } = await supabase
      .from('monitor_sessions')
      .select('id, status, source, step_reached, ai_calls_count, pdf_downloaded, created_at, completed_at', { count: 'exact' })

    const sessions = allSessions || []
    const total = totalCount || 0
    const completed = sessions.filter(s => s.status === 'completed').length
    const active = sessions.filter(s =>
      !['completed', 'abandoned'].includes(s.status)
    ).length
    const abandoned = sessions.filter(s => s.status === 'abandoned').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    // Source breakdown
    const sourceBreakdown = {
      public: sessions.filter(s => s.source === 'public').length,
      company_hearing: sessions.filter(s => s.source === 'company_hearing').length,
    }

    // Step funnel (how many sessions reached each step)
    const stepFunnel = [1, 2, 3, 4].map(step => ({
      step,
      count: sessions.filter(s => s.step_reached >= step).length,
    }))

    // AI usage stats
    const totalAiCalls = sessions.reduce((sum, s) => sum + (s.ai_calls_count || 0), 0)
    const avgAiCalls = total > 0 ? Math.round((totalAiCalls / total) * 10) / 10 : 0
    const pdfDownloads = sessions.filter(s => s.pdf_downloaded).length

    // Daily session counts (last 30 days)
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const dailyCounts: { date: string; total: number; completed: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = day.toISOString().split('T')[0]
      const daySessions = sessions.filter(s => s.created_at?.startsWith(dateStr))
      dailyCounts.push({
        date: dateStr,
        total: daySessions.length,
        completed: daySessions.filter(s => s.status === 'completed').length,
      })
    }

    // Get recent sessions
    const { data: recentSessions } = await supabase
      .from('monitor_sessions')
      .select('id, status, source, basic_info, step_reached, ai_calls_count, pdf_downloaded, started_at, completed_at')
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      stats: {
        totalSessions: total,
        completedSessions: completed,
        activeSessions: active,
        abandonedSessions: abandoned,
        completionRate,
        pdfDownloads,
        totalAiCalls,
        avgAiCalls,
      },
      sourceBreakdown,
      stepFunnel,
      dailyCounts,
      recentSessions: recentSessions || [],
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    const message = error instanceof Error ? error.message : 'Failed to load dashboard'
    const status = message.includes('Unauthorized') || message.includes('Forbidden') ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
