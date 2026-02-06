import { createCompanyAnalysisChain, createCustomizeChain } from './ai/chains'

export interface CompanyAnalysis {
  companyName: string
  industry: string
  businessDescription: string
  desiredTalent: string
  companyCulture: string
  keyPoints: string[]
}

/**
 * Fetch and extract text content from a company URL
 */
async function fetchPageContent(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; CareerBridge/1.0)',
      'Accept': 'text/html',
    },
    signal: AbortSignal.timeout(10000),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`)
  }

  const html = await response.text()

  // Strip HTML tags and extract text
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Limit to ~8000 chars to stay within Gemini context
  return text.slice(0, 8000)
}

/**
 * Analyze company information from a URL using Gemini (LangChain)
 */
export async function analyzeCompany(url: string): Promise<CompanyAnalysis> {
  // Validate URL
  try {
    new URL(url)
  } catch {
    throw new Error('Invalid URL format')
  }

  // Fetch page content
  const pageContent = await fetchPageContent(url)

  if (!pageContent || pageContent.length < 50) {
    throw new Error('Could not extract sufficient content from the URL')
  }

  const chain = createCompanyAnalysisChain()
  return await chain.invoke({ url, pageContent })
}

/**
 * Generate a customized resume tailored to a specific company (LangChain)
 */
export async function generateCustomizedResume(
  baseResume: import('@/lib/gemini').ResumeData,
  companyAnalysis: CompanyAnalysis
): Promise<import('@/lib/gemini').ResumeData> {
  const chain = createCustomizeChain()
  const result = await chain.invoke({
    companyName: companyAnalysis.companyName,
    industry: companyAnalysis.industry,
    businessDescription: companyAnalysis.businessDescription,
    desiredTalent: companyAnalysis.desiredTalent,
    companyCulture: companyAnalysis.companyCulture,
    keyPoints: companyAnalysis.keyPoints.join(', '),
    baseResume: JSON.stringify(baseResume, null, 2),
  })

  return {
    ...result,
    rawTranscript: baseResume.rawTranscript,
  }
}
