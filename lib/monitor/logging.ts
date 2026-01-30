import { createMonitorAdminClient } from '@/lib/supabase/admin'

interface LogEntry {
  workspaceId?: string | null
  actorProfileId?: string | null
  sessionId?: string | null
  action: string
  resourceType: string
  resourceId?: string | null
  details?: Record<string, unknown>
  ipAddress?: string | null
}

/**
 * Record an operation log entry
 */
export async function logOperation(entry: LogEntry) {
  try {
    const supabase = createMonitorAdminClient()

    await supabase.from('monitor_operation_logs').insert({
      workspace_id: entry.workspaceId || null,
      actor_profile_id: entry.actorProfileId || null,
      session_id: entry.sessionId || null,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId || null,
      details: entry.details || {},
      ip_address: entry.ipAddress || null,
    })
  } catch (error) {
    // Logging should never block operations
    console.error('Failed to log operation:', error)
  }
}

/**
 * Get operation logs for a workspace
 */
export async function getOperationLogs(
  workspaceId: string,
  options?: {
    sessionId?: string
    action?: string
    resourceType?: string
    limit?: number
    offset?: number
  }
) {
  const supabase = createMonitorAdminClient()

  let query = supabase
    .from('monitor_operation_logs')
    .select('*', { count: 'exact' })
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (options?.sessionId) {
    query = query.eq('session_id', options.sessionId)
  }
  if (options?.action) {
    query = query.eq('action', options.action)
  }
  if (options?.resourceType) {
    query = query.eq('resource_type', options.resourceType)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
  }

  const { data, error, count } = await query

  if (error) throw new Error(`Failed to get logs: ${error.message}`)
  return { logs: data, total: count }
}

/**
 * Extract IP address from request headers
 */
export function getIpFromRequest(request: Request): string | null {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    null
  )
}
