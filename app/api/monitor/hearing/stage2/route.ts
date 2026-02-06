import { NextRequest, NextResponse } from 'next/server'
import { processHearingStage2 } from '@/lib/monitor/ai'
import { getSessionById, updateSessionStage2, startStage2Recording } from '@/lib/monitor/session'

export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null
    const sessionId = formData.get('sessionId') as string | null

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 25MB limit' },
        { status: 400 }
      )
    }

    // Verify session exists and Stage1 is complete
    const session = await getSessionById(sessionId)
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (!session.stage1_data) {
      return NextResponse.json(
        { error: 'Stage1 must be completed before Stage2' },
        { status: 400 }
      )
    }

    // Get personal info from session (name and prefecture only, birth date will be extracted from voice)
    const basicInfo = session.basic_info as Record<string, string> | null
    const personalInfo = {
      name: basicInfo?.name || '',
      prefecture: basicInfo?.prefecture || '',
    }

    // Mark as recording in progress
    await startStage2Recording(sessionId)

    // Convert to base64
    const arrayBuffer = await audioFile.arrayBuffer()
    const base64Audio = Buffer.from(arrayBuffer).toString('base64')

    // Determine MIME type
    let mimeType = audioFile.type
    if (!mimeType) {
      const fileName = audioFile.name.toLowerCase()
      if (fileName.endsWith('.mp3')) mimeType = 'audio/mp3'
      else if (fileName.endsWith('.wav')) mimeType = 'audio/wav'
      else if (fileName.endsWith('.webm')) mimeType = 'audio/webm'
      else if (fileName.endsWith('.ogg')) mimeType = 'audio/ogg'
      else if (fileName.endsWith('.m4a')) mimeType = 'audio/mp4'
      else mimeType = 'audio/mpeg'
    }

    // Process Stage2: transcribe → extract → validate → finalize (LangGraph)
    const { transcript, stage2Data } = await processHearingStage2(base64Audio, mimeType, personalInfo)

    // Save to database
    await updateSessionStage2(sessionId, stage2Data, transcript)

    return NextResponse.json({
      success: true,
      transcript,
      stage2Data,
    })
  } catch (error) {
    console.error('Stage2 processing error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to process Stage2: ${errorMessage}` },
      { status: 500 }
    )
  }
}
