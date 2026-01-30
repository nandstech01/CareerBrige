import { createMonitorAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import type { MonitorRole } from '@/types/database'

interface MonitorAuthResult {
  isAuthenticated: boolean
  profileId: string | null
  workspaceId: string | null
  role: MonitorRole | null
}

/**
 * Check if the current user is an authenticated workspace member.
 * Used for admin routes.
 */
export async function getMonitorAuth(): Promise<MonitorAuthResult> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { isAuthenticated: false, profileId: null, workspaceId: null, role: null }
    }

    const admin = createMonitorAdminClient()
    const { data: membership } = await admin
      .from('monitor_workspace_members')
      .select('workspace_id, monitor_role')
      .eq('profile_id', user.id)
      .eq('is_active', true)
      .single()

    if (!membership) {
      return { isAuthenticated: true, profileId: user.id, workspaceId: null, role: null }
    }

    return {
      isAuthenticated: true,
      profileId: user.id,
      workspaceId: membership.workspace_id,
      role: membership.monitor_role as MonitorRole,
    }
  } catch {
    return { isAuthenticated: false, profileId: null, workspaceId: null, role: null }
  }
}

/**
 * Require at minimum a specific monitor role for admin routes.
 * Throws if the user doesn't have the required role.
 */
export async function requireMonitorRole(
  minimumRole: MonitorRole
): Promise<MonitorAuthResult & { isAuthenticated: true; profileId: string; workspaceId: string; role: MonitorRole }> {
  const auth = await getMonitorAuth()

  if (!auth.isAuthenticated || !auth.workspaceId || !auth.role) {
    throw new Error('Unauthorized: Not a workspace member')
  }

  const roleHierarchy: Record<MonitorRole, number> = {
    owner: 4,
    admin: 3,
    staff: 2,
    viewer: 1,
  }

  if (roleHierarchy[auth.role] < roleHierarchy[minimumRole]) {
    throw new Error(`Forbidden: Requires at least ${minimumRole} role`)
  }

  return auth as MonitorAuthResult & {
    isAuthenticated: true
    profileId: string
    workspaceId: string
    role: MonitorRole
  }
}

/**
 * Validate a session token from request headers or body.
 * Used for public (anonymous) routes.
 */
export function getSessionTokenFromRequest(request: Request): string | null {
  // Check header first
  const headerToken = request.headers.get('x-monitor-session-token')
  if (headerToken) return headerToken

  return null
}
