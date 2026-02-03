'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import VideoPlayer from '@/components/video/VideoPlayer'
import { useInView } from '@/hooks/useInView'

export default function TaishokuSupportPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const currentTheme = (mounted ? theme : 'light') as 'light' | 'dark'
  const { ref: featuresRef, isInView: featuresInView } = useInView({ threshold: 0.15 })

  return (
    <>
      {/* Font & Icon imports */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            summary::-webkit-details-marker { display: none; }
            .star-filled { font-variation-settings: 'FILL' 1; }
          `,
        }}
      />

      <div
        className="bg-[#f6f7f8] dark:bg-[#101822] text-slate-900 dark:text-slate-50 transition-colors duration-200"
        style={{ fontFamily: "'Manrope', 'Noto Sans JP', sans-serif" }}
      >
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
          {/* Navbar */}
          <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#101822]/90 backdrop-blur-md">
            <div className="flex items-center justify-between px-6 py-4 max-w-[1200px] mx-auto w-full">
              <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
                <Image
                  src="/logo.png"
                  alt="キャリアブリッジ"
                  width={220}
                  height={48}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
              <div className="hidden md:flex gap-3 items-center">
                <ThemeToggle />
                <Link href="/login?redirect=/monitor-program" className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  ログイン
                </Link>
                <Link href="/signup?redirect=/monitor-program" className="px-5 py-2.5 rounded-lg bg-[#3CC8E8] text-white text-sm font-bold shadow-md hover:bg-[#2BB8D8] transition-all hover:shadow-lg">
                  無料トライアル
                </Link>
              </div>
              <div className="md:hidden flex items-center gap-2">
                <ThemeToggle />
                <button
                  className="text-slate-700 dark:text-slate-200"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="メニューを開く"
                >
                  <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101822] px-6 py-4 flex flex-col gap-3">
                <Link
                  href="/login?redirect=/monitor-program"
                  className="block w-full text-center px-5 py-3 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ログイン
                </Link>
                <Link
                  href="/signup?redirect=/monitor-program"
                  className="block w-full text-center px-5 py-3 rounded-lg bg-[#3CC8E8] text-white text-sm font-bold shadow-md hover:bg-[#2BB8D8] transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  無料トライアル
                </Link>
              </div>
            )}
          </header>

          {/* Hero Section */}
          <section className="relative bg-slate-50 dark:bg-[#101822] text-slate-900 dark:text-white overflow-hidden py-8 lg:py-24 transition-colors duration-200">
            {/* Background Decoration */}
            <div
              className="absolute inset-0 z-0 opacity-0 dark:opacity-20"
              data-alt="Abstract blue gradient background pattern representing data flow"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-blue-100/40 dark:from-[#101822] dark:via-[#101822]/90 dark:to-blue-900/40" />

            <div className="relative z-10 max-w-[1200px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-white dark:text-slate-900 text-xs font-bold tracking-wide w-fit mx-auto lg:mx-0 shadow-sm">
                  <span className="material-symbols-outlined text-sm text-amber-400 dark:text-amber-500">workspace_premium</span>
                  人材紹介会社向け｜AI書類作成プラットフォーム
                </div>

                {/* Desktop: single hero-text VideoPlayer with heading + description */}
                <div className="hidden lg:block w-full max-w-2xl mx-auto lg:mx-0 aspect-[1080/600]">
                  <VideoPlayer
                    composition="hero-text"
                    autoPlay
                    loop
                    theme={currentTheme}
                    className="w-full h-full"
                  />
                </div>

                {/* Mobile: heading → diagram → description (split layout) */}
                <div className="lg:hidden flex flex-col gap-4">
                  {/* Heading */}
                  <h1 className="text-[2rem] leading-tight font-black tracking-tight text-slate-900 dark:text-white">
                    書類作成を自動化し
                    <br />
                    紹介効率を最大化
                  </h1>

                  {/* Diagram animation */}
                  <div className="w-full max-w-[320px] mx-auto aspect-square">
                    <VideoPlayer
                      composition="resume-graph"
                      autoPlay
                      loop
                      theme={currentTheme}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    AI × プロのノウハウで、候補者の応募書類を高品質に自動生成。
                    <br />
                    書類作成の工数を削減し、
                    <br />
                    紹介業務に集中できる
                    <br />
                    環境を提供します。
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Link
                    href="/monitor-program/resume"
                    className="flex flex-col items-center justify-center gap-0.5 h-16 px-8 rounded-xl bg-[#F97316] hover:bg-orange-500 text-white font-bold shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all hover:scale-105"
                  >
                    <span className="text-xs font-medium opacity-90">最短1分で導入開始</span>
                    <span className="flex items-center gap-1 text-base">
                      無料トライアルを始める
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </span>
                  </Link>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 dark:text-slate-300 pt-2">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-green-400">lock</span>
                    SSL Secure
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-green-400">
                      verified_user
                    </span>
                    Privacy Protected
                  </div>
                </div>
              </div>

              <div className="hidden lg:block flex-1 w-full max-w-[600px] lg:max-w-none relative">
                {/* Remotion animation - desktop only (mobile version shown inline above) */}
                <div className="w-full aspect-square">
                  <VideoPlayer
                    composition="resume-graph"
                    autoPlay
                    loop
                    theme={currentTheme}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features (3つの強み) */}
          <section
            ref={featuresRef as React.RefObject<HTMLElement>}
            className="relative overflow-hidden py-20 px-6"
          >
            {/* Desktop: Full Remotion Player — horizontal 3-card layout */}
            <div className="hidden md:block max-w-[1200px] mx-auto w-full">
              <div className="w-full aspect-[1200/800]">
                {featuresInView && (
                  <VideoPlayer
                    composition="features-showcase"
                    autoPlay
                    loop
                    theme={currentTheme}
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>

            {/* Mobile: Vertical Remotion Player — stacked card layout */}
            <div className="md:hidden max-w-[500px] mx-auto w-full">
              <div className="w-full aspect-[400/1400]">
                {featuresInView && (
                  <VideoPlayer
                    composition="features-showcase-mobile"
                    autoPlay
                    loop
                    theme={currentTheme}
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>
          </section>

          {/* How It Works (Timeline) */}
          <section className="py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
            <div className="max-w-[1000px] mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  ご利用の流れ
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  最短3ステップで、貴社の書類作成業務が変わります。
                </p>
              </div>

              <div className="relative md:grid md:grid-cols-3 md:gap-8">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-slate-200 dark:bg-slate-700 -z-10" />

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center group mb-12 md:mb-0">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-900 shadow-md flex items-center justify-center text-[#3CC8E8] z-10 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-3xl">app_registration</span>
                  </div>
                  <span className="text-[#3CC8E8] font-bold text-sm tracking-wider uppercase mb-2">
                    Step 1
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    アカウント開設
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm max-w-[240px]">
                    最短1分でワークスペースを作成。すぐにご利用を開始できます。
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center group mb-12 md:mb-0">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-900 shadow-md flex items-center justify-center text-[#3CC8E8] z-10 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-3xl">headset_mic</span>
                  </div>
                  <span className="text-[#3CC8E8] font-bold text-sm tracking-wider uppercase mb-2">
                    Step 2
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    候補者を招待
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm max-w-[240px]">
                    リンクを共有するだけ。候補者がヒアリングに回答し、経歴情報を入力します。
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-900 shadow-md flex items-center justify-center text-[#3CC8E8] z-10 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-3xl">file_download</span>
                  </div>
                  <span className="text-[#3CC8E8] font-bold text-sm tracking-wider uppercase mb-2">
                    Step 3
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    AI生成・管理
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm max-w-[240px]">
                    AIが自動で応募書類を生成。ダッシュボードで一括管理・分析が可能です。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="py-20 px-6 max-w-[1200px] mx-auto w-full">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
              導入企業の声
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Review 1 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-xl star-filled"
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-6">
                    「書類作成にかかっていた工数が大幅に削減され、コンサルタントが面談業務に集中できるようになりました。」
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div
                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 bg-cover bg-center"
                    data-alt="Portrait of a professional man"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXDkWKWOtCCPJIylVfC-j-khNXZ7KGjM2Me0OzKO5jGd8RL2YHozZfQ3hBBZe3WTCR0Dj8_5yacMjPFbDob96wFmlkvtZGPNMWexsdtOb54u1kIQ1uqIZUtC_9MTqqRcQeEhUpDMMNpip1or1N7T765qUgLCZSQ3gymQ70CYctjwFWgxrRGc4AmBv2ba_hWUaHACxxe6sc3LQr6ms-6Z0syMQxg_OVewnMZULY6iCHlfWSoZK0EFf0Z2h45yGvWyzO-xTrWGX5w554')",
                    }}
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      人材紹介会社A社
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">従業員50名・東京</p>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-xl star-filled"
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-6">
                    「候補者の書類品質が安定し、書類選考の通過率が目に見えて改善しました。導入して正解です。」
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div
                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 bg-cover bg-center"
                    data-alt="Portrait of a professional woman"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqAzMjqO82KyTIxikbAtsKIcgverw_Jkr9PIfuNYNAn9NPeLneh4-x8WAOYMyLWlEEIVyc0m6194eN8HO2Kudk06SRLCGGuKv5uDokCkAlJ2WSE3E6EN_JVobXIf7s6dpU_CODrbcGJ36o83nQkERhPO4WBsCLpiCIKzqibpHV3rpUoAhwV63agGyS5XAjjxXWEzZbaz8FRn2OBB1sS17Mp1b_Lg-77ptgS_BxvzHEf-7c2OupuXeEAe01EBYprcANPsw-0BVJ9Hdh')",
                    }}
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      転職支援サービスB社
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">従業員20名・大阪</p>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-4">
                    {[...Array(4)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-xl star-filled"
                      >
                        star
                      </span>
                    ))}
                    <span className="material-symbols-outlined text-xl star-filled opacity-50">
                      star
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-6">
                    「退職代行後の支援として履歴書作成を提供できるようになり、サービスの付加価値が向上しました。」
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div
                    className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 bg-cover bg-center"
                    data-alt="Portrait of a middle-aged professional man"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCH1jBvOoawUhYESwXafA_eB2BHrDlTnwUeopbI9qqFNGq3gERrtNVWqrQcxUSXgr41k1gbTuXfqm4G_9t7j2l9rZT9fGDPPG_D5YyPVdB9Gbjy1YTRjE9Dcuw4s6lvoupbdHdL4KaUdE7bRGnnvunwSfJwAuhhWimlox389maXh05BxsxW1DFzWrUzMbpADp9HqH95-z23LGJ5wDf6-tzFqrDSaVQX0z8j1-mY0EQHcWh9k0fP7S9e5VcuCANKtO2frN4iT8DYpQdU')",
                    }}
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      退職支援サービスC社
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">従業員10名・兵庫</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 px-6 max-w-[800px] mx-auto w-full">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
              よくあるご質問
            </h2>

            <div className="flex flex-col gap-4">
              <details className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    導入費用はかかりますか？
                  </span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                  現在モニタープログラム期間中につき、初期費用・月額費用ともに無料でご利用いただけます。本格導入プランについてはお問い合わせください。
                </div>
              </details>

              <details className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    候補者の個人情報は安全ですか？
                  </span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                  はい。SSL暗号化通信、アクセス制御、監査ログなど、企業向けのセキュリティ基準を満たしています。DPA（個人情報取扱い特約）にも対応しています。
                </div>
              </details>

              <details className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    既存の業務フローに組み込めますか？
                  </span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                  はい。PDF・DOCX形式でのエクスポートに対応しており、貴社の既存システムとの連携が可能です。候補者への招待もリンク共有で完結します。
                </div>
              </details>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-[#3CC8E8]/5 dark:bg-slate-900/50">
            <div className="max-w-[800px] mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                貴社の紹介業務を、<br className="md:hidden" />次のステージへ。
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                まずは無料トライアルでお試しください。
              </p>
              <Link
                href="/monitor-program/resume"
                className="inline-flex items-center justify-center gap-2 h-14 px-10 rounded-xl bg-[#F97316] hover:bg-orange-500 text-white text-lg font-bold shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
              >
                無料トライアルを始める
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#101822] text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-[1200px] mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
                  <Image
                    src="/logo.png"
                    alt="キャリアブリッジ"
                    width={160}
                    height={36}
                    className="h-8 w-auto dark:brightness-0 dark:invert"
                  />
                </Link>
                <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
                  <Link href="#" className="hover:text-white transition-colors">
                    運営会社
                  </Link>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    プライバシーポリシー
                  </Link>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    利用規約
                  </Link>
                  <Link href="#" className="hover:text-white transition-colors">
                    お問い合わせ
                  </Link>
                </div>
              </div>
              <div className="text-center text-xs text-slate-600">
                &copy; 2023 CareerBridge Inc. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
