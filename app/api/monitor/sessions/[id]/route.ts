import { NextRequest, NextResponse } from 'next/server'
import {
  getSessionById,
  getSessionByToken,
  updateSessionBasicInfo,
  updateSessionTranscript,
  updateSessionResume,
  completeSession,
  incrementAiCalls,
} from '@/lib/monitor/session'
import { getMonitorAuth, getSessionTokenFromRequest } from '@/lib/monitor/auth'
import type { ResumeData } from '@/lib/gemini'

/**
 * GET /api/monitor/sessions/[id]
 * Get session details. Accessible by session token or workspace member.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id

    // Try session token auth first
    const sessionToken = getSessionTokenFromRequest(request)
    if (sessionToken) {
      const session = await getSessionByToken(sessionToken)
      if (session && session.id === sessionId) {
        return NextResponse.json({ success: true, session })
      }
    }

    // Try workspace auth
    const auth = await getMonitorAuth()
    if (auth.isAuthenticated && auth.workspaceId) {
      const session = await getSessionById(sessionId)
      if (session) {
        return NextResponse.json({ success: true, session })
      }
    }

    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  } catch (error) {
    console.error('Get session error:', error)
    const message = error instanceof Error ? error.message : 'Failed to get session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * PATCH /api/monitor/sessions/[id]
 * Update session data. Uses session_token for public users.
 * Supports step-by-step updates.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { action, sessionToken, data } = body as {
      action: 'basic_info' | 'transcript' | 'resume' | 'complete' | 'increment_ai'
      sessionToken: string
      data?: Record<string, unknown>
    }

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 400 }
      )
    }

    // Verify the token matches the session
    const session = await getSessionByToken(sessionToken)
    if (!session || session.id !== params.id) {
      return NextResponse.json(
        { error: 'Invalid session token' },
        { status: 403 }
      )
    }

    let updatedSession

    switch (action) {
      case 'basic_info':
        updatedSession = await updateSessionBasicInfo(
          sessionToken,
          data as unknown as { name: string; phone: string; age: string; prefecture: string }
        )
        break

      case 'transcript':
        updatedSession = await updateSessionTranscript(
          sessionToken,
          data?.transcript as string
        )
        break

      case 'resume':
        updatedSession = await updateSessionResume(
          sessionToken,
          data as unknown as ResumeData
        )
        break

      case 'complete':
        updatedSession = await completeSession(sessionToken)
        break

      case 'increment_ai':
        await incrementAiCalls(sessionToken)
        updatedSession = await getSessionByToken(sessionToken)
        break

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      session: updatedSession,
    })
  } catch (error) {
    console.error('Update session error:', error)
    const message = error instanceof Error ? error.message : 'Failed to update session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
