'use client'

import { useState, useCallback } from 'react'
import { Calendar, Building2, User, Briefcase, AlertCircle } from 'lucide-react'

export interface ResignationData {
  submissionDate: string    // 提出日
  companyName: string       // 会社名
  representativeName: string // 代表者名
  department: string        // 部署名
  section: string           // 課名（任意）
  employeeName: string      // 氏名
  resignationDate: string   // 退職希望日
}

interface ResignationFormProps {
  data: ResignationData
  onChange: (data: ResignationData) => void
  onNext: () => void
}

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

export function ResignationForm({ data, onChange, onNext }: ResignationFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof ResignationData, string>>>({})

  // フィールド更新
  const handleChange = useCallback((field: keyof ResignationData, value: string) => {
    onChange({ ...data, [field]: value })
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [data, onChange, errors])

  // バリデーション
  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ResignationData, string>> = {}

    if (!data.submissionDate) {
      newErrors.submissionDate = '提出日を入力してください'
    }
    if (!data.companyName.trim()) {
      newErrors.companyName = '会社名を入力してください'
    }
    if (!data.representativeName.trim()) {
      newErrors.representativeName = '代表者名を入力してください'
    }
    if (!data.department.trim()) {
      newErrors.department = '部署名を入力してください'
    }
    if (!data.employeeName.trim()) {
      newErrors.employeeName = '氏名を入力してください'
    }
    if (!data.resignationDate) {
      newErrors.resignationDate = '退職希望日を入力してください'
    }

    // 退職希望日が提出日より後かチェック
    if (data.submissionDate && data.resignationDate) {
      if (new Date(data.resignationDate) <= new Date(data.submissionDate)) {
        newErrors.resignationDate = '退職希望日は提出日より後の日付を選択してください'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [data])

  // 次へボタン
  const handleNext = useCallback(() => {
    if (validate()) {
      onNext()
    }
  }, [validate, onNext])

  // デフォルト日付を設定
  const submissionDateDefault = data.submissionDate || getTodayString()
  const resignationDateDefault = data.resignationDate || getOneMonthLaterString()

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          退職届の情報を入力
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          正式な退職届を作成するために必要な情報を入力してください
        </p>
      </div>

      {/* 提出日 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-brand-cyan" />
          提出日 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.submissionDate || submissionDateDefault}
          onChange={(e) => handleChange('submissionDate', e.target.value)}
          className={`w-full px-4 py-3 bg-slate-50 dark:bg-midnight-700 text-slate-900 dark:text-white border rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all ${
            errors.submissionDate
              ? 'border-red-500'
              : 'border-slate-200 dark:border-midnight-600'
          }`}
        />
        {errors.submissionDate && (
          <p className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            {errors.submissionDate}
          </p>
        )}
      </div>

      {/* 会社名 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Building2 className="w-4 h-4 text-brand-cyan" />
          会社名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.companyName}
          onChange={(e) => handleChange('companyName', e.target.value)}
          placeholder="株式会社○○○"
          className={`w-full px-4 py-3 bg-slate-50 dark:bg-midnight-700 text-slate-900 dark:text-white border rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all ${
            errors.companyName
              ? 'border-red-500'
              : 'border-slate-200 dark:border-midnight-600'
          }`}
        />
        {errors.companyName && (
          <p className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            {errors.companyName}
          </p>
        )}
      </div>

      {/* 代表者名 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <User className="w-4 h-4 text-brand-cyan" />
          代表者名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.representativeName}
          onChange={(e) => handleChange('representativeName', e.target.value)}
          placeholder="山田太郎"
          className={`w-full px-4 py-3 bg-slate-50 dark:bg-midnight-700 text-slate-900 dark:text-white border rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all ${
            errors.representativeName
              ? 'border-red-500'
              : 'border-slate-200 dark:border-midnight-600'
          }`}
        />
        {errors.representativeName && (
          <p className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            {errors.representativeName}
          </p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-300">
          ※「代表取締役 ○○殿」の形式で表示されます
        </p>
      </div>

      {/* 部署名・課名 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Briefcase className="w-4 h-4 text-brand-cyan" />
            部署名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.department}
            onChange={(e) => handleChange('department', e.target.value)}
            placeholder="営業部"
            className={`w-full px-4 py-3 bg-slate-50 dark:bg-midnight-700 text-slate-900 dark:text-white border rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all ${
              errors.department
                ? 'border-red-500'
                : 'border-slate-200 dark:border-midnight-600'
            }`}
          />
          {errors.department && (
            <p className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              {errors.department}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Briefcase className="w-4 h-4 text-slate-400" />
            課名（任意）
          </label>
          <input
            type="text"
            value={data.section}
            onChange={(e) => handleChange('section', e.target.value)}
            placeholder="第一課"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-midnight-700 text-slate-900 dark:text-white border border-slate-200 dark:border-midnight-600 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* 氏名 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <User className="w-4 h-4 text-brand-cyan" />
          氏名（あなたの名前） <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.employeeName}
          onChange={(e) => handleChange('employeeName', e.target.value)}
          placeholder="田中花子"
          className={`w-full px-4 py-3 bg-slate-50 dark:bg-midnight-700 text-slate-900 dark:text-white border rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all ${
            errors.employeeName
              ? 'border-red-500'
              : 'border-slate-200 dark:border-midnight-600'
          }`}
        />
        {errors.employeeName && (
          <p className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            {errors.employeeName}
          </p>
        )}
      </div>

      {/* 退職希望日 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-brand-cyan" />
          退職希望日 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={data.resignationDate || resignationDateDefault}
          onChange={(e) => handleChange('resignationDate', e.target.value)}
          className={`w-full px-4 py-3 bg-slate-50 dark:bg-midnight-700 text-slate-900 dark:text-white border rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all ${
            errors.resignationDate
              ? 'border-red-500'
              : 'border-slate-200 dark:border-midnight-600'
          }`}
        />
        {errors.resignationDate && (
          <p className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            {errors.resignationDate}
          </p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-300">
          ※一般的に退職届の提出は退職希望日の1ヶ月以上前が推奨されています
        </p>
      </div>

      {/* 次へボタン */}
      <button
        onClick={handleNext}
        className="w-full py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-brand-cyan/25 transition-all"
      >
        プレビューを確認する
      </button>
    </div>
  )
}
