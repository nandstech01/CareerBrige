import { NextRequest, NextResponse } from 'next/server'
import { generateResumeFromText, refineResume } from '@/lib/monitor/ai'
import type { ResumeData } from '@/lib/gemini'
import { updateSessionResume, incrementAiCalls, getSessionByToken } from '@/lib/monitor/session'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { sessionToken } = body as { sessionToken?: string }

    // Refine existing resume
    if (body.action === 'refine') {
      const { currentResume, instructions } = body as {
        currentResume: ResumeData
        instructions: string
      }

      if (!currentResume || !instructions) {
        return NextResponse.json(
          { error: 'currentResume and instructions are required for refine action' },
          { status: 400 }
        )
      }

      const refinedResume = await refineResume(currentResume, instructions)

      // Track AI call and update session
      if (sessionToken) {
        try {
          const session = await getSessionByToken(sessionToken)
          if (session) {
            await incrementAiCalls(sessionToken)
            await updateSessionResume(sessionToken, refinedResume)
          }
        } catch (err) {
          console.error('Session update error (non-blocking):', err)
        }
      }

      return NextResponse.json({
        success: true,
        resume: refinedResume,
      })
    }

    // Generate new resume
    const { transcript, personalInfo } = body as {
      transcript: string
      personalInfo: {
        name: string
        phone: string
        age: string
        prefecture: string
      }
    }

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      )
    }

    if (!personalInfo || !personalInfo.name || !personalInfo.phone || !personalInfo.age || !personalInfo.prefecture) {
      return NextResponse.json(
        { error: 'Personal info (name, phone, age, prefecture) is required' },
        { status: 400 }
      )
    }

    const resumeData = await generateResumeFromText(transcript, personalInfo)

    // Save resume to session
    if (sessionToken) {
      try {
        const session = await getSessionByToken(sessionToken)
        if (session) {
          await incrementAiCalls(sessionToken)
          await updateSessionResume(sessionToken, resumeData)
        }
      } catch (err) {
        console.error('Session update error (non-blocking):', err)
      }
    }

    return NextResponse.json({
      success: true,
      resume: resumeData,
    })
  } catch (error) {
    console.error('Resume generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to generate resume: ${errorMessage}` },
      { status: 500 }
    )
  }
}
