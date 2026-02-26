'use client';

import { useRouter } from 'next/navigation';
import { useBillStats } from '@/lib/hooks/useTransactions';
import { formatCurrency, formatNumber } from '@/lib/utils/format';
import { Phone, Zap, Tv, RefreshCw, XCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StatsCard from '@/components/dashboard/StatsCard';

export default function BillsPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useBillStats();

  const stats = data?.data;
  const byType = stats?.byType || [];

  const billTypes = [
    {
      title: 'Airtime',
      description: 'View and manage airtime purchases',
      icon: <Phone className="w-6 h-6" />,
      path: '/bills/airtime',
      bgColor: 'bg-purple-100 text-purple-700',
      iconBg: 'bg-purple-600',
      typeKey: 'airtime',
    },
    {
      title: 'Data',
      description: 'View and manage data bundles',
      icon: <Phone className="w-6 h-6" />,
      path: '/bills/data',
      bgColor: 'bg-indigo-100 text-indigo-700',
      iconBg: 'bg-indigo-600',
      typeKey: 'data',
    },
    {
      title: 'Electricity',
      description: 'Manage electricity bill payments',
      icon: <Zap className="w-6 h-6" />,
      path: '/bills/electricity',
      bgColor: 'bg-amber-100 text-amber-700',
      iconBg: 'bg-amber-500',
      typeKey: 'electricity',
    },
    {
      title: 'Cable TV',
      description: 'Manage cable TV subscriptions',
      icon: <Tv className="w-6 h-6" />,
      path: '/bills/cable',
      bgColor: 'bg-violet-100 text-violet-700',
      iconBg: 'bg-violet-600',
      typeKey: 'cable_tv',
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
            Bill Payments
          </h1>
          <p className="text-sm text-slate-500">
            Monitor airtime, data, electricity, and cable bill transactions
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="text-slate-600 shrink-0">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Bill Txns"
            value={stats.summary.totalTransactions}
            subtitle={`${stats.summary.totalSuccessful} successful`}
            icon={<Phone className="h-4 w-4 text-purple-600" />}
            color="text-purple-600 bg-purple-50"
          />
          <StatsCard
            title="Total Revenue"
            value={stats.summary.totalRevenue}
            format="currency"
            icon={<Zap className="h-4 w-4 text-emerald-600" />}
            color="text-emerald-600 bg-emerald-50"
          />
          <StatsCard
            title="Failed Transactions"
            value={stats.summary.totalFailed}
            icon={<XCircle className="h-4 w-4 text-red-600" />}
            color="text-red-600 bg-red-50"
          />
          <StatsCard
            title="Pending Transactions"
            value={stats.summary.totalPending}
            icon={<Clock className="h-4 w-4 text-amber-600" />}
            color="text-amber-600 bg-amber-50"
          />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>Failed to load bill payment statistics. Please try again.</AlertDescription>
        </Alert>
      )}

      <h2 className="text-xl font-semibold text-slate-900 mb-4 mt-8">
        Bill Types
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {billTypes.map((bill) => {
          const typeStats = byType.find((t) => t.type === bill.typeKey);

          return (
            <div
              key={bill.path}
              onClick={() => router.push(bill.path)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="p-6 flex-grow flex flex-col justify-center items-center text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-105 transition-transform ${bill.iconBg}`}>
                  {bill.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{bill.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{bill.description}</p>

                {typeStats && (
                  <div className="w-full mt-auto pt-4 border-t border-slate-100 flex flex-col gap-1.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Total:</span>
                      <span className="font-semibold text-slate-900">{formatNumber(typeStats.totalCount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Successful:</span>
                      <span className="font-semibold text-emerald-600">{formatNumber(typeStats.successCount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Failed:</span>
                      <span className="font-semibold text-red-600">{formatNumber(typeStats.failedCount)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-50">
                      <span className="text-slate-500 font-medium">Volume:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(typeStats.totalAmount)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
