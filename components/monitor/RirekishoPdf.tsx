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
  Image,
} from '@react-pdf/renderer'
import { Download, Loader2, FileText } from 'lucide-react'
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

// 履歴書スタイル（JIS規格風）
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Noto Sans JP',
    fontSize: 9,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 8,
  },
  dateRow: {
    textAlign: 'right',
    fontSize: 8,
    marginBottom: 10,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #333',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #333',
  },
  rowNoBorder: {
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    padding: 6,
    borderRight: '1px solid #333',
  },
  cellNoBorder: {
    padding: 6,
  },
  headerCell: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    fontSize: 8,
  },
  nameRow: {
    flexDirection: 'row',
    minHeight: 50,
  },
  photoCell: {
    width: 90,
    height: 120,
    borderRight: '1px solid #333',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  photoPlaceholder: {
    fontSize: 7,
    color: '#999',
    textAlign: 'center',
  },
  nameSection: {
    flex: 1,
    flexDirection: 'column',
  },
  furiganaRow: {
    borderBottom: '1px solid #333',
    padding: 4,
    flexDirection: 'row',
  },
  furiganaLabel: {
    width: 40,
    fontSize: 7,
    color: '#666',
  },
  nameValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    padding: 4,
    borderBottom: '1px solid #333',
    borderRight: '1px solid #333',
    flexDirection: 'row',
  },
  infoLabel: {
    fontSize: 7,
    color: '#666',
    width: 50,
  },
  infoValue: {
    fontSize: 9,
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    padding: 4,
    fontWeight: 'bold',
    fontSize: 10,
    borderBottom: '1px solid #333',
    textAlign: 'center',
  },
  historyTable: {
    marginTop: 10,
  },
  historyRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #333',
    minHeight: 24,
  },
  yearCell: {
    width: 50,
    borderRight: '1px solid #333',
    padding: 4,
    textAlign: 'center',
  },
  monthCell: {
    width: 30,
    borderRight: '1px solid #333',
    padding: 4,
    textAlign: 'center',
  },
  historyContent: {
    flex: 1,
    padding: 4,
  },
  largeTextBox: {
    minHeight: 80,
    padding: 8,
    borderBottom: '1px solid #333',
  },
  smallText: {
    fontSize: 8,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 7,
    color: '#999',
  },
})

interface RirekishoData {
  basicInfo: { name: string; age: string; prefecture: string }
  stage1: Stage1Data
  stage2: Stage2Data
  headshotUrl?: string | null
}

