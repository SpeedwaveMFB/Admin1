'use client';

import Link from 'next/link';
import {
  UserGroupIcon,
  TradeUpIcon,
  TradeDownIcon,
  Exchange01Icon,
  CheckmarkCircle02Icon,
  HourglassIcon,
  Cancel01Icon,
  UserCheck01Icon,
  UserBlock01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
} from 'hugeicons-react';
import StatsCard from '@/components/dashboard/StatsCard';
import TransactionChart from '@/components/dashboard/TransactionChart';
import { useDashboardStats, useHealthStatus } from '@/lib/hooks/useDashboard';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useMemo, useState } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameWeek, addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: healthData, isLoading: healthLoading } = useHealthStatus();
  const [referenceDate, setReferenceDate] = useState(new Date());

  const currentWeekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });
  const isCurrentWeek = isSameWeek(referenceDate, new Date(), { weekStartsOn: 1 });

  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({
    page: 1,
    limit: 500,
    startDate: format(currentWeekStart, 'yyyy-MM-dd'),
    endDate: format(addDays(currentWeekEnd, 1), 'yyyy-MM-dd'),
  });

  const chartData = useMemo(() => {
    const emptyWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((date) => ({
      date,
      deposits: 0,
      withdrawals: 0,
      transfers: 0,
    }));

    if (!transactionsData?.data?.transactions) return emptyWeek;

    const transactions = transactionsData.data.transactions;
    const daysInWeek = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      return format(d, 'yyyy-MM-dd');
    });

    return daysInWeek.map((date) => {
      const dayTransactions = transactions.filter((t) => {
        if (!t.createdAt || t.status !== 'completed') return false;
        try {
          return format(new Date(t.createdAt), 'yyyy-MM-dd') === date;
        } catch {
          return false;
        }
      });

      const dateObj = new Date(date);
      return {
        date: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        deposits: dayTransactions.filter((t) => t.type === 'deposit').reduce((s, t) => s + t.amount, 0),
        withdrawals: dayTransactions.filter((t) => t.type === 'withdrawal').reduce((s, t) => s + t.amount, 0),
        transfers: dayTransactions
          .filter((t) => t.type === 'transfer' || t.type === 'bank_transfer')
          .reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactionsData, currentWeekStart]);

  const handlePreviousWeek = () => setReferenceDate((p) => subWeeks(p, 1));

  if (statsLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
        <p className="font-medium text-default-500">Loading dashboard…</p>
      </div>
    );
  }

  if (statsError) {
    return (
      <Alert variant="destructive" className="max-w-lg">
        <AlertDescription>Failed to load dashboard data. Please try again.</AlertDescription>
      </Alert>
    );
  }

  const stats = statsData?.data;
  const totalTx = stats?.transactions.total || 0;
  const completedTx = stats?.transactions.completed || 0;
  const successRate = totalTx > 0 ? (completedTx / totalTx) * 100 : 0;
  const totalVolume =
    (stats?.financials.totalDeposits || 0) +
    (stats?.financials.totalWithdrawals || 0) +
    (stats?.financials.totalTransfers || 0);

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Speedwave Admin</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Overview
          </h1>
          <p className="mt-2 text-sm text-default-500">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!healthLoading && healthData?.data && (
            <Badge
              variant="outline"
              className={
                healthData.data.status === 'ok'
                  ? 'border-transparent bg-success-100 text-success-800'
                  : 'border-transparent bg-danger-100 text-danger-800'
              }
            >
              System {healthData.data.status.toUpperCase()}
            </Badge>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href="/users">Users</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/transactions">Transactions</Link>
          </Button>
        </div>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard
          variant="hero"
          tone="violet"
          title="Platform volume"
          value={totalVolume}
          format="currency"
          subtitle="Deposits + withdrawals + transfers"
          icon={<Exchange01Icon size={22} />}
        />
        <StatsCard
          variant="hero"
          tone="emerald"
          title="Active users"
          value={stats?.users.active || 0}
          format="number"
          subtitle={`${stats?.users.total || 0} total registered`}
          icon={<UserGroupIcon size={22} />}
        />
        <StatsCard
          variant="hero"
          tone="sky"
          title="Success rate"
          value={successRate}
          format="percent"
          subtitle={`${completedTx} of ${totalTx} transactions`}
          icon={<CheckmarkCircle02Icon size={22} />}
        />
      </div>

      {/* Chart + user snapshot */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4 min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-foreground">Activity</h2>
            <div className="flex items-center gap-1 rounded-xl border border-default-200 bg-content1 p-1 shadow-sm">
              <Button variant="ghost" size="sm" isIconOnly onPress={handlePreviousWeek}>
                <ArrowLeft01Icon size={16} />
              </Button>
              <span className="flex items-center gap-2 px-2 text-xs font-medium text-default-600">
                <Calendar03Icon size={14} />
                {format(currentWeekStart, 'MMM d')} – {format(currentWeekEnd, 'MMM d')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                isIconOnly
                isDisabled={isCurrentWeek}
                onPress={() => setReferenceDate((p) => addWeeks(p, 1))}
              >
                <ArrowRight01Icon size={16} />
              </Button>
              {!isCurrentWeek && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onPress={() => setReferenceDate(new Date())}
                >
                  Today
                </Button>
              )}
            </div>
          </div>
          <TransactionChart data={chartData} isLoading={transactionsLoading} />
        </div>

        <div className="space-y-4 min-w-0">
          <h2 className="text-lg font-semibold text-foreground">Users</h2>
          <StatsCard
            variant="mini"
            tone="violet"
            title="Verified"
            value={stats?.users.verified || 0}
            icon={<UserCheck01Icon size={18} />}
          />
          <StatsCard
            variant="mini"
            tone="rose"
            title="Suspended"
            value={stats?.users.suspended || 0}
            icon={<UserBlock01Icon size={18} />}
          />
          <StatsCard
            variant="mini"
            tone="emerald"
            title="Active"
            value={stats?.users.active || 0}
            icon={<CheckmarkCircle02Icon size={18} />}
          />
          <div className="rounded-2xl border border-default-200 bg-default-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-default-500">Quick links</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/kyc" className="text-sm font-medium text-primary hover:underline">
                Review KYC queue →
              </Link>
              <Link href="/terminals" className="text-sm font-medium text-primary hover:underline">
                POS terminal requests →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Financial row */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Financials</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatsCard
            title="Deposits"
            value={stats?.financials.totalDeposits || 0}
            format="currency"
            tone="emerald"
            icon={<TradeUpIcon size={20} />}
          />
          <StatsCard
            title="Withdrawals"
            value={stats?.financials.totalWithdrawals || 0}
            format="currency"
            tone="amber"
            icon={<TradeDownIcon size={20} />}
          />
          <StatsCard
            title="Transfers"
            value={stats?.financials.totalTransfers || 0}
            format="currency"
            tone="violet"
            icon={<Exchange01Icon size={20} />}
          />
        </div>
      </div>

      {/* Transaction status */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Transactions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatsCard
            title="Total"
            value={totalTx}
            tone="slate"
            icon={<Exchange01Icon size={18} />}
          />
          <StatsCard
            title="Completed"
            value={completedTx}
            tone="emerald"
            icon={<CheckmarkCircle02Icon size={18} />}
          />
          <StatsCard
            title="Pending"
            value={stats?.transactions.pending || 0}
            tone="amber"
            icon={<HourglassIcon size={18} />}
          />
          <StatsCard
            title="Failed"
            value={stats?.transactions.failed || 0}
            tone="rose"
            icon={<Cancel01Icon size={18} />}
          />
        </div>
      </div>
    </div>
  );
}
