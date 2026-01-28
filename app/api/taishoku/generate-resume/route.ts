import { NextRequest, NextResponse } from 'next/server';
import { generateResumeFromText, refineResume, ResumeData } from '@/lib/gemini';

export const maxDuration = 60; // 最大60秒のタイムアウト

export async function POST(request: NextRequest) {
  try {
    // Gemini API Keyの確認
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    // リファイン（修正・改善）リクエストの場合
    if (body.action === 'refine') {
      const { currentResume, instructions } = body as {
        currentResume: ResumeData;
        instructions: string;
      };

      if (!currentResume || !instructions) {
        return NextResponse.json(
          { error: 'currentResume and instructions are required for refine action' },
          { status: 400 }
        );
      }

      const refinedResume = await refineResume(currentResume, instructions);

      return NextResponse.json({
        success: true,
        resume: refinedResume,
      });
    }

    // 新規生成リクエストの場合
    const { transcript, personalInfo } = body as {
      transcript: string;
      personalInfo: {
        name: string;
        phone: string;
        age: string;
        prefecture: string;
      };
    };

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    if (!personalInfo || !personalInfo.name || !personalInfo.phone || !personalInfo.age || !personalInfo.prefecture) {
      return NextResponse.json(
        { error: 'Personal info (name, phone, age, prefecture) is required' },
        { status: 400 }
      );
    }

    // Gemini APIで履歴書データを生成
    const resumeData = await generateResumeFromText(transcript, personalInfo);

    return NextResponse.json({
      success: true,
      resume: resumeData,
    });
  } catch (error) {
    console.error('Resume generation error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: `Failed to generate resume: ${errorMessage}` },
      { status: 500 }
    );
  }
}
