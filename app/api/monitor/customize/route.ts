import { NextRequest, NextResponse } from 'next/server'
import { analyzeCompany, generateCustomizedResume } from '@/lib/monitor/company-analyzer'
import type { ResumeData } from '@/lib/gemini'

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
    const { action, companyUrl, baseResume, companyAnalysis } = body as {
      action?: 'analyze' | 'customize'
      companyUrl?: string
      baseResume?: ResumeData
      companyAnalysis?: import('@/lib/monitor/company-analyzer').CompanyAnalysis
    }

    // Step 1: Analyze company from URL
    if (action === 'analyze' || (!action && companyUrl && !baseResume)) {
      if (!companyUrl) {
        return NextResponse.json(
          { error: 'Company URL is required' },
          { status: 400 }
        )
      }

      const analysis = await analyzeCompany(companyUrl)

      return NextResponse.json({
        success: true,
        analysis,
      })
    }

    // Step 2: Generate customized resume
    if (action === 'customize' || (baseResume && companyAnalysis)) {
      if (!baseResume) {
        return NextResponse.json(
          { error: 'Base resume data is required' },
          { status: 400 }
        )
      }

      if (!companyAnalysis) {
        return NextResponse.json(
          { error: 'Company analysis data is required' },
          { status: 400 }
        )
      }

      const customizedResume = await generateCustomizedResume(baseResume, companyAnalysis)

      return NextResponse.json({
        success: true,
        resume: customizedResume,
      })
    }

    return NextResponse.json(
      { error: 'Invalid request: provide action or companyUrl/baseResume' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Customize error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: `Failed to process: ${errorMessage}` },
      { status: 500 }
    )
  }
}
