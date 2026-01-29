'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  FileText,
  Eye,
  Download,
  Building2,
  User,
  Calendar,
  MessageCircle
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ResignationForm, type ResignationData } from '@/components/taishoku/ResignationForm'
import { ResignationPdf } from '@/components/taishoku/ResignationPdf'

// ステップ定義
const STEPS = [
  { id: 1, title: '情報入力', icon: FileText },
  { id: 2, title: 'プレビュー', icon: Eye },
  { id: 3, title: 'ダウンロード', icon: Download },
]

// 今日の日付をYYYY-MM-DD形式で取得
function getTodayString(): string {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// 1ヶ月後の日付をYYYY-MM-DD形式で取得
function getOneMonthLaterString(): string {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  return date.toISOString().split('T')[0]
}

// 日付をフォーマット（2026-01-29 → 2026年1月29日）
function formatDateJapanese(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

export default function ResignationPage() {
  const [currentStep, setCurrentStep] = useState(1)

  // フォームデータ
  const [formData, setFormData] = useState<ResignationData>({
    submissionDate: getTodayString(),
    companyName: '',
    representativeName: '',
    department: '',
    section: '',
    employeeName: '',
    resignationDate: getOneMonthLaterString(),
  })

  // Step 1: フォーム入力完了
  const handleFormNext = useCallback(() => {
    setCurrentStep(2)
  }, [])


  // 前のステップに戻る
  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  // 部署・課の表示
  const departmentDisplay = formData.section
    ? `${formData.department} ${formData.section}`
    : formData.department

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-midnight-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-midnight-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/taishoku-support" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-cyan">CareerBridge</span>
            <span className="text-xs px-2 py-1 bg-brand-cyan/10 text-brand-cyan rounded-full font-medium">
              退職届作成
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-brand-cyan text-white shadow-lg shadow-brand-cyan/25'
                        : 'bg-slate-200 dark:bg-midnight-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium whitespace-nowrap ${
                      currentStep >= step.id
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-full h-0.5 mx-2 ${
                      currentStep > step.id
                        ? 'bg-green-500'
                        : 'bg-slate-200 dark:bg-midnight-700'
                    }`}
                    style={{ minWidth: '40px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {currentStep === 2 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-brand-cyan transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </button>
        )}

        {/* Step Content */}
        <div className="bg-white dark:bg-midnight-800 rounded-2xl shadow-lg border border-slate-200 dark:border-midnight-600 p-6 md:p-8">
          {/* Step 1: 情報入力 */}
          {currentStep === 1 && (
            <ResignationForm
              data={formData}
              onChange={setFormData}
              onNext={handleFormNext}
            />
          )}

          {/* Step 2: プレビュー確認 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* ヘッダー */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  内容を確認してください
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  以下の内容で退職届を作成します
                </p>
              </div>

              {/* プレビュー */}
              <div className="bg-slate-50 dark:bg-midnight-700/50 rounded-xl p-6 border border-slate-200 dark:border-midnight-600">
                {/* 退職届プレビュー */}
                <div className="bg-white dark:bg-midnight-800 rounded-lg p-6 border border-slate-200 dark:border-midnight-600 shadow-sm">
                  {/* タイトル */}
                  <h3 className="text-xl font-bold text-center mb-8 tracking-widest text-slate-900 dark:text-white">
                    退職届
                  </h3>

                  {/* 提出日 */}
                  <p className="text-right text-sm text-slate-700 dark:text-slate-300 mb-6">
                    {formatDateJapanese(formData.submissionDate)}
                  </p>

                  {/* 宛名 */}
                  <div className="mb-6">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {formData.companyName}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      代表取締役 {formData.representativeName}殿
                    </p>
                  </div>

                  {/* 差出人 */}
                  <div className="text-right mb-6">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {departmentDisplay}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {formData.employeeName} <span className="text-slate-400 dark:text-slate-500">[印]</span>
                    </p>
                  </div>

                  {/* 私儀 */}
                  <p className="text-right text-sm text-slate-700 dark:text-slate-300 mb-4">
                    私儀
                  </p>

                  {/* 本文 */}
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    このたび一身上の都合により、{formatDateJapanese(formData.resignationDate)}をもって退職いたします。
                  </p>

                  {/* 以上 */}
                  <p className="text-right text-sm text-slate-700 dark:text-slate-300">
                    以上
                  </p>
                </div>
              </div>

              {/* 入力内容サマリー */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  入力内容
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <span className="text-slate-500 dark:text-slate-400">提出日:</span>
                    <span className="text-slate-900 dark:text-white">{formatDateJapanese(formData.submissionDate)}</span>
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <span className="text-slate-500 dark:text-slate-400">退職日:</span>
                    <span className="text-slate-900 dark:text-white">{formatDateJapanese(formData.resignationDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 dark:text-slate-400 shrink-0">会社:</span>
                    <span className="text-slate-900 dark:text-white truncate">{formData.companyName}</span>
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <span className="text-slate-500 dark:text-slate-400">氏名:</span>
                    <span className="text-slate-900 dark:text-white">{formData.employeeName}</span>
                  </div>
                </div>
              </div>

              {/* ボタン */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 border border-slate-300 dark:border-midnight-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-midnight-700 transition-all"
                >
                  戻って修正
                </button>
              </div>

              {/* PDFダウンロード - ダウンロード成功でStep 3へ */}
              <ResignationPdf
                data={formData}
                onDownloadComplete={() => setCurrentStep(3)}
              />
            </div>
          )}

          {/* Step 3: ダウンロード完了 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* ダウンロード完了 */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  ダウンロードが完了しました
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  退職届のPDFファイルがダウンロードされました
                </p>
              </div>

              {/* 注意事項 */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                  ご注意ください
                </h4>
                <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                  <li>• 印刷後、[印]の箇所に実際の印鑑を押印してください</li>
                  <li>• 退職届は直属の上司に手渡しで提出するのが一般的です</li>
                  <li>• コピーを取って控えを残しておくことをお勧めします</li>
                </ul>
              </div>

              {/* 再ダウンロード */}
              <ResignationPdf
                data={formData}
                onDownloadComplete={() => {}}
              />

              {/* 次のステップ: 転職動線 */}
              <div className="pt-6 space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    退職が決まったら、次は転職準備！
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    専門スタッフがあなたの転職をサポートします
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* キャリア相談ボタン */}
                  <Link
                    href="/apply"
                    className="flex flex-col items-center gap-3 p-6 bg-[#06C755]/10 dark:bg-[#06C755]/20 border border-[#06C755]/30 rounded-xl hover:bg-[#06C755]/20 dark:hover:bg-[#06C755]/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-[#06C755] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-base font-semibold text-slate-900 dark:text-white">
                      キャリア相談
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      専門家に相談する
                    </span>
                  </Link>

                  {/* 履歴書作成ボタン */}
                  <Link
                    href="/taishoku-support/resume"
                    className="flex flex-col items-center gap-3 p-6 bg-brand-cyan/10 dark:bg-brand-cyan/20 border border-brand-cyan/30 rounded-xl hover:bg-brand-cyan/20 dark:hover:bg-brand-cyan/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-brand-cyan rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-base font-semibold text-slate-900 dark:text-white">
                      履歴書を作成
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      AIが自動で作成
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ヒントカード */}
        {currentStep === 1 && (
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
              退職届の書き方ヒント
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• 退職届は「退職の意思を確定的に伝える」書類です</li>
              <li>• 提出後の撤回は原則としてできません</li>
              <li>• 退職希望日は就業規則を確認し、適切な期間を設けましょう</li>
            </ul>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-midnight-700 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-brand-cyan font-semibold">
                CareerBridge
              </Link>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                運営: 株式会社エヌアンドエス
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/terms" className="hover:text-brand-cyan transition-colors">
                利用規約
              </Link>
              <Link href="/privacy" className="hover:text-brand-cyan transition-colors">
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
