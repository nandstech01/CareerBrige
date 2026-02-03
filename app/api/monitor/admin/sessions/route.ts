import { NextRequest, NextResponse } from 'next/server'
import { requireMonitorRole } from '@/lib/monitor/auth'
import { getSessionById, updateSessionStatus } from '@/lib/monitor/session'
import { createMonitorAdminClient } from '@/lib/supabase/admin'
import type { MonitorSessionStatus } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    await requireMonitorRole('viewer')

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('id')

    // Single session detail
    if (sessionId) {
      const session = await getSessionById(sessionId)
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, session })
    }

    // List sessions
    const supabase = createMonitorAdminClient()
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    let query = supabase
      .from('monitor_sessions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }
    if (source) {
      query = query.eq('source', source)
    }

    const { data, error, count } = await query

    if (error) throw new Error(error.message)

    return NextResponse.json({
      success: true,
      sessions: data,
      total: count,
    })
  } catch (error) {
    console.error('Admin sessions error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch sessions'
    const status = message.includes('Unauthorized') || message.includes('Forbidden') ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireMonitorRole('staff')

    const body = await request.json()
    const { sessionId, status, notes } = body as {
      sessionId: string
      status: MonitorSessionStatus
      notes?: string
    }

    if (!sessionId || !status) {
      return NextResponse.json(
        { error: 'sessionId and status are required' },
        { status: 400 }
      )
    }

    const session = await updateSessionStatus(sessionId, status, notes)

    return NextResponse.json({ success: true, session })
  } catch (error) {
    console.error('Admin session update error:', error)
    const message = error instanceof Error ? error.message : 'Failed to update session'
    const statusCode = message.includes('Unauthorized') || message.includes('Forbidden') ? 403 : 500
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
