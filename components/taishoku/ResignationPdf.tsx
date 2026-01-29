'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font
} from '@react-pdf/renderer'
import { Download, Loader2, FileText, Share } from 'lucide-react'
import type { ResignationData } from './ResignationForm'

// フォント登録フラグ
let fontRegistered = false

// Blob を Base64 データURLに変換
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert blob to base64'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// iOS/Safari 検出
function detectBrowser() {
  if (typeof navigator === 'undefined') {
    return { isIOS: false, isSafari: false }
  }

  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) // iPad OS 13+
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua)

  return { isIOS, isSafari }
}

// フォントを動的に登録する関数
function registerFonts() {
  if (fontRegistered) return

  // ブラウザ環境では window.location.origin を使用
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : ''

  Font.register({
    family: 'Noto Sans JP',
    fonts: [
      {
        src: `${baseUrl}/fonts/NotoSansJP-Regular.ttf`,
        fontWeight: 400,
      },
      {
        src: `${baseUrl}/fonts/NotoSansJP-Bold.ttf`,
        fontWeight: 700,
      },
    ],
  })

  fontRegistered = true
}

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 8,
  },
  dateSection: {
    textAlign: 'right',
    marginBottom: 30,
  },
  dateText: {
    fontSize: 12,
  },
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
  bodySection: {
    marginTop: 20,
  },
  shigiText: {
    textAlign: 'right',
    fontSize: 12,
    marginBottom: 20,
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 2,
    textAlign: 'left',
  },
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

  const departmentDisplay = data.section
    ? `${data.department} ${data.section}`
    : data.department

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>退職届</Text>

        <View style={styles.dateSection}>
          <Text style={styles.dateText}>{submissionDateFormatted}</Text>
        </View>

        <View style={styles.addressSection}>
          <Text style={styles.companyName}>{data.companyName}</Text>
          <Text style={styles.representativeName}>代表取締役 {data.representativeName}殿</Text>
        </View>

        <View style={styles.senderSection}>
          <Text style={styles.senderDepartment}>{departmentDisplay}</Text>
          <View style={styles.senderNameContainer}>
            <Text style={styles.senderName}>{data.employeeName}</Text>
            <Text style={styles.sealPlaceholder}>[印]</Text>
          </View>
        </View>

        <View style={styles.bodySection}>
          <Text style={styles.shigiText}>私儀</Text>
          <Text style={styles.bodyText}>
            このたび一身上の都合により、{resignationDateFormatted}をもって退職いたします。
          </Text>
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
  const [error, setError] = useState<string | null>(null)
  const [iosMessage, setIosMessage] = useState<string | null>(null)

  // コンポーネントマウント時にフォントを登録
  useEffect(() => {
    registerFonts()
  }, [])

  const handleDownload = useCallback(async () => {
    setIsGenerating(true)
    setError(null)
    setIosMessage(null)

    try {
      // フォント登録を確認
      registerFonts()

      // PDFを生成
      const pdfBlob = await pdf(<ResignationDocument data={data} />).toBlob()

      // ファイル名
      const fileName = `退職届_${data.employeeName}_${new Date().toISOString().split('T')[0]}.pdf`

      // ブラウザ検出
      const { isIOS, isSafari } = detectBrowser()

      // iOS または Safari の場合: Base64 データURLを使用
      if (isIOS || isSafari) {
        // Base64 に変換
        const base64Url = await blobToBase64(pdfBlob)

        // Web Share API が使える場合（iOS Safari で推奨）
        if (isIOS && navigator.share && navigator.canShare) {
          try {
            const file = new File([pdfBlob], fileName, { type: 'application/pdf' })
            const shareData = { files: [file] }

            if (navigator.canShare(shareData)) {
              await navigator.share(shareData)
              setIsGenerating(false)
              onDownloadComplete?.()
              return
            }
          } catch {
            // Share API が失敗した場合は別の方法を試す
            console.log('Share API failed, trying alternative method')
          }
        }

        // 新しいウィンドウでBase64 PDFを開く
        const newWindow = window.open()
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>${fileName}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { margin: 0; padding: 0; background: #f5f5f5; }
                .container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  padding: 20px;
                  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                }
                .message {
                  background: #e8f4fd;
                  border: 1px solid #b3d9f7;
                  border-radius: 12px;
                  padding: 16px;
                  margin-bottom: 20px;
                  max-width: 400px;
                  text-align: center;
                }
                .message h3 { margin: 0 0 8px; color: #1976d2; font-size: 16px; }
                .message p { margin: 0; color: #555; font-size: 14px; line-height: 1.5; }
                .pdf-frame {
                  width: 100%;
                  max-width: 800px;
                  height: calc(100vh - 200px);
                  border: none;
                  background: white;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .download-link {
                  display: inline-block;
                  margin-top: 16px;
                  padding: 12px 24px;
                  background: #00bcd4;
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="message">
                  <h3>📄 PDFを保存するには</h3>
                  <p>画面下の <strong>共有ボタン（□↑）</strong>をタップして<br>「"ファイル"に保存」を選択してください</p>
                </div>
                <iframe class="pdf-frame" src="${base64Url}"></iframe>
                <a class="download-link" href="${base64Url}" download="${fileName}">ダウンロードを試す</a>
              </div>
            </body>
            </html>
          `)
          newWindow.document.close()
        }

        setIsGenerating(false)
        setIosMessage('新しいタブでPDFが開きました。共有ボタン（□↑）から「"ファイル"に保存」を選んでください。')
        onDownloadComplete?.()
        return
      }

      // PC (Chrome, Firefox, Edge等) の場合: Blob URLで通常ダウンロード
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()

      // クリーンアップを遅延
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 1000)

      setIsGenerating(false)
      onDownloadComplete?.()
    } catch (err) {
      console.error('PDF generation error:', err)
      setError('PDFの生成に失敗しました。ページを再読み込みしてもう一度お試しください。')
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

        {iosMessage && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Share className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                  保存方法
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {iosMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

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
