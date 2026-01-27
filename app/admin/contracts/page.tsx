'use client'

import { useEffect, useState } from 'react'
import {
  FileText,
  Receipt,
  Loader2,
  Filter,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  Code2,
  TrendingUp
} from 'lucide-react'
import type { ContractStatus, InvoiceStatus } from '@/types/database'

interface Contract {
  id: string
  company_name: string
  engineer_name: string
  status: ContractStatus
  monthly_fee_yen: number | null
  platform_fee_rate: number
  start_date: string | null
  end_date: string | null
  created_at: string
}

interface Invoice {
  id: string
  contract_id: string
  amount_yen: number
  status: InvoiceStatus
  billing_month: string | null
  company_name: string
}

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams()
        if (statusFilter !== 'all') params.set('status', statusFilter)

        const res = await fetch(`/api/admin/contracts?${params}`)
        if (res.ok) {
          const data = await res.json()
          setContracts(data.contracts)
          setInvoices(data.invoices)
        }
      } catch (error) {
        console.error('Failed to fetch contracts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [statusFilter])

  const statusConfig: Record<ContractStatus, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle }> = {
    initiated: { label: '開始前', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-200/50 dark:bg-slate-700/50', border: 'border-slate-300/50 dark:border-slate-600/50', icon: Clock },
    signed: { label: '署名済み', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: FileText },
    active: { label: 'アクティブ', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle },
    completed: { label: '完了', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: CheckCircle },
    cancelled: { label: 'キャンセル', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: XCircle },
  }

  const invoiceStatusConfig: Record<InvoiceStatus, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle }> = {
    pending: { label: '未払い', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: Clock },
    paid: { label: '支払済', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle },
    void: { label: '無効', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-200/50 dark:bg-slate-700/50', border: 'border-slate-300/50 dark:border-slate-600/50', icon: XCircle },
    failed: { label: '失敗', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertCircle },
  }

  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount_yen, 0)

  const pendingRevenue = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount_yen, 0)

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">契約・請求管理</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">契約状況と請求書の管理</p>
        </div>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-sky-500 dark:text-purple-400 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">契約・請求管理</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">契約状況と請求書の管理</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">総売上（支払済）</p>
          <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">
            ¥{(totalRevenue / 10000).toFixed(0)}
            <span className="text-lg text-slate-400 dark:text-slate-500">万</span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-yellow-500/10">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">未収金</p>
          <p className="font-display text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            ¥{(pendingRevenue / 10000).toFixed(0)}
            <span className="text-lg text-slate-400 dark:text-slate-500">万</span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">契約数</p>
          <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">{contracts.length}</p>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">契約一覧</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">アクティブな契約の管理</p>
            </div>
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-sky-500 dark:focus:border-purple-500/50"
              >
                <option value="all">全て</option>
                <option value="initiated">開始前</option>
                <option value="signed">署名済み</option>
                <option value="active">アクティブ</option>
                <option value="completed">完了</option>
                <option value="cancelled">キャンセル</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30">
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">企業</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">エンジニア</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">ステータス</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">月額</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">手数料率</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">期間</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => {
                const status = statusConfig[contract.status]
                const StatusIcon = status.icon
                return (
                  <tr
                    key={contract.id}
                    className="border-b border-slate-200/50 dark:border-slate-700/30 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{contract.company_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-sky-500/10 dark:bg-cyan-500/10 flex items-center justify-center">
                          <Code2 className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-300">{contract.engineer_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-orange-600 dark:text-orange-400 font-medium">
                        {contract.monthly_fee_yen
                          ? `¥${contract.monthly_fee_yen.toLocaleString()}`
                          : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">{contract.platform_fee_rate}%</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
                      {contract.start_date
                        ? `${new Date(contract.start_date).toLocaleDateString('ja-JP')}〜`
                        : '-'}
                    </td>
                  </tr>
                )
              })}
              {contracts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 dark:text-slate-500">契約がありません</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">請求一覧</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">発行済み請求書の管理</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30">
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">企業</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">請求月</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">金額</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-500 dark:text-slate-400">ステータス</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const status = invoiceStatusConfig[invoice.status]
                const StatusIcon = status.icon
                return (
                  <tr
                    key={invoice.id}
                    className="border-b border-slate-200/50 dark:border-slate-700/30 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{invoice.company_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                      {invoice.billing_month
                        ? new Date(invoice.billing_month).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
                        : '-'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-orange-600 dark:text-orange-400 font-medium">
                        ¥{invoice.amount_yen.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <Receipt className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 dark:text-slate-500">請求がありません</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
