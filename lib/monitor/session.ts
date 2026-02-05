import { createMonitorAdminClient } from '@/lib/supabase/admin'
import type { MonitorSessionStatus, Stage1Data, Stage2Data } from '@/types/database'
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
  source?: 'public' | 'company_hearing' | 'apply_form'
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

/**
 * Create a session from the apply form (LINE応募)
 */
export async function createApplySession(formData: {
  name: string
  age: string
  gender: string
  prefecture: string
  canRelocate: boolean
  hasResume: boolean
  jobTemperature: string
  lineId: string
}) {
  const supabase = createMonitorAdminClient()

  const { data, error } = await supabase
    .from('monitor_sessions')
    .insert({
      session_token: generateSessionToken(),
      source: 'apply_form',
      workspace_id: null,
      status: 'applied' as MonitorSessionStatus,
      step_reached: 0,
      basic_info: formData as unknown as Record<string, unknown>,
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create apply session: ${error.message}`)
  return data
}

/**
 * Update session status (admin use)
 */
export async function updateSessionStatus(
  sessionId: string,
  status: MonitorSessionStatus,
  notes?: string
) {
  const supabase = createMonitorAdminClient()

  // If notes provided, merge into basic_info
  if (notes !== undefined) {
    const session = await getSessionById(sessionId)
    if (!session) throw new Error('Session not found')

    const currentInfo = (session.basic_info || {}) as Record<string, unknown>
    const updatedInfo = { ...currentInfo, admin_notes: notes }

    const { data, error } = await supabase
      .from('monitor_sessions')
      .update({
        status,
        basic_info: updatedInfo,
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw new Error(`Failed to update session status: ${error.message}`)
    return data
  }

  const { data, error } = await supabase
    .from('monitor_sessions')
    .update({ status })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update session status: ${error.message}`)
  return data
}

// ============================================================
// 2-Stage Hearing Functions
// ============================================================

/**
 * Update session basic info for hearing (name, age, prefecture only - no phone)
 */
export async function updateSessionHearingBasicInfo(
  sessionId: string,
  basicInfo: { name: string; age: string; prefecture: string }
) {
  const supabase = createMonitorAdminClient()

  const session = await getSessionById(sessionId)
  if (!session) throw new Error('Session not found')

  // Merge with existing basic_info to preserve LINE apply data
  const currentInfo = (session.basic_info || {}) as Record<string, unknown>
  const updatedInfo = { ...currentInfo, ...basicInfo }

  const { data, error } = await supabase
    .from('monitor_sessions')
    .update({
      basic_info: updatedInfo,
      current_stage: 1,
    })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update hearing basic info: ${error.message}`)
  return data
}

/**
 * Update session with Stage1 data (志望動機、本人希望記入欄、自己PR)
 */
export async function updateSessionStage1(
  sessionId: string,
  stage1Data: Stage1Data,
  transcript: string
) {
  const supabase = createMonitorAdminClient()

  const { data, error } = await supabase
    .from('monitor_sessions')
    .update({
      stage1_data: stage1Data as unknown as Record<string, unknown>,
      stage1_transcript: transcript,
      status: 'stage1_complete' as MonitorSessionStatus,
      current_stage: 1,
      ai_calls_count: 1,
    })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update stage1 data: ${error.message}`)
  return data
}

/**
 * Update session with Stage2 data (学歴、職歴、資格)
 */
export async function updateSessionStage2(
  sessionId: string,
  stage2Data: Stage2Data,
  transcript: string
) {
  const supabase = createMonitorAdminClient()

  // Get current AI calls count
  const session = await getSessionById(sessionId)
  if (!session) throw new Error('Session not found')

  const { data, error } = await supabase
    .from('monitor_sessions')
    .update({
      stage2_data: stage2Data as unknown as Record<string, unknown>,
      stage2_transcript: transcript,
      status: 'stage2_complete' as MonitorSessionStatus,
      current_stage: 2,
      ai_calls_count: session.ai_calls_count + 1,
    })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update stage2 data: ${error.message}`)
  return data
}

/**
 * Update session headshot URLs
 */
export async function updateSessionHeadshot(
  sessionId: string,
  headshotUrl: string,
  originalUrl?: string
) {
  const supabase = createMonitorAdminClient()

  const updateData: Record<string, unknown> = {
    headshot_url: headshotUrl,
  }
  if (originalUrl) {
    updateData.headshot_original_url = originalUrl
  }

  const { data, error } = await supabase
    .from('monitor_sessions')
    .update(updateData)
    .eq('id', sessionId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update headshot: ${error.message}`)
  return data
}

/**
 * Mark session as Stage1 recording in progress
 */
export async function startStage1Recording(sessionId: string) {
  const supabase = createMonitorAdminClient()

  const { data, error } = await supabase
    .from('monitor_sessions')
    .update({
      status: 'stage1_recording' as MonitorSessionStatus,
      current_stage: 1,
    })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) throw new Error(`Failed to start stage1 recording: ${error.message}`)
  return data
}

/**
 * Mark session as Stage2 recording in progress
 */
export async function startStage2Recording(sessionId: string) {
  const supabase = createMonitorAdminClient()

  const { data, error } = await supabase
    .from('monitor_sessions')
    .update({
      status: 'stage2_recording' as MonitorSessionStatus,
      current_stage: 2,
    })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) throw new Error(`Failed to start stage2 recording: ${error.message}`)
  return data
}

/**
 * Complete hearing session (both stages done, PDF downloaded)
 */
export async function completeHearingSession(sessionId: string) {
  const supabase = createMonitorAdminClient()

  const { data, error } = await supabase
    .from('monitor_sessions')
    .update({
      status: 'completed' as MonitorSessionStatus,
      pdf_downloaded: true,
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .select()
    .single()

  if (error) throw new Error(`Failed to complete hearing session: ${error.message}`)
  return data
}
