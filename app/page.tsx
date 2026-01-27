'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Search, MapPin, ChevronDown, Sparkles, FileText, DollarSign,
  BadgeCheck, Brain, Zap, ArrowRight, Database, Handshake, Star,
  Menu, Twitter, Linkedin, Briefcase, TrendingUp, Building2, ChevronRight,
  Rocket, Code, BarChart3, Award
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#0b1120] text-white antialiased selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-white/10 bg-[#0b1120]/90 backdrop-blur-md px-4 py-3 lg:px-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-white text-2xl font-bold tracking-tight">CareerBridge</h2>
          </Link>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <nav className="flex gap-6">
            <Link className="text-slate-300 hover:text-sky-400 text-sm font-medium transition-colors" href="/jobs">
              求人を探す
            </Link>
            <Link className="text-slate-300 hover:text-sky-400 text-sm font-medium transition-colors" href="/for-recruiters">
              採用担当者の方へ
            </Link>
          </nav>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="flex items-center justify-center rounded-lg h-9 px-4 bg-transparent border border-white/20 text-white text-sm font-bold hover:bg-white/5 transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-center rounded-lg h-9 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            >
              無料登録
            </Link>
          </div>
        </div>
        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center text-white">
          <Menu className="w-7 h-7" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-40 overflow-hidden bg-[#0b1120]">
          {/* Background Effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-[#0b1120] to-[#0b1120]"></div>
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundSize: '40px 40px',
              backgroundImage: 'linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)'
            }}></div>
            {/* Animated SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="neonGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'rgba(56, 189, 248, 0)' }}></stop>
                  <stop offset="50%" style={{ stopColor: '#38bdf8' }}></stop>
                  <stop offset="100%" style={{ stopColor: 'rgba(56, 189, 248, 0)' }}></stop>
                </linearGradient>
                <linearGradient id="accentGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'rgba(249, 115, 22, 0)' }}></stop>
                  <stop offset="50%" style={{ stopColor: '#f97316' }}></stop>
                  <stop offset="100%" style={{ stopColor: 'rgba(249, 115, 22, 0)' }}></stop>
                </linearGradient>
              </defs>
              <path d="M0,600 C360,550 720,200 1080,550 C1260,725 1440,600 1440,600" fill="none" stroke="url(#neonGradient)" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 5px #38bdf8)' }}></path>
              <path d="M0,700 C400,650 800,400 1100,650 C1300,750 1440,700 1440,700" fill="none" opacity="0.4" stroke="url(#accentGradient)" strokeWidth="1.5"></path>
              <circle cx="720" cy="200" fill="#f97316" r="3" style={{ filter: 'drop-shadow(0 0 8px #f97316)' }} className="animate-pulse"></circle>
              <circle cx="360" cy="550" fill="#38bdf8" r="2" style={{ filter: 'drop-shadow(0 0 5px #38bdf8)' }} className="animate-pulse"></circle>
              <circle cx="1080" cy="550" fill="#38bdf8" r="2" style={{ filter: 'drop-shadow(0 0 5px #38bdf8)' }} className="animate-pulse"></circle>
            </svg>
          </div>

          <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-sky-500/30 px-4 py-1.5 rounded-full text-sky-300 text-sm font-semibold mb-8 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <Award className="w-4 h-4 text-orange-500" />
              <span className="text-white">#1 求人プラットフォーム</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-6 drop-shadow-2xl">
              Career<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Bridge</span>
            </h1>

            {/* Subtitle with stats */}
            <div className="flex items-center justify-center gap-4 mb-10 w-full max-w-2xl">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-orange-500"></div>
              <p className="text-xl md:text-2xl text-slate-300 font-light tracking-wide whitespace-nowrap">
                <span className="font-bold text-sky-400 text-3xl">500,000+</span> 件の求人
              </p>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-orange-500"></div>
            </div>

            {/* Hero Visual with Floating Cards */}
            <div className="relative w-full max-w-4xl mx-auto mb-16 h-[320px] md:h-[420px]">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full flex items-end justify-center">
                <div className="relative z-10 w-72 md:w-96">
                  <div className="w-full h-full flex flex-col items-center justify-end">
                    {/* Floating Card - Left */}
                    <div className="absolute bottom-16 -left-12 md:-left-28 bg-[#131c2a]/70 backdrop-blur-xl border border-sky-500/20 p-5 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-bounce" style={{ animationDuration: '3s' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">年収アップ実績</span>
                      </div>
                      <div className="text-3xl font-bold text-white flex items-baseline gap-1">
                        +120万円
                        <span className="text-xs font-normal text-slate-400">平均</span>
                      </div>
                      <div className="mt-2 h-8 w-full flex items-end justify-between gap-1">
                        <div className="w-2 bg-sky-500/20 h-2 rounded-t-sm"></div>
                        <div className="w-2 bg-sky-500/40 h-3 rounded-t-sm"></div>
                        <div className="w-2 bg-sky-500/60 h-5 rounded-t-sm"></div>
                        <div className="w-2 bg-sky-500 h-7 rounded-t-sm shadow-[0_0_10px_#38bdf8]"></div>
                      </div>
                    </div>

                    {/* Floating Card - Right */}
                    <div className="absolute bottom-32 -right-8 md:-right-24 bg-[#131c2a]/70 backdrop-blur-xl border border-orange-500/20 p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-500">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">提携企業</span>
                      </div>
                      <div className="flex -space-x-3 mt-1">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#131c2a] flex items-center justify-center text-xs text-white font-bold shadow-lg">A</div>
                        <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-[#131c2a] flex items-center justify-center text-xs text-white font-bold shadow-lg">G</div>
                        <div className="w-10 h-10 rounded-full bg-slate-600 border-2 border-[#131c2a] flex items-center justify-center text-xs text-white font-bold shadow-lg">M</div>
                        <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-[#131c2a] flex items-center justify-center text-xs text-white font-bold shadow-[0_0_10px_#f97316] z-10">+2k</div>
                      </div>
                    </div>

                    {/* Center Image Placeholder */}
                    <div className="h-64 md:h-80 w-48 md:w-64 bg-gradient-to-b from-sky-500/20 to-transparent rounded-t-full flex items-end justify-center">
                      <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-sky-400/30 to-blue-600/30 border border-sky-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.3)]">
                        <Briefcase className="w-16 h-16 md:w-24 md:h-24 text-sky-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="relative z-20 container mx-auto px-4 -mt-24">
            <div className="max-w-3xl mx-auto bg-[#131c2a]/70 backdrop-blur-xl border border-sky-500/15 rounded-2xl shadow-2xl p-8 md:p-10 text-center relative overflow-hidden group">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-orange-500 to-sky-500"></div>
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <h3 className="text-white text-xl font-bold mb-8">無料プロフィールを作成して、隠れた求人にアクセス</h3>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all transform hover:-translate-y-1"
                >
                  メールで登録
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/20 hover:bg-white/10 hover:border-sky-400 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-sky-500/20"
                >
                  ログイン
                </Link>
              </div>
              <p className="mt-6 text-xs text-slate-400 font-medium">2分で完了。クレジットカード不要。</p>
            </div>
          </div>
        </section>

        {/* Trusted Companies */}
        <section className="py-14 bg-[#080d17] border-b border-white/5">
          <div className="container mx-auto px-4">
            <p className="text-center text-xs font-bold text-sky-500/70 uppercase tracking-[0.2em] mb-10">業界をリードする企業が信頼</p>
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-10 opacity-70 hover:opacity-100 transition-all duration-500">
              <div className="flex items-center gap-2 text-xl font-bold text-white hover:text-sky-400 transition-colors"><Zap className="w-6 h-6" /> TechFlow</div>
              <div className="flex items-center gap-2 text-xl font-bold text-white hover:text-sky-400 transition-colors"><Database className="w-6 h-6" /> GlobalSystems</div>
              <div className="flex items-center gap-2 text-xl font-bold text-white hover:text-sky-400 transition-colors"><Building2 className="w-6 h-6" /> CubeSoft</div>
              <div className="flex items-center gap-2 text-xl font-bold text-white hover:text-sky-400 transition-colors"><Sparkles className="w-6 h-6" /> InfinityCorp</div>
              <div className="flex items-center gap-2 text-xl font-bold text-white hover:text-sky-400 transition-colors"><Star className="w-6 h-6" /> PrimeAsset</div>
            </div>
          </div>
        </section>

        {/* Proven Results Section */}
        <section className="py-24 bg-[#0b1120] relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundSize: '40px 40px',
            backgroundImage: 'linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)'
          }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block relative mb-4">
                <h2 className="text-4xl md:text-5xl font-black text-white relative z-10">実績紹介</h2>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
              </div>
              <p className="text-slate-400 max-w-2xl mx-auto">プロフェッショナルがキャリアと年収をレベルアップした実例をご覧ください。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Result Card 1 */}
              <div className="bg-[#131c2a] border border-white/10 rounded-2xl overflow-hidden group hover:border-sky-500/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] transition-all duration-300">
                <div className="h-1 bg-gradient-to-r from-sky-400 to-blue-600"></div>
                <div className="p-6 relative">
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-sky-400 -rotate-45" />
                  </div>
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold rounded-md uppercase tracking-wide mb-4">
                      +150万円 アップ
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">前</span>
                        <span className="text-lg font-bold text-slate-500 line-through decoration-red-500/50 decoration-2">700万円</span>
                      </div>
                      <div className="mb-2 text-sky-500">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-sky-400 uppercase font-bold mb-1">後</span>
                        <span className="text-3xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">850万円</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">マーケティング</span>
                    <span className="text-slate-500">30代</span>
                  </div>
                </div>
              </div>

              {/* Result Card 2 */}
              <div className="bg-[#131c2a] border border-white/10 rounded-2xl overflow-hidden group hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300">
                <div className="h-1 bg-gradient-to-r from-orange-400 to-red-600"></div>
                <div className="p-6 relative">
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-orange-500 -rotate-45" />
                  </div>
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-md uppercase tracking-wide mb-4">
                      +280万円 アップ
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">前</span>
                        <span className="text-lg font-bold text-slate-500 line-through decoration-red-500/50 decoration-2">920万円</span>
                      </div>
                      <div className="mb-2 text-orange-500">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-orange-400 uppercase font-bold mb-1">後</span>
                        <span className="text-3xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">1200万円</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">シニアエンジニア</span>
                    <span className="text-slate-500">20代</span>
                  </div>
                </div>
              </div>

              {/* Result Card 3 */}
              <div className="bg-[#131c2a] border border-white/10 rounded-2xl overflow-hidden group hover:border-sky-500/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] transition-all duration-300">
                <div className="h-1 bg-gradient-to-r from-sky-400 to-blue-600"></div>
                <div className="p-6 relative">
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-sky-400 -rotate-45" />
                  </div>
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold rounded-md uppercase tracking-wide mb-4">
                      +120万円 アップ
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">前</span>
                        <span className="text-lg font-bold text-slate-500 line-through decoration-red-500/50 decoration-2">650万円</span>
                      </div>
                      <div className="mb-2 text-sky-500">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-sky-400 uppercase font-bold mb-1">後</span>
                        <span className="text-3xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">770万円</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">プロジェクトリード</span>
                    <span className="text-slate-500">40代</span>
                  </div>
                </div>
              </div>

              {/* Result Card 4 */}
              <div className="bg-[#131c2a] border border-white/10 rounded-2xl overflow-hidden group hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300">
                <div className="h-1 bg-gradient-to-r from-orange-400 to-red-600"></div>
                <div className="p-6 relative">
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-orange-500 -rotate-45" />
                  </div>
                  <div className="mb-6">
                    <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-md uppercase tracking-wide mb-4">
                      +200万円 アップ
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">前</span>
                        <span className="text-lg font-bold text-slate-500 line-through decoration-red-500/50 decoration-2">550万円</span>
                      </div>
                      <div className="mb-2 text-orange-500">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-orange-400 uppercase font-bold mb-1">後</span>
                        <span className="text-3xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">750万円</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">データアナリスト</span>
                    <span className="text-slate-500">20代</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <button className="group bg-transparent hover:bg-white/5 text-white font-bold py-3 px-10 rounded-full border border-sky-500/50 shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all flex items-center gap-3 mx-auto">
                もっと見る
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-24 bg-gradient-to-b from-[#0b1120] to-[#05080f]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-16">
              <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-3">500,000+ 件の求人</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white text-center">注目の成長企業求人</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Job Card 1 */}
              <div className="bg-[#131c2a] border border-white/10 rounded-xl p-8 hover:translate-y-[-6px] transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-white to-slate-300 rounded-xl flex items-center justify-center text-[#0b1120] font-bold shadow-lg">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xl group-hover:text-sky-400 transition-colors">プロダクトデザイナー</h4>
                    <p className="text-slate-400 text-sm mt-1">FinTech Corp • リモート</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">正社員</span>
                  <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">シニア</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                  <span className="text-sky-400 font-bold text-lg">900万円 - 1400万円</span>
                  <button className="text-white hover:text-orange-500 transition-colors text-sm font-bold flex items-center gap-1">
                    詳細 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Job Card 2 */}
              <div className="bg-[#131c2a] border border-white/10 rounded-xl p-8 hover:translate-y-[-6px] transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-white to-slate-300 rounded-xl flex items-center justify-center text-[#0b1120] font-bold shadow-lg">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xl group-hover:text-sky-400 transition-colors">バックエンドエンジニア</h4>
                    <p className="text-slate-400 text-sm mt-1">CloudSystems • 東京</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">業務委託</span>
                  <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">Golang</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                  <span className="text-sky-400 font-bold text-lg">1000万円 - 1500万円</span>
                  <button className="text-white hover:text-orange-500 transition-colors text-sm font-bold flex items-center gap-1">
                    詳細 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Job Card 3 */}
              <div className="bg-[#131c2a] border border-white/10 rounded-xl p-8 hover:translate-y-[-6px] transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-white to-slate-300 rounded-xl flex items-center justify-center text-[#0b1120] font-bold shadow-lg">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xl group-hover:text-sky-400 transition-colors">グロースマネージャー</h4>
                    <p className="text-slate-400 text-sm mt-1">StartupInc • ハイブリッド</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-6">
                  <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">正社員</span>
                  <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-slate-300 font-medium">B2B</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                  <span className="text-sky-400 font-bold text-lg">800万円 - 1200万円</span>
                  <button className="text-white hover:text-orange-500 transition-colors text-sm font-bold flex items-center gap-1">
                    詳細 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Total Jobs Counter */}
            <div className="mt-16 bg-[#131c2a] border border-sky-500/30 rounded-2xl p-8 text-center max-w-4xl mx-auto shadow-[0_0_40px_rgba(56,189,248,0.1)]">
              <h3 className="text-2xl font-bold text-white mb-2">現在の求人数: <span className="text-sky-400 text-3xl font-black mx-2">524,301</span>件</h3>
              <p className="text-slate-400 text-sm flex justify-center items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                更新: 本日
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 relative overflow-hidden bg-[#0a365c]">
          <div className="absolute inset-0 bg-[#0b1120] opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 to-transparent"></div>
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-sky-500/20 rounded-full blur-[100px]"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-white text-4xl md:text-6xl font-black tracking-tight mb-8">
              検索をやめて。<span className="text-sky-400">見つけよう。</span>
            </h2>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              プロフェッショナルのキャリア管理を変えるプラットフォームに参加しましょう。データ駆動、透明性、求職者は完全無料。
            </p>
            <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
              <Link
                href="/signup?role=engineer"
                className="px-10 h-14 bg-white text-[#0a365c] font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all flex items-center justify-center"
              >
                無料で始める
              </Link>
              <Link
                href="/signup?role=company"
                className="px-10 h-14 bg-transparent border-2 border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center"
              >
                求人を掲載する
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#05080f] border-t border-white/5 py-16 px-4 lg:px-40">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1 flex flex-col gap-6">
              <div className="flex items-center gap-3 text-white">
                <div className="size-8 flex items-center justify-center rounded bg-sky-500/20 text-sky-400 shadow-sm border border-sky-500/30">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h2 className="text-white text-xl font-bold">CareerBridge</h2>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">インテリジェントなデータマッチングとAIインサイトで、才能と機会をつなぐ。</p>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold mb-2">求職者向け</h4>
              <Link className="text-slate-400 hover:text-sky-400 text-sm transition-colors" href="/jobs">求人を探す</Link>
              <Link className="text-slate-400 hover:text-sky-400 text-sm transition-colors" href="#">給与ツール</Link>
              <Link className="text-slate-400 hover:text-sky-400 text-sm transition-colors" href="#">キャリアアドバイス</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold mb-2">採用担当者向け</h4>
              <Link className="text-slate-400 hover:text-sky-400 text-sm transition-colors" href="/signup?role=company">求人を掲載</Link>
              <Link className="text-slate-400 hover:text-sky-400 text-sm transition-colors" href="#">採用ソリューション</Link>
              <Link className="text-slate-400 hover:text-sky-400 text-sm transition-colors" href="/pricing">料金プラン</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold mb-2">サポート</h4>
              <Link className="text-slate-400 hover:text-sky-400 text-sm transition-colors" href="#">ヘルプセンター</Link>
              <Link className="text-slate-400 hover:text-sky-400 text-sm transition-colors" href="#">利用規約</Link>
              <Link className="text-slate-400 hover:text-sky-400 text-sm transition-colors" href="#">プライバシーポリシー</Link>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-sm">© 2024 CareerBridge Inc. 無断転載を禁じます。</p>
            <div className="flex gap-6">
              <a className="text-slate-500 hover:text-white transition-colors" href="#">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-5 h-5" />
              </a>
              <a className="text-slate-500 hover:text-white transition-colors" href="#">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
