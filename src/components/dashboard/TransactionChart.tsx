import { Card, CardContent } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TransactionChartProps {
  data: Array<{
    date: string;
    deposits: number;
    withdrawals: number;
    transfers: number;
  }>;
  isLoading?: boolean;
}

const COLORS = {
  deposits:    { stroke: '#10B981', fill: '#10B981' },
  withdrawals: { stroke: '#F59E0B', fill: '#F59E0B' },
  transfers:   { stroke: '#7C3AED', fill: '#7C3AED' },
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg p-4 min-w-[170px]">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 mb-1.5 last:mb-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-slate-600">{entry.name}</span>
          </div>
          <span className="text-xs font-semibold text-slate-900">
            ₦{Number(entry.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }: any) {
  return (
    <div className="flex items-center gap-5 justify-end pr-2">
      {payload?.map((entry: any) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span className="w-3 h-[3px] rounded-full inline-block" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-slate-500 font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function TransactionChart({ data, isLoading }: TransactionChartProps) {
  const hasData = data.some(d => d.deposits > 0 || d.withdrawals > 0 || d.transfers > 0);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900 mb-0.5">
              Transaction Activity
            </h3>
            <p className="text-xs text-slate-400">
              Deposits, withdrawals &amp; transfers — completed only
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500">Deposits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-slate-500">Withdrawals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-600" />
              <span className="text-xs text-slate-500">Transfers</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400">Loading chart data…</span>
            </div>
          </div>
        ) : !hasData ? (
          <div className="h-[300px] flex flex-col items-center justify-center gap-2 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-1">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600">No completed transactions this week</p>
            <p className="text-xs text-slate-400">Data will appear once transactions are completed</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  {Object.entries(COLORS).map(([key, { fill }]) => (
                    <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={fill} stopOpacity={0.18} />
                      <stop offset="100%" stopColor={fill} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  dx={-4}
                  width={55}
                  tickFormatter={(v) => {
                    if (v >= 1_000_000) return `₦${(v / 1_000_000).toFixed(1)}M`;
                    if (v >= 1_000) return `₦${(v / 1_000).toFixed(0)}k`;
                    return `₦${v}`;
                  }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
                <Legend content={<CustomLegend />} verticalAlign="bottom" height={32} />
                <Area
                  type="monotone"
                  dataKey="deposits"
                  name="Deposits"
                  stroke={COLORS.deposits.stroke}
                  strokeWidth={2}
                  fill="url(#grad-deposits)"
                  dot={{ r: 3, fill: COLORS.deposits.stroke, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: COLORS.deposits.stroke, strokeWidth: 2, stroke: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="withdrawals"
                  name="Withdrawals"
                  stroke={COLORS.withdrawals.stroke}
                  strokeWidth={2}
                  fill="url(#grad-withdrawals)"
                  dot={{ r: 3, fill: COLORS.withdrawals.stroke, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: COLORS.withdrawals.stroke, strokeWidth: 2, stroke: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="transfers"
                  name="Transfers"
                  stroke={COLORS.transfers.stroke}
                  strokeWidth={2}
                  fill="url(#grad-transfers)"
                  dot={{ r: 3, fill: COLORS.transfers.stroke, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: COLORS.transfers.stroke, strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
