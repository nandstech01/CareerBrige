'use client'

import { useEffect, useState } from 'react'
import { Loader2, Plus, Layout } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string | null
  template_type: string
  is_default: boolean
  is_active: boolean
  created_at: string
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/monitor/admin/templates')
        if (response.ok) {
          const data = await response.json()
          setTemplates(data.templates || [])
        }
      } catch (err) {
        console.error('Failed to fetch templates:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-cyan animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            テンプレート管理
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
            履歴書テンプレートの管理
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan-dark transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" />
          テンプレート追加
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-12 text-center">
          <Layout className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-300">テンプレートがありません</p>
          <p className="text-sm text-slate-400 mt-1">新しいテンプレートを追加してください</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {template.name}
                    {template.is_default && (
                      <span className="px-2 py-0.5 bg-brand-cyan/10 text-brand-cyan text-xs rounded-full">
                        デフォルト
                      </span>
                    )}
                  </h3>
                  {template.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                      {template.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {template.template_type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
