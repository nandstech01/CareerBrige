'use client'

import { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'

interface DateRange {
  from: string
  to: string
  granularity: 'day' | 'week' | 'month'
}

interface AdminDateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

const PRESETS = [
  { label: '7日間', days: 7, granularity: 'day' as const },
  { label: '30日間', days: 30, granularity: 'day' as const },
  { label: '90日間', days: 90, granularity: 'week' as const },
  { label: '6ヶ月', days: 180, granularity: 'month' as const },
  { label: '1年', days: 365, granularity: 'month' as const },
]

export function AdminDateRangePicker({ value, onChange }: AdminDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const activePreset = PRESETS.find(p => {
    const fromDate = new Date(value.from)
    const toDate = new Date(value.to)
    const diffDays = Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
    return Math.abs(diffDays - p.days) <= 1 && value.granularity === p.granularity
  })

  const handlePreset = (preset: typeof PRESETS[number]) => {
    const now = new Date()
    const from = new Date(now.getTime() - preset.days * 24 * 60 * 60 * 1000)
    onChange({
      from: from.toISOString().split('T')[0],
      to: now.toISOString().split('T')[0],
      granularity: preset.granularity,
    })
    setIsOpen(false)
  }

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-midnight-600 bg-white dark:bg-midnight-800 text-sm text-slate-700 dark:text-slate-300 hover:border-brand-cyan transition-colors"
      >
        <Calendar className="w-4 h-4 text-slate-400" />
        <span>
          {activePreset
            ? activePreset.label
            : `${formatDisplayDate(value.from)} - ${formatDisplayDate(value.to)}`}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 w-64 bg-white dark:bg-midnight-800 border border-slate-200 dark:border-midnight-600 rounded-xl shadow-lg p-3">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-300 mb-2 px-1">
              期間プリセット
            </p>
            <div className="space-y-1">
              {PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activePreset?.label === preset.label
                      ? 'bg-brand-cyan/10 text-brand-cyan font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-midnight-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-midnight-600 mt-3 pt-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-300 mb-2 px-1">
                カスタム期間
              </p>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={value.from}
                  onChange={e => onChange({ ...value, from: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-midnight-600 bg-slate-50 dark:bg-midnight-700 text-slate-700 dark:text-slate-300"
                />
                <input
                  type="date"
                  value={value.to}
                  onChange={e => onChange({ ...value, to: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-midnight-600 bg-slate-50 dark:bg-midnight-700 text-slate-700 dark:text-slate-300"
                />
              </div>
              <div className="flex gap-1 mt-2">
                {(['day', 'week', 'month'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => onChange({ ...value, granularity: g })}
                    className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${
                      value.granularity === g
                        ? 'bg-brand-cyan text-white'
                        : 'bg-slate-100 dark:bg-midnight-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-midnight-600'
                    }`}
                  >
                    {{ day: '日', week: '週', month: '月' }[g]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function getDefaultDateRange(): DateRange {
  const now = new Date()
  const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  return {
    from: from.toISOString().split('T')[0],
    to: now.toISOString().split('T')[0],
    granularity: 'day',
  }
}