function RirekishoDocument({ data }: { data: RirekishoData }) {
  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日現在`

  // 年齢から生年月日を推定
  const age = parseInt(data.basicInfo.age, 10)
  const birthYear = today.getFullYear() - age

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* タイトル */}
        <Text style={styles.title}>履 歴 書</Text>
        <Text style={styles.dateRow}>{dateStr}</Text>

        {/* メインテーブル */}
        <View style={styles.table}>
          {/* 氏名・写真行 */}
          <View style={styles.nameRow}>
            {/* 写真 */}
            <View style={styles.photoCell}>
              {data.headshotUrl ? (
                <Image src={data.headshotUrl} style={styles.photo} />
              ) : (
                <Text style={styles.photoPlaceholder}>写真貼付欄{'\n'}(3cm×4cm)</Text>
              )}
            </View>

            {/* 氏名セクション */}
            <View style={styles.nameSection}>
              <View style={styles.furiganaRow}>
                <Text style={styles.furiganaLabel}>ふりがな</Text>
                <Text style={{ flex: 1, fontSize: 8 }}></Text>
              </View>
              <Text style={styles.nameValue}>{data.basicInfo.name}</Text>
            </View>
          </View>

          {/* 基本情報 */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>生年月日</Text>
              <Text style={styles.infoValue}>{birthYear}年生（{data.basicInfo.age}歳）</Text>
            </View>
            <View style={[styles.infoItem, { borderRight: 0 }]}>
              <Text style={styles.infoLabel}>性別</Text>
              <Text style={styles.infoValue}></Text>
            </View>
            <View style={[styles.infoItem, { width: '100%', borderRight: 0 }]}>
              <Text style={styles.infoLabel}>現住所</Text>
              <Text style={styles.infoValue}>{data.basicInfo.prefecture}</Text>
            </View>
          </View>
        </View>

        {/* 学歴・職歴 */}
        <View style={styles.historyTable}>
          <View style={styles.table}>
            <View style={styles.sectionHeader}>
              <Text>学 歴 ・ 職 歴</Text>
            </View>

            {/* 学歴ヘッダー */}
            <View style={styles.historyRow}>
              <View style={styles.yearCell}><Text>年</Text></View>
              <View style={styles.monthCell}><Text>月</Text></View>
              <View style={styles.historyContent}>
                <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>学　歴</Text>
              </View>
            </View>

            {/* 学歴 */}
            {data.stage2.education.map((edu, idx) => (
              <View key={`edu-${idx}`} style={styles.historyRow}>
                <View style={styles.yearCell}><Text>{edu.graduationYear}</Text></View>
                <View style={styles.monthCell}><Text>{edu.graduationMonth}</Text></View>
                <View style={styles.historyContent}>
                  <Text>{edu.schoolName}{edu.department ? ` ${edu.department}` : ''} {edu.status}</Text>
                </View>
              </View>
            ))}

            {/* 職歴ヘッダー */}
            <View style={styles.historyRow}>
              <View style={styles.yearCell}><Text></Text></View>
              <View style={styles.monthCell}><Text></Text></View>
              <View style={styles.historyContent}>
                <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>職　歴</Text>
              </View>
            </View>

            {/* 職歴 */}
            {data.stage2.workHistory.map((work, idx) => (
              <View key={`work-${idx}`}>
                <View style={styles.historyRow}>
                  <View style={styles.yearCell}><Text>{work.startYear}</Text></View>
                  <View style={styles.monthCell}><Text>{work.startMonth}</Text></View>
                  <View style={styles.historyContent}>
                    <Text>{work.companyName} 入社{work.position ? `（${work.position}）` : ''}</Text>
                  </View>
                </View>
                {!work.isCurrent && work.endYear && (
                  <View style={styles.historyRow}>
                    <View style={styles.yearCell}><Text>{work.endYear}</Text></View>
                    <View style={styles.monthCell}><Text>{work.endMonth}</Text></View>
                    <View style={styles.historyContent}>
                      <Text>{work.companyName} 退社</Text>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* 以上 */}
            <View style={styles.historyRow}>
              <View style={styles.yearCell}><Text></Text></View>
              <View style={styles.monthCell}><Text></Text></View>
              <View style={styles.historyContent}>
                <Text style={{ textAlign: 'right' }}>以上</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 資格 */}
        {data.stage2.qualifications.length > 0 && (
          <View style={[styles.historyTable, { marginTop: 10 }]}>
            <View style={styles.table}>
              <View style={styles.sectionHeader}>
                <Text>免許・資格</Text>
              </View>
              {data.stage2.qualifications.map((qual, idx) => (
                <View key={`qual-${idx}`} style={styles.historyRow}>
                  <View style={styles.yearCell}><Text>{qual.year || ''}</Text></View>
                  <View style={styles.monthCell}><Text>{qual.month || ''}</Text></View>
                  <View style={styles.historyContent}>
                    <Text>{qual.name}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 志望の動機 */}
        <View style={[styles.historyTable, { marginTop: 10 }]}>
          <View style={styles.table}>
            <View style={styles.sectionHeader}>
              <Text>志望の動機</Text>
            </View>
            <View style={styles.largeTextBox}>
              <Text style={styles.smallText}>{data.stage1.motivation}</Text>
            </View>
          </View>
        </View>

        {/* 本人希望記入欄 */}
        <View style={[styles.historyTable, { marginTop: 10 }]}>
          <View style={styles.table}>
            <View style={styles.sectionHeader}>
              <Text>本人希望記入欄</Text>
            </View>
            <View style={styles.largeTextBox}>
              <Text style={styles.smallText}>{data.stage1.preferences}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>CareerBridge で作成</Text>
      </Page>
    </Document>
  )
}

interface RirekishoPdfProps {
  basicInfo: { name: string; age: string; prefecture: string }
  stage1Data: Stage1Data
  stage2Data: Stage2Data
  headshotUrl?: string | null
  onDownloadComplete?: () => void
}

export function RirekishoPdf({
  basicInfo,
  stage1Data,
  stage2Data,
  headshotUrl,
  onDownloadComplete,
}: RirekishoPdfProps) {
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

      const data: RirekishoData = {
        basicInfo,
        stage1: stage1Data,
        stage2: stage2Data,
        headshotUrl,
      }

      const blob = await pdf(<RirekishoDocument data={data} />).toBlob()
      const fileName = `履歴書_${basicInfo.name}_${new Date().toISOString().split('T')[0]}.pdf`

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
  }, [basicInfo, stage1Data, stage2Data, headshotUrl, onDownloadComplete])

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
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            PDF生成中...
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            履歴書PDF
          </>
        )}
      </button>
    </div>
  )
}
