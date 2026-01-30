import { createMonitorAdminClient } from '@/lib/supabase/admin'
import type { MonitorSessionStatus } from '@/types/database'
import type { ResumeData } from '@/lib/gemini'

/**
 * Generate a unique session token (UUID v4 format)
 */
export function generateSessionToken(): string {
  return crypto.randomUUID()
}

/**
 * Create a new monitor session
 */
export async function createSession(params: {
  sessionToken: string
  source?: 'public' | 'company_hearing'
  workspaceId?: string | null
  createdByProfileId?: string | null
  assignedStaffId?: string | null
}) {
  const supabase = createMonitorAdminClient()

  const { data, error } = await supabase
    .from('monitor_sessions')
    .insert({
      session_token: params.sessionToken,
      source: params.source || 'public',
      workspace_id: params.workspaceId || null,
      created_by_profile_id: params.createdByProfileId || null,
      assigned_staff_id: params.assignedStaffId || null,
      status: 'started',
      step_reached: 1,
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create session: ${error.message}`)
  return data
}

/**
 * Get a session by token
 */
export async function getSessionByToken(sessionToken: string) {
  const supabase = createMonitorAdminClient()

  const { data, error } = await supabase
    .from('monitor_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .single()

  if (error) return null
  return data
}

/**
 * Get a session by ID
 */
export async function getSessionById(sessionId: string) {
  const supabase = createMonitorAdminClient()

  const { data, error } = await supabase
    .from('monitor_sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (error) return null
  return data
}

/**
 * Update session with basic info (Step 1)
 */
export async function updateSessionBasicInfo(
  sessionToken: string,
  basicInfo: { name: string; phone: string; age: string; prefecture: string }
) {
  const supabase = createMonitorAdminClient()

  const { data, error } = await supabase
    .from('monitor_sessions')
    .update({
      basic_info: basicInfo as unknown as Record<string, unknown>,
      status: 'basic_info' as MonitorSessionStatus,
      step_reached: 2,
    })
    .eq('session_token', sessionToken)
    .select()
    .single()

  if (error) throw new Error(`Failed to update basic info: ${error.message}`)
  return data
}

/**
 * Update session with transcript (Step 2)
 */
export async function updateSessionTranscript(
  sessionToken: string,
  transcript: string
) {
  const supabase = createMonitorAdminClient()

  const { data, error } = await supabase
    .from('monitor_sessions')
    .update({
      transcript,
      status: 'transcribing' as MonitorSessionStatus,
      ai_calls_count: 1, // transcribe call
    })
    .eq('session_token', sessionToken)
    .select()
    .single()

  if (error) throw new Error(`Failed to update transcript: ${error.message}`)
  return data
}

/**
 * Update session with generated resume (Step 3)
 */
export async function updateSessionResume(
  sessionToken: string,
  resumeData: ResumeData
) {
  const supabase = createMonitorAdminClient()

  const { data, error } = await supabase
    .from('monitor_sessions')
    .update({
      resume_data: resumeData as unknown as Record<string, unknown>,
      status: 'reviewing' as MonitorSessionStatus,
      step_reached: 3,
    })
    .eq('session_token', sessionToken)
    .select()
    .single()

  if (error) throw new Error(`Failed to update resume: ${error.message}`)
  return data
}

/**
 * Increment AI calls count (for refine operations)
 */
export async function incrementAiCalls(sessionToken: string) {
  const supabase = createMonitorAdminClient()

  // Get current count
  const session = await getSessionByToken(sessionToken)
  if (!session) return

  await supabase
    .from('monitor_sessions')
    .update({
      ai_calls_count: session.ai_calls_count + 1,
    })
    .eq('session_token', sessionToken)
}

/**
 * Mark session as completed (Step 4: PDF downloaded)
 */
export async function completeSession(sessionToken: string) {
  const supabase = createMonitorAdminClient()

  const { data, error } = await supabase
    .from('monitor_sessions')
    .update({
      status: 'completed' as MonitorSessionStatus,
      step_reached: 4,
      pdf_downloaded: true,
      completed_at: new Date().toISOString(),
    })
    .eq('session_token', sessionToken)
    .select()
    .single()

  if (error) throw new Error(`Failed to complete session: ${error.message}`)
  return data
}

/**
 * List sessions for a workspace (admin use)
 */
export async function listWorkspaceSessions(
  workspaceId: string,
  options?: {
    status?: MonitorSessionStatus
    limit?: number
    offset?: number
  }
) {
  const supabase = createMonitorAdminClient()

  let query = supabase
    .from('monitor_sessions')
    .select('*', { count: 'exact' })
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1)
  }

  const { data, error, count } = await query

  if (error) throw new Error(`Failed to list sessions: ${error.message}`)
  return { sessions: data, total: count }
}

/**
 * List all public sessions (for analytics)
 */
export async function listPublicSessions(options?: {
  status?: MonitorSessionStatus
  limit?: number
  offset?: number
}) {
  const supabase = createMonitorAdminClient()

  let query = supabase
    .from('monitor_sessions')
    .select('*', { count: 'exact' })
    .is('workspace_id', null)
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1)
  }

  const { data, error, count } = await query

  if (error) throw new Error(`Failed to list sessions: ${error.message}`)
  return { sessions: data, total: count }
}
