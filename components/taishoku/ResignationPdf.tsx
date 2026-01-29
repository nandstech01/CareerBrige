'use client'

import { useState, useCallback } from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font
} from '@react-pdf/renderer'
import { Download, Loader2, FileText } from 'lucide-react'
import type { ResignationData } from './ResignationForm'

// フォント登録（Google Fonts の Noto Sans JP）
Font.register({
  family: 'Noto Sans JP',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v56/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/notosansjp/v56/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf',
      fontWeight: 700,
    },
  ],
})

// 日付をフォーマット（2026-01-29 → 2026年1月29日）
function formatDateJapanese(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

// PDFスタイル定義
const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: 'Noto Sans JP',
    fontSize: 12,
    backgroundColor: '#ffffff',
  },
  // タイトル「退職届」
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 8,
  },
  // 提出日（右寄せ）
  dateSection: {
    textAlign: 'right',
    marginBottom: 30,
  },
  dateText: {
    fontSize: 12,
  },
  // 宛名セクション（左寄せ）
  addressSection: {
    marginBottom: 30,
  },
  companyName: {
    fontSize: 12,
    marginBottom: 4,
  },
  representativeName: {
    fontSize: 12,
  },
  // 差出人セクション（右寄せ）
  senderSection: {
    textAlign: 'right',
    marginBottom: 30,
  },
  senderDepartment: {
    fontSize: 12,
    marginBottom: 4,
  },
  senderNameContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  senderName: {
    fontSize: 12,
  },
  sealPlaceholder: {
    fontSize: 10,
    marginLeft: 8,
    color: '#666666',
  },
  // 本文セクション
  bodySection: {
    marginTop: 20,
  },
  // 「私儀」（右寄せ）
  shigiText: {
    textAlign: 'right',
    fontSize: 12,
    marginBottom: 20,
  },
  // 本文
  bodyText: {
    fontSize: 12,
    lineHeight: 2,
    textAlign: 'left',
  },
  // 「以上」（右寄せ）
  ijouText: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 30,
  },
})

// PDF Document コンポーネント
function ResignationDocument({ data }: { data: ResignationData }) {
  const submissionDateFormatted = formatDateJapanese(data.submissionDate)
  const resignationDateFormatted = formatDateJapanese(data.resignationDate)

  // 部署・課の表示
  const departmentDisplay = data.section
    ? `${data.department} ${data.section}`
    : data.department

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* タイトル */}
        <Text style={styles.title}>退職届</Text>

        {/* 提出日（右寄せ） */}
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>{submissionDateFormatted}</Text>
        </View>

        {/* 宛名（左寄せ） */}
        <View style={styles.addressSection}>
          <Text style={styles.companyName}>{data.companyName}</Text>
          <Text style={styles.representativeName}>代表取締役 {data.representativeName}殿</Text>
        </View>

        {/* 差出人（右寄せ） */}
        <View style={styles.senderSection}>
          <Text style={styles.senderDepartment}>{departmentDisplay}</Text>
          <View style={styles.senderNameContainer}>
            <Text style={styles.senderName}>{data.employeeName}</Text>
            <Text style={styles.sealPlaceholder}>[印]</Text>
          </View>
        </View>

        {/* 本文 */}
        <View style={styles.bodySection}>
          {/* 私儀（右寄せ） */}
          <Text style={styles.shigiText}>私儀</Text>

          {/* 本文 */}
          <Text style={styles.bodyText}>
            このたび一身上の都合により、{resignationDateFormatted}をもって退職いたします。
          </Text>

          {/* 以上（右寄せ） */}
          <Text style={styles.ijouText}>以上</Text>
        </View>
      </Page>
    </Document>
  )
}

interface ResignationPdfProps {
  data: ResignationData
  onDownloadComplete?: () => void
}

export function ResignationPdf({ data, onDownloadComplete }: ResignationPdfProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = useCallback(async () => {
    setIsGenerating(true)
    try {
      // PDFを生成
      const pdfBlob = await pdf(<ResignationDocument data={data} />).toBlob()

      // BlobをBase64に変換してダウンロード
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result as string

        // ダウンロードリンクを作成
        const link = document.createElement('a')
        link.href = base64data
        link.download = `taishokutodoke_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setIsGenerating(false)
        onDownloadComplete?.()
      }
      reader.onerror = () => {
        console.error('FileReader error')
        alert('PDFの生成に失敗しました。もう一度お試しください。')
        setIsGenerating(false)
      }
      reader.readAsDataURL(pdfBlob)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('PDFの生成に失敗しました。もう一度お試しください。')
      setIsGenerating(false)
    }
  }, [data, onDownloadComplete])

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-xl p-6 border border-slate-200 dark:border-midnight-600">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 flex items-center justify-center bg-brand-cyan/10 text-brand-cyan rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              退職届PDFをダウンロード
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A4サイズのPDFファイルで保存されます
            </p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="w-full py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-brand-cyan/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              PDF生成中...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              PDFをダウンロード
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
        ※印鑑は[印]と表示されています。印刷後に実際の印鑑を押印してください。
      </p>
    </div>
  )
}

export { ResignationDocument }
