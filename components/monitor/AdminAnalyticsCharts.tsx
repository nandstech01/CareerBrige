'use client'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// --- Trend Chart ---

interface TrendDataPoint {
  label: string
  total: number
  completed: number
  abandoned: number
}

interface TrendChartProps {
  data: TrendDataPoint[]
}

export function SessionTrendChart({ data }: TrendChartProps) {
  const formatted = data.map(d => ({
    ...d,
    date: formatDateLabel(d.label),
  }))

  return (
    <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
        セッション推移
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e2e8f0)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--chart-text, #64748b)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--chart-text, #64748b)' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--chart-tooltip-bg, #fff)',
                border: '1px solid var(--chart-tooltip-border, #e2e8f0)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="total"
              name="合計"
              stroke="#3CC8E8"
              fill="#3CC8E8"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="completed"
              name="完了"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// --- Step Funnel Chart ---

interface FunnelStep {
  step: number
  label: string
  count: number
  rate: number
}

interface FunnelChartProps {
  data: FunnelStep[]
}

export function StepFunnelChart({ data }: FunnelChartProps) {
  const COLORS = ['#3CC8E8', '#60a5fa', '#a78bfa', '#f97316']

  return (
    <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
        ステップ到達ファネル
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #e2e8f0)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: 'var(--chart-text, #64748b)' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              dataKey="label"
              type="category"
              tick={{ fontSize: 12, fill: 'var(--chart-text, #64748b)' }}
              tickLine={false}
              axisLine={false}
              width={90}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--chart-tooltip-bg, #fff)',
                border: '1px solid var(--chart-tooltip-border, #e2e8f0)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, _name: string, props: { payload?: FunnelStep }) => [
                `${value}件 (${props.payload?.rate ?? 0}%)`,
                '到達数',
              ]}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={28}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// --- Source Pie Chart ---

interface SourceDistribution {
  public: number
  company_hearing: number
}

interface SourceChartProps {
  data: SourceDistribution
}

export function SourcePieChart({ data }: SourceChartProps) {
  const chartData = [
    { name: 'パブリック', value: data.public, color: '#3CC8E8' },
    { name: '企業ヒアリング', value: data.company_hearing, color: '#f97316' },
  ].filter(d => d.value > 0)

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
          ソース別分布
        </h3>
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-sm text-slate-400">データなし</p>
        </div>
      </div>
    )
  }

  const total = chartData.reduce((s, d) => s + d.value, 0)

  return (
    <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
        ソース別分布
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--chart-tooltip-bg, #fff)',
                border: '1px solid var(--chart-tooltip-border, #e2e8f0)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [
                `${value}件 (${Math.round((value / total) * 100)}%)`,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {chartData.map(d => (
          <div key={d.name} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name}: {d.value}件
          </div>
        ))}
      </div>
    </div>
  )
}

// --- AI Usage Stats ---

interface AiUsageProps {
  totalAiCalls: number
  avgAiCalls: number
  pdfDownloads: number
  avgCompletionMinutes?: number
}

export function AiUsageStats({ totalAiCalls, avgAiCalls, pdfDownloads, avgCompletionMinutes }: AiUsageProps) {
  const items = [
    { label: 'AI総コール数', value: totalAiCalls.toLocaleString(), sub: '生成・修正' },
    { label: '平均AIコール/セッション', value: String(avgAiCalls), sub: '回' },
    { label: 'PDFダウンロード', value: pdfDownloads.toLocaleString(), sub: '件' },
  ]

  if (avgCompletionMinutes !== undefined && avgCompletionMinutes > 0) {
    items.push({
      label: '平均完了時間',
      value: avgCompletionMinutes > 60
        ? `${Math.round(avgCompletionMinutes / 60)}時間${avgCompletionMinutes % 60}分`
        : `${avgCompletionMinutes}分`,
      sub: '開始→完了',
    })
  }

  return (
    <div className="bg-white dark:bg-midnight-800 rounded-xl border border-slate-200 dark:border-midnight-600 p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
        AI利用・実績
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.label} className="text-center p-3 rounded-lg bg-slate-50 dark:bg-midnight-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{item.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{item.value}</p>
            <p className="text-[10px] text-slate-400">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Helpers ---

function formatDateLabel(label: string): string {
  // "2025-01-15" -> "1/15", "2025-01" -> "1月"
  if (label.length === 10) {
    const parts = label.split('-')
    return `${parseInt(parts[1])}/${parseInt(parts[2])}`
  }
  if (label.length === 7) {
    return `${parseInt(label.split('-')[1])}月`
  }
  return label
}
