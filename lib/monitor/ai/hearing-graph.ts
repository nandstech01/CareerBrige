import { Annotation, StateGraph, END } from '@langchain/langgraph'
import { transcribeAudio } from '@/lib/gemini'
import {
  createStage1Chain,
  createStage2Chain,
  createQualityCheckChain,
} from './chains'
import type { Stage1Output, Stage2Output, QualityCheckOutput } from './schemas'
import type { Stage1Data, Stage2Data } from '@/types/database'

// ============================================================
// Stage1 グラフ
// ============================================================

const Stage1State = Annotation.Root({
  // 入力
  audioBase64: Annotation<string>,
  mimeType: Annotation<string>,
  personalInfo: Annotation<{ name: string; age: string; prefecture: string }>,
  // 中間状態
  transcript: Annotation<string>,
  extractedData: Annotation<Stage1Output | null>,
  qualityCheck: Annotation<QualityCheckOutput | null>,
  retryCount: Annotation<number>,
  // 出力
  result: Annotation<{ transcript: string; stage1Data: Stage1Data } | null>,
})

type Stage1StateType = typeof Stage1State.State

async function stage1Transcribe(state: Stage1StateType): Promise<Partial<Stage1StateType>> {
  const transcript = await transcribeAudio(state.audioBase64, state.mimeType)
  return { transcript, retryCount: 0 }
}

async function stage1Extract(state: Stage1StateType): Promise<Partial<Stage1StateType>> {
  const chain = createStage1Chain()
  const extracted = await chain.invoke({
    name: state.personalInfo.name,
    age: state.personalInfo.age || '',
    prefecture: state.personalInfo.prefecture,
    transcript: state.transcript,
  })
  return { extractedData: extracted }
}

async function stage1Validate(state: Stage1StateType): Promise<Partial<Stage1StateType>> {
  const chain = createQualityCheckChain('stage1')
  const check = await chain.invoke({
    transcript: state.transcript,
    extractedData: JSON.stringify(state.extractedData, null, 2),
  })
  return { qualityCheck: check }
}

async function stage1Refine(state: Stage1StateType): Promise<Partial<Stage1StateType>> {
  const chain = createStage1Chain()
  const feedback = state.qualityCheck
    ? `\n\n【品質検証フィードバック】\n不足フィールド: ${state.qualityCheck.missingFields.join(', ')}\n改善提案: ${state.qualityCheck.suggestions.join(', ')}`
    : ''

  const extracted = await chain.invoke({
    name: state.personalInfo.name,
    age: state.personalInfo.age || '',
    prefecture: state.personalInfo.prefecture,
    transcript: state.transcript + feedback,
  })
  return { extractedData: extracted, retryCount: state.retryCount + 1 }
}

async function stage1Finalize(state: Stage1StateType): Promise<Partial<Stage1StateType>> {
  return {
    result: {
      transcript: state.transcript,
      stage1Data: {
        ...state.extractedData!,
        generatedAt: new Date().toISOString(),
      },
    },
  }
}

function stage1ShouldRetry(state: Stage1StateType): 'refine' | 'finalize' {
  if (!state.qualityCheck) return 'finalize'
  if (state.qualityCheck.isAcceptable) return 'finalize'
  if (state.retryCount >= 2) {
    console.log('[Stage1] Max retries reached, using best available result')
    return 'finalize'
  }
  console.log(`[Stage1] Quality check failed (retry ${state.retryCount + 1}/2), refining...`)
  return 'refine'
}

export function createStage1Graph() {
  const graph = new StateGraph(Stage1State)
    .addNode('transcribe', stage1Transcribe)
    .addNode('extract', stage1Extract)
    .addNode('validate', stage1Validate)
    .addNode('refine', stage1Refine)
    .addNode('finalize', stage1Finalize)
    .addEdge('__start__', 'transcribe')
    .addEdge('transcribe', 'extract')
    .addEdge('extract', 'validate')
    .addConditionalEdges('validate', stage1ShouldRetry)
    .addEdge('refine', 'validate')
    .addEdge('finalize', END)

  return graph.compile()
}

