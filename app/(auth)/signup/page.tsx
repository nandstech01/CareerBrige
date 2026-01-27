'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, User, ArrowRight, Loader2, Users, Building2, Check } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'engineer'

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'engineer' | 'company'>(
    defaultRole === 'company' ? 'company' : 'engineer'
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '登録に失敗しました')
      }

      router.push('/login?registered=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex overflow-hidden transition-colors">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-30 dark:opacity-40"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(14, 165, 233, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 165, 233, 0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
        <div className="absolute top-1/4 -right-40 w-[400px] h-[400px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-orange-500/10 dark:bg-orange-500/15 rounded-full blur-[100px]" />
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Image
            src="/logo.png"
            alt="キャリアブリッジ"
            width={200}
            height={44}
            className="h-11 w-auto"
            priority
          />
        </Link>

        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            今すぐ始めて、
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-400">理想の仕事を見つけよう</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
            CareerBridgeは、全国50万件以上の求人からあなたにぴったりの仕事をマッチング。
            職種・勤務地・給与など、希望条件で簡単検索。
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              '全国50万件以上の求人',
              '希望条件で簡単検索',
              '無料で何件でも応募可能',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-sky-500" />
                </div>
                <span className="text-slate-700 dark:text-slate-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-slate-500 dark:text-slate-400 text-sm">
          &copy; 2024 CareerBridge. All rights reserved.
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center mb-8 justify-center hover:opacity-90 transition-opacity">
            <Image
              src="/logo.png"
              alt="キャリアブリッジ"
              width={180}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 md:p-10 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                アカウント作成
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                CareerBridgeに登録して始めましょう
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  登録タイプ
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('engineer')}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      role === 'engineer'
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-slate-200 dark:border-slate-600/50 bg-slate-50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        role === 'engineer'
                          ? 'bg-sky-500/20'
                          : 'bg-slate-200 dark:bg-slate-700/50'
                      }`}>
                        <Users className={`w-5 h-5 transition-colors ${
                          role === 'engineer' ? 'text-sky-500' : 'text-slate-400'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-medium transition-colors ${
                          role === 'engineer' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                          エンジニア
                        </div>
                        <div className="text-xs text-slate-500">案件を探す</div>
                      </div>
                    </div>
                    {role === 'engineer' && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('company')}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      role === 'company'
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-slate-200 dark:border-slate-600/50 bg-slate-50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        role === 'company'
                          ? 'bg-orange-500/20'
                          : 'bg-slate-200 dark:bg-slate-700/50'
                      }`}>
                        <Building2 className={`w-5 h-5 transition-colors ${
                          role === 'company' ? 'text-orange-500' : 'text-slate-400'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-medium transition-colors ${
                          role === 'company' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                          企業
                        </div>
                        <div className="text-xs text-slate-500">人材を探す</div>
                      </div>
                    </div>
                    {role === 'company' && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  表示名
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={role === 'company' ? '株式会社○○' : '山田 太郎'}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  パスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="8文字以上"
                    minLength={8}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      登録中...
                    </>
                  ) : (
                    <>
                      登録する
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                既にアカウントをお持ちの方は{' '}
                <Link href="/login" className="text-sky-600 dark:text-sky-400 hover:text-sky-500 transition-colors font-medium">
                  ログイン
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}
