import { NextRequest, NextResponse } from 'next/server'
import { createApplySession } from '@/lib/monitor/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, age, gender, prefecture, canRelocate, hasResume, jobTemperature, lineId } = body

    if (!name || !age || !gender || !prefecture) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      )
    }

    const session = await createApplySession({
      name,
      age: String(age),
      gender,
      prefecture,
      canRelocate: Boolean(canRelocate),
      hasResume: Boolean(hasResume),
      jobTemperature: typeof jobTemperature === 'string' ? jobTemperature : Array.isArray(jobTemperature) ? jobTemperature.join(', ') : '',
      lineId: lineId || '',
    })

    return NextResponse.json({ success: true, sessionId: session.id })
  } catch (error) {
    console.error('Apply API error:', error)
    const message = error instanceof Error ? error.message : 'Failed to save application'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
