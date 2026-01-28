'use client'

import Link from 'next/link'
import { FileText, Mic, Download, MessageCircle, ArrowRight, Sparkles, Clock, Shield, ChevronRight } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const FEATURES = [
  {
    icon: Mic,
    title: '音声で簡単入力',
    description: '話すだけで職歴を自動で文字起こし。タイピングが苦手でも大丈夫。',
  },
  {
    icon: Sparkles,
    title: 'AIが履歴書を作成',
    description: '話した内容からAIが履歴書を自動生成。何を書けばいいか悩む必要なし。',
  },
  {
    icon: Download,
    title: 'ワンクリックPDF出力',
    description: 'きれいにフォーマットされた履歴書をPDFでダウンロード。',
  },
  {
    icon: MessageCircle,
    title: '専任担当がサポート',
    description: 'LINEで専任の担当者があなたの転職をサポートします。',
  },
]

const STEPS = [
  { number: 1, title: '基本情報を入力', description: '名前・連絡先・都道府県を入力' },
  { number: 2, title: '音声で経歴を話す', description: '職歴や経験を音声で録音' },
  { number: 3, title: 'AIが履歴書を作成', description: '自動で履歴書フォーマットに整形' },
  { number: 4, title: 'PDFダウンロード', description: '確認・編集してPDF出力' },
]

export default function TaishokuSupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-midnight-900 dark:via-midnight-800 dark:to-midnight-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-midnight-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-midnight-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-cyan">CareerBridge</span>
            <span className="text-xs px-2 py-1 bg-brand-cyan/10 text-brand-cyan rounded-full font-medium">
              退職サポート
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-cyan/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-bright/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 dark:bg-brand-cyan/20 text-brand-cyan rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI履歴書作成機能
            </div>

            {/* Main heading */}
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              退職後の転職活動を
              <br />
              <span className="text-brand-cyan">AIが徹底サポート</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              「履歴書を書くのが苦手...」そんなあなたも大丈夫。
              <br className="hidden md:block" />
              音声で話すだけでAIが履歴書を自動作成します。
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/taishoku-support/resume"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-brand-cyan/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <FileText className="w-5 h-5" />
                履歴書を作成する
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-brand-cyan" />
                最短5分
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-brand-cyan" />
                完全無料
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4 text-brand-cyan" />
                LINEサポート付き
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-midnight-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              CareerBridgeの特徴
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              退職後の転職活動をスムーズに始められる機能が揃っています
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-slate-50 dark:bg-midnight-700/50 rounded-2xl border border-slate-200 dark:border-midnight-600 hover:border-brand-cyan/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-brand-cyan/10 text-brand-cyan rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              かんたん4ステップ
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              音声で話すだけで履歴書が完成します
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 md:gap-8">
            {STEPS.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-brand-cyan to-brand-cyan/30" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-brand-cyan to-brand-cyan-dark text-white text-2xl font-bold rounded-2xl shadow-lg shadow-brand-cyan/25 mb-4 relative z-10">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-brand-cyan/5 to-brand-cyan/10 dark:from-brand-cyan/10 dark:to-brand-cyan/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            今すぐ履歴書を作成しましょう
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            音声で話すだけで、AIがあなたの履歴書を作成します。
            <br className="hidden md:block" />
            専任の担当者がLINEで転職活動をサポートします。
          </p>
          <Link
            href="/taishoku-support/resume"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-brand-cyan/25 transition-all duration-300 hover:-translate-y-0.5"
          >
            <FileText className="w-5 h-5" />
            履歴書を作成する
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 dark:border-midnight-700">
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
