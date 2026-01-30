import { NextRequest, NextResponse } from 'next/server'
import { requireMonitorRole } from '@/lib/monitor/auth'
import { createMonitorAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/monitor/admin/users
 * List workspace members
 */
export async function GET() {
  try {
    const auth = await requireMonitorRole('admin')
    const supabase = createMonitorAdminClient()

    const { data: members, error } = await supabase
      .from('monitor_workspace_members')
      .select(`
        id,
        monitor_role,
        is_active,
        created_at,
        profile_id,
        profiles (
          id,
          display_name,
          email,
          role
        )
      `)
      .eq('workspace_id', auth.workspaceId)
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)

    // Get workspace limits
    const { data: workspace } = await supabase
      .from('monitor_workspaces')
      .select('max_admin_accounts, max_general_accounts')
      .eq('id', auth.workspaceId)
      .single()

    const adminCount = members?.filter(m =>
      ['owner', 'admin'].includes(m.monitor_role) && m.is_active
    ).length || 0

    const generalCount = members?.filter(m =>
      ['staff', 'viewer'].includes(m.monitor_role) && m.is_active
    ).length || 0

    return NextResponse.json({
      success: true,
      members: members || [],
      limits: {
        maxAdmin: workspace?.max_admin_accounts || 3,
        maxGeneral: workspace?.max_general_accounts || 30,
        currentAdmin: adminCount,
        currentGeneral: generalCount,
      },
    })
  } catch (error) {
    console.error('Users error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch users'
    const status = message.includes('Unauthorized') || message.includes('Forbidden') ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

/**
 * POST /api/monitor/admin/users
 * Add a workspace member
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireMonitorRole('admin')
    const body = await request.json()
    const { profileId, role } = body as { profileId: string; role: string }

    if (!profileId || !role) {
      return NextResponse.json({ error: 'profileId and role are required' }, { status: 400 })
    }

    const supabase = createMonitorAdminClient()

    // Check limits
    const { data: members } = await supabase
      .from('monitor_workspace_members')
      .select('monitor_role, is_active')
      .eq('workspace_id', auth.workspaceId)
      .eq('is_active', true)

    const { data: workspace } = await supabase
      .from('monitor_workspaces')
      .select('max_admin_accounts, max_general_accounts')
      .eq('id', auth.workspaceId)
      .single()

    const isAdminRole = ['owner', 'admin'].includes(role)
    const currentCount = members?.filter(m =>
      isAdminRole
        ? ['owner', 'admin'].includes(m.monitor_role)
        : ['staff', 'viewer'].includes(m.monitor_role)
    ).length || 0

    const maxCount = isAdminRole
      ? (workspace?.max_admin_accounts || 3)
      : (workspace?.max_general_accounts || 30)

    if (currentCount >= maxCount) {
      return NextResponse.json(
        { error: `アカウント上限（${maxCount}）に達しています` },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('monitor_workspace_members')
      .insert({
        workspace_id: auth.workspaceId,
        profile_id: profileId,
        monitor_role: role as 'owner' | 'admin' | 'staff' | 'viewer',
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true, member: data })
  } catch (error) {
    console.error('Add user error:', error)
    const message = error instanceof Error ? error.message : 'Failed to add user'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
