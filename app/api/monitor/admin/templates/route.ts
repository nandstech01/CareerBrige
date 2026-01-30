import { NextRequest, NextResponse } from 'next/server'
import { requireMonitorRole } from '@/lib/monitor/auth'
import { createMonitorAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/monitor/admin/templates
 * List templates for the workspace
 */
export async function GET() {
  try {
    const auth = await requireMonitorRole('viewer')
    const supabase = createMonitorAdminClient()

    const { data, error } = await supabase
      .from('monitor_templates')
      .select('*')
      .or(`workspace_id.eq.${auth.workspaceId},workspace_id.is.null`)
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true, templates: data || [] })
  } catch (error) {
    console.error('Templates error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch templates'
    const status = message.includes('Unauthorized') || message.includes('Forbidden') ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

/**
 * POST /api/monitor/admin/templates
 * Create a new template
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireMonitorRole('staff')
    const body = await request.json()
    const { name, description, templateType, templateData, isDefault } = body as {
      name: string
      description?: string
      templateType?: string
      templateData: Record<string, unknown>
      isDefault?: boolean
    }

    if (!name || !templateData) {
      return NextResponse.json({ error: 'name and templateData are required' }, { status: 400 })
    }

    const supabase = createMonitorAdminClient()

    // If setting as default, unset existing default
    if (isDefault) {
      await supabase
        .from('monitor_templates')
        .update({ is_default: false })
        .eq('workspace_id', auth.workspaceId)
        .eq('is_default', true)
    }

    const { data, error } = await supabase
      .from('monitor_templates')
      .insert({
        workspace_id: auth.workspaceId,
        name,
        description: description || null,
        template_type: templateType || 'resume',
        template_data: templateData,
        is_default: isDefault || false,
        created_by: auth.profileId,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true, template: data })
  } catch (error) {
    console.error('Create template error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create template'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
