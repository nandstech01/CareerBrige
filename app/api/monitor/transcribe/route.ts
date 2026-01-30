import { NextRequest, NextResponse } from 'next/server'
import { transcribeAudio } from '@/lib/gemini'
import { updateSessionTranscript, incrementAiCalls, getSessionByToken } from '@/lib/monitor/session'

export const maxDuration = 60

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
    const sessionToken = formData.get('sessionToken') as string | null

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

    // Transcribe with Gemini
    const transcript = await transcribeAudio(base64Audio, mimeType)

    // Save transcript to session if token provided
    if (sessionToken) {
      try {
        const session = await getSessionByToken(sessionToken)
        if (session) {
          await updateSessionTranscript(sessionToken, transcript)
          await incrementAiCalls(sessionToken)
        }
      } catch (err) {
        console.error('Session update error (non-blocking):', err)
      }
    }

    return NextResponse.json({
      success: true,
      transcript,
    })
  } catch (error) {
    console.error('Transcription error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to transcribe audio: ${errorMessage}` },
      { status: 500 }
    )
  }
}
