import { NextRequest, NextResponse } from 'next/server'
import { processHearingStage1 } from '@/lib/monitor/ai'
import { getSessionById, updateSessionStage1, updateSessionHearingBasicInfo, startStage1Recording } from '@/lib/monitor/session'

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
    const name = formData.get('name') as string | null
    const postalCode = formData.get('postalCode') as string | null
    const prefecture = formData.get('prefecture') as string | null
    const city = formData.get('city') as string | null
    const streetAddress = formData.get('streetAddress') as string | null

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

    // Verify session exists
    const session = await getSessionById(sessionId)
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Update basic info if provided
    const existingBasicInfo = session.basic_info as Record<string, string> | null
    const basicInfo = {
      name: name || existingBasicInfo?.name || '',
      postalCode: postalCode || existingBasicInfo?.postalCode || '',
      prefecture: prefecture || existingBasicInfo?.prefecture || '',
      city: city || existingBasicInfo?.city || '',
      streetAddress: streetAddress || existingBasicInfo?.streetAddress || '',
    }

    // For generateStage1Data, we only need name and prefecture
    const personalInfo = {
      name: basicInfo.name,
      age: '', // Age is no longer used, birth date extracted in Stage2
      prefecture: basicInfo.prefecture,
    }

    if (name || postalCode || prefecture || city || streetAddress) {
      await updateSessionHearingBasicInfo(sessionId, basicInfo)
    }

    // Mark as recording in progress
    await startStage1Recording(sessionId)

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

    // Process Stage1: transcribe → extract → validate → finalize (LangGraph)
    const { transcript, stage1Data } = await processHearingStage1(base64Audio, mimeType, personalInfo)

    // Save to database
    await updateSessionStage1(sessionId, stage1Data, transcript)

    return NextResponse.json({
      success: true,
      transcript,
      stage1Data,
    })
  } catch (error) {
    console.error('Stage1 processing error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to process Stage1: ${errorMessage}` },
      { status: 500 }
    )
  }
}
