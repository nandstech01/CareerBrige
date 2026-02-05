'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
} from '@react-pdf/renderer'
import { Download, Loader2, Briefcase } from 'lucide-react'
import type { Stage1Data, Stage2Data } from '@/types/database'

// フォント登録フラグ
let fontRegistered = false

function registerFonts() {
  if (fontRegistered) return

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  Font.register({
    family: 'Noto Sans JP',
    fonts: [
      { src: `${baseUrl}/fonts/NotoSansJP-Regular.ttf`, fontWeight: 400 },
      { src: `${baseUrl}/fonts/NotoSansJP-Bold.ttf`, fontWeight: 700 },
    ],
  })

  fontRegistered = true
}

// 職務経歴書スタイル
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Noto Sans JP',
    fontSize: 10,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 4,
  },
  dateRow: {
    textAlign: 'right',
    fontSize: 9,
    marginBottom: 15,
    color: '#666',
  },
  nameRow: {
    textAlign: 'right',
    fontSize: 11,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginBottom: 10,
    borderLeft: '3px solid #3CC8E8',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ddd',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd',
  },
  tableHeaderCell: {
    padding: 6,
    fontWeight: 'bold',
    fontSize: 9,
    borderRight: '1px solid #ddd',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #eee',
    minHeight: 28,
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
    borderRight: '1px solid #eee',
    justifyContent: 'center',
  },
  summaryBox: {
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 4,
    border: '1px solid #eee',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.6,
    color: '#444',
  },
  workEntry: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottom: '1px solid #eee',
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  period: {
    fontSize: 9,
    color: '#666',
  },
  positionBadge: {
    backgroundColor: '#e8f4fc',
    color: '#2563eb',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 8,
    marginBottom: 8,
  },
  workDescription: {
    fontSize: 9,
    lineHeight: 1.6,
    color: '#444',
    paddingLeft: 10,
    borderLeft: '2px solid #3CC8E8',
  },
  qualificationList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  qualificationItem: {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    fontSize: 9,
  },
  selfPRBox: {
    backgroundColor: '#fff7ed',
    padding: 12,
    borderRadius: 4,
    border: '1px solid #fed7aa',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 7,
    color: '#999',
  },
})

interface ShokumukeirekishoData {
  basicInfo: { name: string; age: string; prefecture: string }
  stage1: Stage1Data
  stage2: Stage2Data
}

function ShokumukeirekishoDocument({ data }: { data: ShokumukeirekishoData }) {
  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

  // 職歴の期間を計算
  const calculateTotalExperience = () => {
    let totalMonths = 0
    data.stage2.workHistory.forEach((work) => {
      const start = work.startYear * 12 + work.startMonth
      const end = work.isCurrent
        ? today.getFullYear() * 12 + (today.getMonth() + 1)
        : (work.endYear || today.getFullYear()) * 12 + (work.endMonth || 1)
      totalMonths += end - start
    })
    const years = Math.floor(totalMonths / 12)
    const months = totalMonths % 12
    return years > 0 ? `${years}年${months > 0 ? `${months}ヶ月` : ''}` : `${months}ヶ月`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* タイトル */}
        <Text style={styles.title}>職 務 経 歴 書</Text>
        <Text style={styles.dateRow}>{dateStr}</Text>
        <Text style={styles.nameRow}>{data.basicInfo.name}</Text>

        {/* 職務要約 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>職務要約</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              社会人経験 {calculateTotalExperience()}。
              {data.stage2.workHistory.length > 0 &&
                `これまで${data.stage2.workHistory.map((w) => w.companyName).join('、')}にて勤務。`}
              {data.stage1.motivation.substring(0, 100)}
              {data.stage1.motivation.length > 100 ? '...' : ''}
            </Text>
          </View>
        </View>

        {/* 職務経歴 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>職務経歴</Text>

          {data.stage2.workHistory.map((work, idx) => (
            <View key={idx} style={styles.workEntry}>
              <View style={styles.companyHeader}>
                <Text style={styles.companyName}>{work.companyName}</Text>
                <Text style={styles.period}>
                  {work.startYear}年{work.startMonth}月〜
                  {work.isCurrent ? '現在' : `${work.endYear}年${work.endMonth}月`}
                </Text>
              </View>

              {work.position && (
                <Text style={styles.positionBadge}>{work.position}</Text>
              )}

              {work.description && (
                <Text style={styles.workDescription}>{work.description}</Text>
              )}
            </View>
          ))}

          {data.stage2.workHistory.length === 0 && (
            <Text style={{ color: '#999', fontSize: 9 }}>職歴情報なし</Text>
          )}
        </View>

        {/* 資格・免許 */}
        {data.stage2.qualifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>資格・免許</Text>
            <View style={styles.qualificationList}>
              {data.stage2.qualifications.map((qual, idx) => (
                <Text key={idx} style={styles.qualificationItem}>
                  {qual.name}
                  {qual.year && ` (${qual.year}年取得)`}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* 自己PR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>自己PR</Text>
          <View style={styles.selfPRBox}>
            <Text style={styles.summaryText}>{data.stage1.selfPR}</Text>
          </View>
        </View>

        <Text style={styles.footer}>CareerBridge で作成</Text>
      </Page>
    </Document>
  )
}

interface ShokumukeirekishoPdfProps {
  basicInfo: { name: string; age: string; prefecture: string }
  stage1Data: Stage1Data
  stage2Data: Stage2Data
  onDownloadComplete?: () => void
}

export function ShokumukeirekishoPdf({
  basicInfo,
  stage1Data,
  stage2Data,
  onDownloadComplete,
}: ShokumukeirekishoPdfProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    registerFonts()
  }, [])

  const handleDownload = useCallback(async () => {
    setIsGenerating(true)
    setError(null)

    try {
      registerFonts()

      const data: ShokumukeirekishoData = {
        basicInfo,
        stage1: stage1Data,
        stage2: stage2Data,
      }

      const blob = await pdf(<ShokumukeirekishoDocument data={data} />).toBlob()
      const fileName = `職務経歴書_${basicInfo.name}_${new Date().toISOString().split('T')[0]}.pdf`

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const url = URL.createObjectURL(blob)

      if (isIOS) {
        window.open(url, '_blank')
      } else {
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }, 1000)
      }

      onDownloadComplete?.()
    } catch (err) {
      console.error('PDF generation error:', err)
      setError('PDFの生成に失敗しました。')
    } finally {
      setIsGenerating(false)
    }
  }, [basicInfo, stage1Data, stage2Data, onDownloadComplete])

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-midnight-700 border-2 border-brand-cyan text-brand-cyan font-semibold rounded-xl hover:bg-brand-cyan/5 transition-all disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            PDF生成中...
          </>
        ) : (
          <>
            <Briefcase className="w-5 h-5" />
            職務経歴書PDF
          </>
        )}
      </button>
    </div>
  )
}
