import { NextRequest, NextResponse } from 'next/server'
import { requireMonitorRole } from '@/lib/monitor/auth'
import { createMonitorAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    await requireMonitorRole('viewer')
    const supabase = createMonitorAdminClient()

    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const granularity = searchParams.get('granularity') || 'day' // 'day' | 'week' | 'month'

    // Default: last 30 days
    const now = new Date()
    const startDate = from ? new Date(from) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const endDate = to ? new Date(to) : now

    let query = supabase
      .from('monitor_sessions')
      .select('id, status, source, step_reached, ai_calls_count, pdf_downloaded, created_at, completed_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true })

    const { data: sessions, error } = await query

    if (error) throw new Error(error.message)

    const allSessions = sessions || []

    // Time series based on granularity
    const timeSeries = buildTimeSeries(allSessions, startDate, endDate, granularity)

    // Status distribution
    const statusDistribution: Record<string, number> = {}
    for (const s of allSessions) {
      statusDistribution[s.status] = (statusDistribution[s.status] || 0) + 1
    }

    // Source distribution
    const sourceDistribution: Record<string, number> = {}
    for (const s of allSessions) {
      sourceDistribution[s.source] = (sourceDistribution[s.source] || 0) + 1
    }

    // Step funnel
    const stepFunnel = [1, 2, 3, 4].map(step => ({
      step,
      label: getStepLabel(step),
      count: allSessions.filter(s => s.step_reached >= step).length,
      rate: allSessions.length > 0
        ? Math.round((allSessions.filter(s => s.step_reached >= step).length / allSessions.length) * 100)
        : 0,
    }))

    // AI usage
    const totalAiCalls = allSessions.reduce((sum, s) => sum + (s.ai_calls_count || 0), 0)
    const avgAiCalls = allSessions.length > 0
      ? Math.round((totalAiCalls / allSessions.length) * 10) / 10
      : 0

    // Completion time stats (for completed sessions)
    const completedSessions = allSessions.filter(s => s.status === 'completed' && s.completed_at && s.created_at)
    let avgCompletionMinutes = 0
    if (completedSessions.length > 0) {
      const totalMinutes = completedSessions.reduce((sum, s) => {
        const start = new Date(s.created_at).getTime()
        const end = new Date(s.completed_at!).getTime()
        return sum + (end - start) / (1000 * 60)
      }, 0)
      avgCompletionMinutes = Math.round(totalMinutes / completedSessions.length)
    }

    return NextResponse.json({
      period: {
        from: startDate.toISOString(),
        to: endDate.toISOString(),
        granularity,
      },
      summary: {
        totalSessions: allSessions.length,
        completedSessions: completedSessions.length,
        completionRate: allSessions.length > 0
          ? Math.round((completedSessions.length / allSessions.length) * 100)
          : 0,
        avgCompletionMinutes,
        totalAiCalls,
        avgAiCalls,
        pdfDownloads: allSessions.filter(s => s.pdf_downloaded).length,
      },
      timeSeries,
      statusDistribution,
      sourceDistribution,
      stepFunnel,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    const message = error instanceof Error ? error.message : 'Failed to load analytics'
    const status = message.includes('Unauthorized') || message.includes('Forbidden') ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

function getStepLabel(step: number): string {
  switch (step) {
    case 1: return '基本情報入力'
    case 2: return '音声入力'
    case 3: return '履歴書確認'
    case 4: return 'PDF出力'
    default: return `Step ${step}`
  }
}

interface SessionRow {
  id: string
  status: string
  source: string
  step_reached: number
  ai_calls_count: number
  pdf_downloaded: boolean
  created_at: string
  completed_at: string | null
}

function buildTimeSeries(
  sessions: SessionRow[],
  startDate: Date,
  endDate: Date,
  granularity: string
) {
  const buckets: { label: string; total: number; completed: number; abandoned: number }[] = []

  if (granularity === 'month') {
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    const end = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0)
    const cursor = new Date(start)

    while (cursor <= end) {
      const year = cursor.getFullYear()
      const month = cursor.getMonth()
      const label = `${year}-${String(month + 1).padStart(2, '0')}`
      const monthSessions = sessions.filter(s => {
        const d = new Date(s.created_at)
        return d.getFullYear() === year && d.getMonth() === month
      })
      buckets.push({
        label,
        total: monthSessions.length,
        completed: monthSessions.filter(s => s.status === 'completed').length,
        abandoned: monthSessions.filter(s => s.status === 'abandoned').length,
      })
      cursor.setMonth(cursor.getMonth() + 1)
    }
  } else if (granularity === 'week') {
    const cursor = new Date(startDate)
    // Align to Monday
    cursor.setDate(cursor.getDate() - ((cursor.getDay() + 6) % 7))

    while (cursor <= endDate) {
      const weekStart = new Date(cursor)
      const weekEnd = new Date(cursor)
      weekEnd.setDate(weekEnd.getDate() + 6)
      const label = weekStart.toISOString().split('T')[0]
      const weekSessions = sessions.filter(s => {
        const d = new Date(s.created_at)
        return d >= weekStart && d <= weekEnd
      })
      buckets.push({
        label,
        total: weekSessions.length,
        completed: weekSessions.filter(s => s.status === 'completed').length,
        abandoned: weekSessions.filter(s => s.status === 'abandoned').length,
      })
      cursor.setDate(cursor.getDate() + 7)
    }
  } else {
    // day
    const cursor = new Date(startDate)
    while (cursor <= endDate) {
      const dateStr = cursor.toISOString().split('T')[0]
      const daySessions = sessions.filter(s => s.created_at?.startsWith(dateStr))
      buckets.push({
        label: dateStr,
        total: daySessions.length,
        completed: daySessions.filter(s => s.status === 'completed').length,
        abandoned: daySessions.filter(s => s.status === 'abandoned').length,
      })
      cursor.setDate(cursor.getDate() + 1)
    }
  }

  return buckets
}
