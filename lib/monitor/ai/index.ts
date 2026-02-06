import type { Stage1Data, Stage2Data } from '@/types/database'
import type { ResumeData } from '@/lib/gemini'
import { createStage1Graph, createStage2Graph } from './hearing-graph'
import { createResumeChain, createRefineChain } from './chains'

// Re-export transcribeAudio from gemini.ts (used by /api/monitor/transcribe)
export { transcribeAudio } from '@/lib/gemini'

/**
 * Stage1 ヒアリング処理（LangGraph ワークフロー）
 * 音声 → 文字起こし → 抽出 → 品質検証 → 結果
 */
export async function processHearingStage1(
  audioBase64: string,
  mimeType: string,
  personalInfo: { name: string; age: string; prefecture: string }
): Promise<{ transcript: string; stage1Data: Stage1Data }> {
  const graph = createStage1Graph()
  const finalState = await graph.invoke({
    audioBase64,
    mimeType,
    personalInfo,
    transcript: '',
    extractedData: null,
    qualityCheck: null,
    retryCount: 0,
    result: null,
  })

  if (!finalState.result) {
    throw new Error('Stage1 processing failed: no result produced')
  }

  return finalState.result
}

/**
 * Stage2 ヒアリング処理（LangGraph ワークフロー）
 * 音声 → 文字起こし → 抽出 → 品質検証 → 結果
 */
export async function processHearingStage2(
  audioBase64: string,
  mimeType: string,
  personalInfo: { name: string; prefecture: string }
): Promise<{ transcript: string; stage2Data: Stage2Data }> {
  const graph = createStage2Graph()
  const finalState = await graph.invoke({
    audioBase64,
    mimeType,
    personalInfo,
    transcript: '',
    extractedData: null,
    qualityCheck: null,
    retryCount: 0,
    result: null,
  })

  if (!finalState.result) {
    throw new Error('Stage2 processing failed: no result produced')
  }

  return finalState.result
}

/**
 * 履歴書生成（LangChain チェーン）
 * 既存の generateResumeFromText() と同じシグネチャ
 */
export async function generateResumeFromText(
  transcript: string,
  personalInfo: {
    name: string
    phone: string
    age: string
    prefecture: string
  }
): Promise<ResumeData> {
  const chain = createResumeChain()
  const result = await chain.invoke({
    name: personalInfo.name,
    phone: personalInfo.phone,
    age: personalInfo.age,
    prefecture: personalInfo.prefecture,
    transcript,
  })

  return {
    ...result,
    rawTranscript: transcript,
  }
}

/**
 * 履歴書修正（LangChain チェーン）
 * 既存の refineResume() と同じシグネチャ
 */
export async function refineResume(
  currentResume: ResumeData,
  additionalInstructions: string
): Promise<ResumeData> {
  const chain = createRefineChain()
  const result = await chain.invoke({
    currentResume: JSON.stringify(currentResume, null, 2),
    instructions: additionalInstructions,
  })

  return {
    ...result,
    rawTranscript: currentResume.rawTranscript,
  }
}
