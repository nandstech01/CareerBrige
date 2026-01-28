import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/gemini';

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

    // FormDataから音声ファイルを取得
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    // ファイルサイズチェック（最大25MB）
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 25MB limit' },
        { status: 400 }
      );
    }

    // 音声ファイルをBase64に変換
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    // MIMEタイプの取得
    let mimeType = audioFile.type;

    // MIMEタイプが空の場合、ファイル名から推測
    if (!mimeType) {
      const fileName = audioFile.name.toLowerCase();
      if (fileName.endsWith('.mp3')) {
        mimeType = 'audio/mp3';
      } else if (fileName.endsWith('.wav')) {
        mimeType = 'audio/wav';
      } else if (fileName.endsWith('.webm')) {
        mimeType = 'audio/webm';
      } else if (fileName.endsWith('.ogg')) {
        mimeType = 'audio/ogg';
      } else if (fileName.endsWith('.m4a')) {
        mimeType = 'audio/mp4';
      } else {
        mimeType = 'audio/mpeg'; // デフォルト
      }
    }

    // Gemini APIで文字起こし
    const transcript = await transcribeAudio(base64Audio, mimeType);

    return NextResponse.json({
      success: true,
      transcript,
    });
  } catch (error) {
    console.error('Transcription error:', error);

    // エラーメッセージの整形
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      { error: `Failed to transcribe audio: ${errorMessage}` },
      { status: 500 }
    );
  }
}
