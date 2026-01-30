import { NextRequest, NextResponse } from 'next/server'
import { createMonitorAdminClient } from '@/lib/supabase/admin'
import { getIpFromRequest } from '@/lib/monitor/logging'

/**
 * POST /api/monitor/consent
 * Record a consent decision
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, sessionToken, consentType, consented, consentVersion } = body as {
      sessionId?: string
      sessionToken?: string
      consentType: string
      consented: boolean
      consentVersion: string
    }

    if (!consentType || !consentVersion) {
      return NextResponse.json(
        { error: 'consentType and consentVersion are required' },
        { status: 400 }
      )
    }

    const supabase = createMonitorAdminClient()
    const ipAddress = getIpFromRequest(request)

    const { data, error } = await supabase
      .from('monitor_consent_records')
      .insert({
        session_id: sessionId || null,
        session_token: sessionToken || null,
        consent_type: consentType,
        consented,
        consent_version: consentVersion,
        ip_address: ipAddress,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // If consented and session exists, update session
    if (consented && sessionToken) {
      await supabase
        .from('monitor_sessions')
        .update({
          consent_given_at: new Date().toISOString(),
          consent_version: consentVersion,
        })
        .eq('session_token', sessionToken)
    }

    return NextResponse.json({ success: true, consent: data })
  } catch (error) {
    console.error('Consent error:', error)
    const message = error instanceof Error ? error.message : 'Failed to record consent'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
