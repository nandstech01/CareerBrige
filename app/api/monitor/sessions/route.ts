import { NextRequest, NextResponse } from 'next/server'
import {
  createSession,
  generateSessionToken,
  listWorkspaceSessions,
  listPublicSessions,
} from '@/lib/monitor/session'
import { getMonitorAuth } from '@/lib/monitor/auth'

/**
 * POST /api/monitor/sessions
 * Create a new monitor session.
 * Public: no auth required, returns session_token.
 * Company hearing: requires workspace membership.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, workspaceId, assignedStaffId } = body as {
      source?: 'public' | 'company_hearing'
      workspaceId?: string
      assignedStaffId?: string
    }

    const sessionToken = generateSessionToken()
    let createdByProfileId: string | null = null

    // If company_hearing source, verify auth
    if (source === 'company_hearing') {
      const auth = await getMonitorAuth()
      if (!auth.isAuthenticated || !auth.workspaceId) {
        return NextResponse.json(
          { error: 'Unauthorized: workspace membership required for company hearing' },
          { status: 401 }
        )
      }
      createdByProfileId = auth.profileId
    }

    const session = await createSession({
      sessionToken,
      source: source || 'public',
      workspaceId: workspaceId || null,
      createdByProfileId,
      assignedStaffId: assignedStaffId || null,
    })

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        sessionToken: session.session_token,
        status: session.status,
      },
    })
  } catch (error) {
    console.error('Create session error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * GET /api/monitor/sessions
 * List sessions. Requires workspace membership (admin view).
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await getMonitorAuth()
    if (!auth.isAuthenticated || !auth.workspaceId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as import('@/types/database').MonitorSessionStatus | null
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const scope = searchParams.get('scope') || 'workspace' // 'workspace' | 'public' | 'all'

    let result

    if (scope === 'public') {
      result = await listPublicSessions({
        status: status || undefined,
        limit,
        offset,
      })
    } else {
      result = await listWorkspaceSessions(auth.workspaceId, {
        status: status || undefined,
        limit,
        offset,
      })
    }

    return NextResponse.json({
      success: true,
      sessions: result.sessions,
      total: result.total,
    })
  } catch (error) {
    console.error('List sessions error:', error)
    const message = error instanceof Error ? error.message : 'Failed to list sessions'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
