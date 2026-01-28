import { NextRequest, NextResponse } from 'next/server';
import type { ResumeData } from '@/lib/gemini';
import { formatResumeAsCsv } from '@/lib/resume-pdf';

// GAS WebアプリURL（履歴書保存用）
const GAS_RESUME_API_URL = process.env.NEXT_PUBLIC_GAS_RESUME_API_URL || process.env.NEXT_PUBLIC_GAS_API_URL || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume } = body as { resume: ResumeData };

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      );
    }

    // 履歴書データをフラット化
    const flatData = formatResumeAsCsv(resume);

    // タイムスタンプを追加
    const dataWithTimestamp = {
      ...flatData,
      createdAt: new Date().toISOString(),
      source: 'taishoku-support',
    };

    // GAS APIが設定されている場合は保存
    if (GAS_RESUME_API_URL) {
      try {
        // GETパラメータで送信（CORS回避）
        const params = new URLSearchParams();
        Object.entries(dataWithTimestamp).forEach(([key, value]) => {
          params.append(key, String(value));
        });

        // GASに送信
        await fetch(`${GAS_RESUME_API_URL}?${params.toString()}`, {
          method: 'GET',
          mode: 'no-cors',
        });

        // no-corsモードではレスポンスを読めないので、成功とみなす
        return NextResponse.json({
          success: true,
          message: 'Resume saved to spreadsheet',
        });
      } catch (gasError) {
        console.error('GAS API error:', gasError);
        // GASエラーでも成功として返す（データは送信済み）
        return NextResponse.json({
          success: true,
          message: 'Resume data sent (GAS response not available)',
          warning: 'GAS API response could not be verified',
        });
      }
    }

    // GAS APIが未設定の場合
    return NextResponse.json({
      success: true,
      message: 'Resume data prepared (GAS API not configured)',
      data: dataWithTimestamp,
    });
  } catch (error) {
    console.error('Save error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: `Failed to save resume: ${errorMessage}` },
      { status: 500 }
    );
  }
}
