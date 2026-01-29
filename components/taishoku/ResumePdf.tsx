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
import { Download, Loader2, FileText } from 'lucide-react'
import type { ResumeData } from '@/lib/gemini'

// フォント登録フラグ
let fontRegistered = false

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

// PDFスタイル定義
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Noto Sans JP',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3CC8E8',
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e293b',
  },
  contactInfo: {
    flexDirection: 'row',
    gap: 20,
    fontSize: 10,
    color: '#64748b',
  },
  contactItem: {
    marginRight: 15,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3CC8E8',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 5,
  },
  workItem: {
    marginBottom: 12,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  period: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  description: {
    fontSize: 10,
    color: '#475569',
    marginTop: 5,
    lineHeight: 1.5,
  },
  educationItem: {
    marginBottom: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
  },
  schoolName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  major: {
    fontSize: 9,
    color: '#64748b',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#f0fdfa',
    color: '#0d9488',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 9,
    marginRight: 6,
    marginBottom: 6,
  },
  skillTag: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 9,
    marginRight: 6,
    marginBottom: 6,
  },
  selfPR: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 6,
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.6,
  },
  noData: {
    fontSize: 10,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
  },
})

// PDF Document コンポーネント
function ResumeDocument({ resume }: { resume: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {resume.personalInfo.name || '氏名未入力'}
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>
              TEL: {resume.personalInfo.phone || '未入力'}
            </Text>
            <Text style={styles.contactItem}>
              年齢: {resume.personalInfo.age ? `${resume.personalInfo.age}歳` : '未入力'}
            </Text>
            <Text style={styles.contactItem}>
              住所: {resume.personalInfo.prefecture || '未入力'}
            </Text>
          </View>
        </View>

        {/* 職歴 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>職歴</Text>
          {resume.workHistory && resume.workHistory.length > 0 ? (
            resume.workHistory.map((work, index) => (
              <View key={index} style={styles.workItem}>
                <Text style={styles.companyName}>
                  {work.companyName || '会社名未入力'}
                </Text>
                <Text style={styles.period}>
                  {work.period} {work.position && `/ ${work.position}`}
                </Text>
                {work.description && (
                  <Text style={styles.description}>{work.description}</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noData}>職歴情報なし</Text>
          )}
        </View>

        {/* 学歴 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>学歴</Text>
          {resume.education && resume.education.length > 0 ? (
            resume.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.schoolName}>
                  {edu.schoolName || '学校名未入力'}
                </Text>
                <Text style={styles.major}>
                  {edu.major} {edu.graduationYear && `(${edu.graduationYear}卒業)`}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noData}>学歴情報なし</Text>
          )}
        </View>

        {/* 資格 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>資格</Text>
          {resume.qualifications && resume.qualifications.length > 0 ? (
            <View style={styles.tagContainer}>
              {resume.qualifications.map((qual, index) => (
                <Text key={index} style={styles.tag}>
                  {qual}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.noData}>資格情報なし</Text>
          )}
        </View>

        {/* スキル */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>スキル</Text>
          {resume.skills && resume.skills.length > 0 ? (
            <View style={styles.tagContainer}>
              {resume.skills.map((skill, index) => (
                <Text key={index} style={styles.skillTag}>
                  {skill}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.noData}>スキル情報なし</Text>
          )}
        </View>

        {/* 自己PR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>自己PR</Text>
          {resume.selfPR ? (
            <View style={styles.selfPR}>
              <Text>{resume.selfPR}</Text>
            </View>
          ) : (
            <Text style={styles.noData}>自己PR未入力</Text>
          )}
        </View>

        {/* フッター */}
        <Text style={styles.footer}>CareerBridge で作成</Text>
      </Page>
    </Document>
  )
}

interface ResumePdfProps {
  resume: ResumeData
  onDownloadComplete?: () => void
}

export function ResumePdf({ resume, onDownloadComplete }: ResumePdfProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // コンポーネントマウント時にフォントを登録
  useEffect(() => {
    registerFonts()
  }, [])

  const handleDownload = useCallback(async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // フォント登録を確認
      registerFonts()

      // PDFを生成
      const blob = await pdf(<ResumeDocument resume={resume} />).toBlob()

      // Blobから直接ダウンロード
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `履歴書_${resume.personalInfo.name || 'unnamed'}_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // URLを解放
      setTimeout(() => URL.revokeObjectURL(url), 100)

      onDownloadComplete?.()
    } catch (err) {
      console.error('PDF generation error:', err)
      setError('PDFの生成に失敗しました。ページを再読み込みしてもう一度お試しください。')
    } finally {
      setIsGenerating(false)
    }
  }, [resume, onDownloadComplete])

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-xl p-6 border border-slate-200 dark:border-midnight-600">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 flex items-center justify-center bg-brand-cyan/10 text-brand-cyan rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              履歴書PDFをダウンロード
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A4サイズのPDFファイルで保存されます
            </p>
          </div>
        </div>

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
    </div>
  )
}

export { ResumeDocument }
