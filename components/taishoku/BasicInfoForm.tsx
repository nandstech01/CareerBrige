'use client'

import { User, Phone, MapPin, Calendar } from 'lucide-react'

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
]

export interface BasicInfo {
  name: string
  phone: string
  age: string
  prefecture: string
}

interface BasicInfoFormProps {
  data: BasicInfo
  onChange: (data: BasicInfo) => void
  onNext: () => void
}

export function BasicInfoForm({ data, onChange, onNext }: BasicInfoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    onChange({ ...data, [name]: value })
  }

  const isValid = data.name && data.phone && data.age && data.prefecture

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          基本情報を入力
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          履歴書に記載する基本情報を入力してください
        </p>
      </div>

      {/* 氏名 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <User className="w-4 h-4" />
          氏名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="山田 太郎"
          required
          className="w-full px-4 py-3 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
        />
      </div>

      {/* 電話番号 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <Phone className="w-4 h-4" />
          電話番号 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          placeholder="090-1234-5678"
          required
          className="w-full px-4 py-3 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
        />
      </div>

      {/* 年齢 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <Calendar className="w-4 h-4" />
          年齢 <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="age"
          value={data.age}
          onChange={handleChange}
          placeholder="28"
          min="18"
          max="99"
          required
          className="w-full px-4 py-3 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors"
        />
      </div>

      {/* 都道府県 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          <MapPin className="w-4 h-4" />
          都道府県 <span className="text-red-500">*</span>
        </label>
        <select
          name="prefecture"
          value={data.prefecture}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-white dark:bg-midnight-700 border border-slate-300 dark:border-midnight-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-colors appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
          }}
        >
          <option value="">選択してください</option>
          {PREFECTURES.map(pref => (
            <option key={pref} value={pref}>{pref}</option>
          ))}
        </select>
      </div>

      {/* 次へボタン */}
      <button
        type="submit"
        disabled={!isValid}
        className="w-full py-4 bg-gradient-to-r from-brand-cyan to-brand-cyan-dark hover:from-brand-cyan-dark hover:to-brand-cyan text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-brand-cyan/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
      >
        次へ：音声で職歴を入力
      </button>
    </form>
  )
}
