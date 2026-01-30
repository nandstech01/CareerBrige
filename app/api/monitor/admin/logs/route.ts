import { NextRequest, NextResponse } from 'next/server'
import { requireMonitorRole } from '@/lib/monitor/auth'
import { getOperationLogs } from '@/lib/monitor/logging'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireMonitorRole('viewer')

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId') || undefined
    const action = searchParams.get('action') || undefined
    const resourceType = searchParams.get('resourceType') || undefined
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const result = await getOperationLogs(auth.workspaceId, {
      sessionId,
      action,
      resourceType,
      limit,
      offset,
    })

    return NextResponse.json({
      success: true,
      logs: result.logs,
      total: result.total,
    })
  } catch (error) {
    console.error('Logs error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch logs'
    const status = message.includes('Unauthorized') || message.includes('Forbidden') ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
