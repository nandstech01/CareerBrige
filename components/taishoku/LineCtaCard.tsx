'use client'

import { MessageCircle, CheckCircle, ArrowRight, Users, Clock, Shield } from 'lucide-react'

// LINE友達追加URL
const LINE_ADD_URL = 'https://lin.ee/B7yynyF'

interface LineCtaCardProps {
  variant?: 'default' | 'success' | 'compact'
  userName?: string
}

export function LineCtaCard({ variant = 'default', userName }: LineCtaCardProps) {
  if (variant === 'success') {
    return (
      <div className="bg-white dark:bg-midnight-800 rounded-2xl border border-slate-200 dark:border-midnight-600 shadow-xl overflow-hidden">
        {/* 成功アイコン */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 px-6 py-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            履歴書の作成が完了しました!
          </h2>
          {userName && (
            <p className="text-green-100">
              {userName}さん、お疲れさまでした
            </p>
          )}
        </div>

        {/* LINE誘導コンテンツ */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              次のステップ
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              LINEで専任の担当者があなたの転職をサポートします
            </p>
          </div>

          {/* メリット */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <span>専任担当者がマンツーマンでサポート</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
              <span>あなたに合った求人を優先的にご紹介</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <Shield className="w-4 h-4" />
              </div>
              <span>履歴書の添削・面接対策も無料</span>
            </div>
          </div>

          {/* LINEボタン */}
          <a
            href={LINE_ADD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full py-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-6 h-6" />
            LINEで友達追加する
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
            ※LINEを追加いただくと、担当者からスムーズにご連絡できます
          </p>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="bg-[#06C755]/10 dark:bg-[#06C755]/20 rounded-xl p-4 border border-[#06C755]/30">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[#06C755] text-white rounded-lg">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white text-sm">
                LINEで担当者に相談
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                転職のお悩みをサポートします
              </p>
            </div>
          </div>
          <a
            href={LINE_ADD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#06C755] hover:bg-[#05b34c] text-white text-sm font-medium rounded-lg transition-colors"
          >
            追加する
          </a>
        </div>
      </div>
    )
  }

  // default variant
  return (
    <div className="bg-gradient-to-br from-[#06C755]/10 to-[#06C755]/5 dark:from-[#06C755]/20 dark:to-[#06C755]/10 rounded-2xl p-6 border border-[#06C755]/30">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 flex items-center justify-center bg-[#06C755] text-white rounded-xl shadow-lg">
          <MessageCircle className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            LINEで転職サポートを受ける
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            専任の担当者があなたの転職活動をサポートします。
            履歴書の添削や求人紹介、面接対策まで無料で相談できます。
          </p>
          <a
            href={LINE_ADD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            LINEで友達追加
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  )
}
