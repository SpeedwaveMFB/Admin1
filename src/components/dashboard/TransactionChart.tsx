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
}

export default function TransactionChart({ data }: TransactionChartProps) {
  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardContent className="p-6 h-full">
        <div className="mb-6">
          <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-1">
            Transaction Activity
          </h3>
          <p className="text-sm text-slate-500">
            Overview of deposits, withdrawals, and transfers over time
          </p>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDeposits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorWithdrawals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTransfers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6B46C1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6B46C1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dx={-10}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                  return value;
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  padding: '12px'
                }}
                formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
                labelStyle={{ color: '#374151', fontWeight: 600, marginBottom: '8px' }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ top: -10, right: 0 }}
              />
              <Area
                type="monotone"
                dataKey="deposits"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDeposits)"
                name="Deposits"
              />
              <Area
                type="monotone"
                dataKey="withdrawals"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorWithdrawals)"
                name="Withdrawals"
              />
              <Area
                type="monotone"
                dataKey="transfers"
                stroke="#6B46C1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTransfers)"
                name="Transfers"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
