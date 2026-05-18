'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils/format';

interface TransactionChartProps {
  data: Array<{
    date: string;
    deposits: number;
    withdrawals: number;
    transfers: number;
  }>;
  isLoading?: boolean;
}

const SERIES = [
  { key: 'deposits' as const, label: 'Deposits', fill: '#10b981' },
  { key: 'withdrawals' as const, label: 'Withdrawals', fill: '#f59e0b' },
  { key: 'transfers' as const, label: 'Transfers', fill: '#7c3aed' },
];

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-default-200 bg-content1 px-4 py-3 shadow-lg">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-default-500">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-6 text-sm">
          <span className="flex items-center gap-2 text-default-600">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className="font-semibold text-foreground">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function TransactionChart({ data, isLoading }: TransactionChartProps) {
  const hasData = data.some((d) => d.deposits > 0 || d.withdrawals > 0 || d.transfers > 0);

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-2xl border border-default-200 bg-content1 p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Weekly volume</h3>
          <p className="text-xs text-default-500">Completed transactions by day</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {SERIES.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5 text-xs text-default-600">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.fill }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : !hasData ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-medium text-default-600">No activity this week</p>
          <p className="text-xs text-default-400">Chart updates when transactions complete</p>
        </div>
      ) : (
        <div className="min-h-[260px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4} barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-default-200))" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={48}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickFormatter={(v) => {
                  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
                  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
                  return String(v);
                }}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.06)' }} />
              {SERIES.map((s) => (
                <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.fill} radius={[6, 6, 0, 0]} maxBarSize={28} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
