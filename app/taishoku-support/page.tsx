'use client'

import Link from 'next/link'
import { FileText, Mic, Download, MessageCircle, ArrowRight, Sparkles, Clock, Shield, ChevronRight, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const FEATURES = [
  {
    icon: Mic,
    title: '音声で簡単入力',
    description: '話すだけで職歴を自動で文字起こし。タイピングが苦手でも大丈夫。',
    gradient: 'from-emerald-400 to-cyan-500',
    delay: '0ms',
  },
  {
    icon: Sparkles,
    title: 'AIが履歴書を作成',
    description: '話した内容からAIが履歴書を自動生成。何を書けばいいか悩む必要なし。',
    gradient: 'from-brand-cyan to-blue-500',
    delay: '100ms',
  },
  {
    icon: Download,
    title: 'ワンクリックPDF出力',
    description: 'きれいにフォーマットされた履歴書をPDFでダウンロード。',
    gradient: 'from-violet-400 to-purple-500',
    delay: '200ms',
  },
  {
    icon: MessageCircle,
    title: '専任担当がサポート',
    description: 'LINEで専任の担当者があなたの転職をサポートします。',
    gradient: 'from-amber-400 to-orange-500',
    delay: '300ms',
  },
]

const STEPS = [
  { number: 1, title: '基本情報を入力', description: '名前・連絡先・都道府県を入力', icon: FileText },
  { number: 2, title: '音声で経歴を話す', description: '職歴や経験を音声で録音', icon: Mic },
  { number: 3, title: 'AIが履歴書を作成', description: '自動で履歴書フォーマットに整形', icon: Sparkles },
  { number: 4, title: 'PDFダウンロード', description: '確認・編集してPDF出力', icon: Download },
]

export default function TaishokuSupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-brand-cyan/20 to-blue-500/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-gradient-to-br from-emerald-500/10 to-brand-cyan/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/10 to-brand-cyan/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '4s' }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(60,200,232,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(60,200,232,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-midnight-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-midnight-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-xl font-bold bg-gradient-to-r from-brand-cyan to-brand-cyan-dark bg-clip-text text-transparent">
              CareerBridge
            </span>
            <span className="text-xs px-3 py-1.5 bg-gradient-to-r from-brand-cyan/10 to-brand-cyan/5 dark:from-brand-cyan/20 dark:to-brand-cyan/10 text-brand-cyan rounded-full font-medium border border-brand-cyan/20 group-hover:border-brand-cyan/40 transition-colors">
              退職サポート
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            {/* Floating badge with glow */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-midnight-800 rounded-full text-sm font-medium mb-8 shadow-lg shadow-brand-cyan/10 border border-brand-cyan/20 animate-fade-in-up">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-cyan"></span>
              </span>
              <span className="bg-gradient-to-r from-brand-cyan to-blue-500 bg-clip-text text-transparent font-semibold">
                AI履歴書作成機能
              </span>
            </div>

            {/* Main heading with gradient */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              退職後の転職活動を
              <br />
              <span className="relative inline-block mt-2">
                <span className="bg-gradient-to-r from-brand-cyan via-blue-400 to-brand-cyan bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
                  AIが徹底サポート
                </span>
                {/* Decorative underline */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-cyan/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="3" fill="none" className="animate-pulse-soft" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              「履歴書を書くのが苦手...」そんなあなたも大丈夫。
              <br className="hidden md:block" />
              <span className="text-brand-cyan font-medium">音声で話すだけ</span>でAIが履歴書を自動作成します。
            </p>

            {/* CTA Buttons with enhanced styling */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              {/* Primary CTA */}
              <Link
                href="/taishoku-support/resume"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 overflow-hidden rounded-2xl font-semibold text-white transition-all duration-300 hover:-translate-y-1"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan via-blue-500 to-brand-cyan bg-[length:200%_auto] animate-gradient-x" />
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slow" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_40px_rgba(60,200,232,0.5)]" />

                <span className="relative flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  履歴書を作成する
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Secondary CTA */}
              <Link
                href="/taishoku-support/resignation"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-midnight-800 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl border-2 border-slate-200 dark:border-midnight-600 hover:border-brand-cyan dark:hover:border-brand-cyan transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-cyan/10"
              >
                <FileText className="w-5 h-5 group-hover:text-brand-cyan transition-colors" />
                退職届を作成する
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-hover:text-brand-cyan transition-all" />
              </Link>
            </div>

            {/* Trust badges with glass effect */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              {[
                { icon: Zap, text: '最短5分', color: 'text-amber-500' },
                { icon: Shield, text: '完全無料', color: 'text-emerald-500' },
                { icon: MessageCircle, text: 'LINEサポート付き', color: 'text-brand-cyan' },
              ].map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-midnight-800/80 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-midnight-600/50 text-sm"
                >
                  <badge.icon className={`w-4 h-4 ${badge.color}`} />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-28">
        {/* Section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-cyan/[0.02] to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 rounded-full text-brand-cyan text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              CareerBridgeの特徴
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              退職後の転職活動をスムーズに始められる機能が揃っています
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 bg-white dark:bg-midnight-800/50 rounded-3xl border border-slate-200/50 dark:border-midnight-600/50 hover:border-brand-cyan/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-cyan/10 animate-fade-in-up"
                style={{ animationDelay: feature.delay }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon with gradient background */}
                <div className={`relative w-14 h-14 flex items-center justify-center bg-gradient-to-br ${feature.gradient} rounded-2xl mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="relative text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="relative text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 rounded-full text-brand-cyan text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              How it works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              かんたん4ステップ
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              音声で話すだけで履歴書が完成します
            </p>
          </div>

          {/* Steps with connecting line */}
          <div className="relative">
            {/* Connecting line - desktop */}
            <div className="hidden lg:block absolute top-14 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-1">
              <div className="h-full bg-gradient-to-r from-brand-cyan/20 via-brand-cyan/40 to-brand-cyan/20 rounded-full" />
              {/* Animated flowing dots */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-brand-cyan to-transparent animate-shimmer-slow" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {STEPS.map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Step number with icon */}
                  <div className="relative mb-6">
                    {/* Outer ring with pulse */}
                    <div className="absolute inset-0 rounded-full bg-brand-cyan/20 animate-scale-pulse" style={{ animationDelay: `${index * 500}ms` }} />

                    {/* Main circle */}
                    <div className="relative w-28 h-28 flex flex-col items-center justify-center bg-gradient-to-br from-brand-cyan to-brand-cyan-dark rounded-full shadow-xl shadow-brand-cyan/25">
                      {/* Number */}
                      <span className="text-3xl font-bold text-white mb-1">{step.number}</span>
                      {/* Icon */}
                      <step.icon className="w-5 h-5 text-white/80" />
                    </div>
                  </div>

                  {/* Mobile connector */}
                  {index < STEPS.length - 1 && (
                    <div className="lg:hidden absolute left-1/2 top-28 w-0.5 h-8 bg-gradient-to-b from-brand-cyan/40 to-transparent" />
                  )}

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 whitespace-nowrap">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-[200px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28">
        {/* Background with mesh gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/5 via-transparent to-blue-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(60,200,232,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 border border-brand-cyan/20 rounded-full animate-float-gentle" />
          <div className="absolute bottom-10 right-10 w-16 h-16 border border-brand-cyan/20 rounded-2xl rotate-12 animate-float-gentle" style={{ animationDelay: '1s' }} />

          <div className="relative bg-white/50 dark:bg-midnight-800/50 backdrop-blur-xl rounded-[2rem] p-10 md:p-14 border border-slate-200/50 dark:border-midnight-600/50 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              今すぐ履歴書を作成しましょう
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              音声で話すだけで、AIがあなたの履歴書を作成します。
              <br className="hidden md:block" />
              専任の担当者がLINEで転職活動をサポートします。
            </p>

            <Link
              href="/taishoku-support/resume"
              className="group relative inline-flex items-center justify-center gap-2 px-10 py-5 overflow-hidden rounded-2xl font-semibold text-white text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-cyan/30"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan via-blue-500 to-brand-cyan bg-[length:200%_auto] animate-gradient-x" />
              {/* Shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer-slow" />
              </div>

              <span className="relative flex items-center gap-2">
                <FileText className="w-5 h-5" />
                履歴書を作成する
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 border-t border-slate-200/50 dark:border-midnight-700/50 bg-white/30 dark:bg-midnight-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-lg font-bold bg-gradient-to-r from-brand-cyan to-brand-cyan-dark bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                CareerBridge
              </Link>
              <span className="text-xs text-slate-500 dark:text-slate-400 px-3 py-1 bg-slate-100 dark:bg-midnight-800 rounded-full">
                運営: 株式会社エヌアンドエス
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-brand-cyan transition-colors">
                利用規約
              </Link>
              <Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-brand-cyan transition-colors">
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