// ============================================================
// Stage2 グラフ
// ============================================================

const Stage2State = Annotation.Root({
  // 入力
  audioBase64: Annotation<string>,
  mimeType: Annotation<string>,
  personalInfo: Annotation<{ name: string; prefecture: string }>,
  // 中間状態
  transcript: Annotation<string>,
  extractedData: Annotation<Stage2Output | null>,
  qualityCheck: Annotation<QualityCheckOutput | null>,
  retryCount: Annotation<number>,
  // 出力
  result: Annotation<{ transcript: string; stage2Data: Stage2Data } | null>,
})

type Stage2StateType = typeof Stage2State.State

async function stage2Transcribe(state: Stage2StateType): Promise<Partial<Stage2StateType>> {
  const transcript = await transcribeAudio(state.audioBase64, state.mimeType)
  return { transcript, retryCount: 0 }
}

async function stage2Extract(state: Stage2StateType): Promise<Partial<Stage2StateType>> {
  const chain = createStage2Chain()
  const now = new Date()
  const extracted = await chain.invoke({
    currentYear: String(now.getFullYear()),
    currentMonth: String(now.getMonth() + 1),
    name: state.personalInfo.name,
    prefecture: state.personalInfo.prefecture,
    transcript: state.transcript,
  })
  return { extractedData: extracted }
}

async function stage2Validate(state: Stage2StateType): Promise<Partial<Stage2StateType>> {
  const chain = createQualityCheckChain('stage2')
  const check = await chain.invoke({
    transcript: state.transcript,
    extractedData: JSON.stringify(state.extractedData, null, 2),
  })
  return { qualityCheck: check }
}

async function stage2Refine(state: Stage2StateType): Promise<Partial<Stage2StateType>> {
  const chain = createStage2Chain()
  const now = new Date()
  const feedback = state.qualityCheck
    ? `\n\n【品質検証フィードバック】\n不足フィールド: ${state.qualityCheck.missingFields.join(', ')}\n改善提案: ${state.qualityCheck.suggestions.join(', ')}`
    : ''

  const extracted = await chain.invoke({
    currentYear: String(now.getFullYear()),
    currentMonth: String(now.getMonth() + 1),
    name: state.personalInfo.name,
    prefecture: state.personalInfo.prefecture,
    transcript: state.transcript + feedback,
  })
  return { extractedData: extracted, retryCount: state.retryCount + 1 }
}

async function stage2Finalize(state: Stage2StateType): Promise<Partial<Stage2StateType>> {
  const data = state.extractedData!
  return {
    result: {
      transcript: state.transcript,
      stage2Data: {
        birthDate: data.birthDate ?? { year: 0, month: 1 },
        education: data.education,
        workHistory: data.workHistory,
        qualifications: data.qualifications,
        generatedAt: new Date().toISOString(),
      },
    },
  }
}

function stage2ShouldRetry(state: Stage2StateType): 'refine' | 'finalize' {
  if (!state.qualityCheck) return 'finalize'
  if (state.qualityCheck.isAcceptable) return 'finalize'
  if (state.retryCount >= 2) {
    console.log('[Stage2] Max retries reached, using best available result')
    return 'finalize'
  }
  console.log(`[Stage2] Quality check failed (retry ${state.retryCount + 1}/2), refining...`)
  return 'refine'
}

export function createStage2Graph() {
  const graph = new StateGraph(Stage2State)
    .addNode('transcribe', stage2Transcribe)
    .addNode('extract', stage2Extract)
    .addNode('validate', stage2Validate)
    .addNode('refine', stage2Refine)
    .addNode('finalize', stage2Finalize)
    .addEdge('__start__', 'transcribe')
    .addEdge('transcribe', 'extract')
    .addEdge('extract', 'validate')
    .addConditionalEdges('validate', stage2ShouldRetry)
    .addEdge('refine', 'validate')
    .addEdge('finalize', END)

  return graph.compile()
}
