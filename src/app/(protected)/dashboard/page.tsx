'use client';

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
import { useTransactions } from '@/lib/hooks/useTransactions'; // New hook
import { useMemo, useState } from 'react'; // For aggregation
import { format, subDays, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameWeek } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: healthData, isLoading: healthLoading } = useHealthStatus();

  const [referenceDate, setReferenceDate] = useState(new Date());

  const currentWeekStart = startOfWeek(referenceDate, { weekStartsOn: 1 }); // Monday
  const currentWeekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 }); // Sunday

  const handlePreviousWeek = () => setReferenceDate(prev => subWeeks(prev, 1));
  const handleNextWeek = () => setReferenceDate(prev => addWeeks(prev, 1));
  const handleResetToCurrent = () => setReferenceDate(new Date());

  const isCurrentWeek = isSameWeek(referenceDate, new Date(), { weekStartsOn: 1 });

  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({
    page: 1,
    limit: 1000, // Increase limit to ensure we get enough data for the week, ideally backend supports date filtering
    startDate: format(currentWeekStart, 'yyyy-MM-dd'),
    endDate: format(currentWeekEnd, 'yyyy-MM-dd'),
  });

  const chartData = useMemo(() => {
    if (!transactionsData?.data?.transactions) return [
      { date: 'Mon', deposits: 0, withdrawals: 0, transfers: 0 },
      { date: 'Tue', deposits: 0, withdrawals: 0, transfers: 0 },
      { date: 'Wed', deposits: 0, withdrawals: 0, transfers: 0 },
      { date: 'Thu', deposits: 0, withdrawals: 0, transfers: 0 },
      { date: 'Fri', deposits: 0, withdrawals: 0, transfers: 0 },
      { date: 'Sat', deposits: 0, withdrawals: 0, transfers: 0 },
      { date: 'Sun', deposits: 0, withdrawals: 0, transfers: 0 },
    ];

    const transactions = transactionsData.data.transactions;

    const daysInWeek = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      return format(d, 'yyyy-MM-dd');
    });

    return daysInWeek.map(date => {
      const dayTransactions = transactions.filter(t =>
        t.createdAt && t.createdAt.startsWith(date) && t.status === 'completed'
      );

      const deposits = dayTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);

      const withdrawals = dayTransactions
        .filter(t => t.type === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0);

      const transfers = dayTransactions
        .filter(t => t.type === 'transfer' || t.type === 'bank_transfer')
        .reduce((sum, t) => sum + t.amount, 0);

      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        date: dayName,
        deposits,
        withdrawals,
        transfers
      };
    });
  }, [transactionsData, currentWeekStart]);

  if (statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="p-4">
        <Alert variant="destructive" className="bg-red-50 text-red-700 border-red-200">
          <AlertDescription>Failed to load dashboard data. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const stats = statsData?.data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time overview of your platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!healthLoading && healthData?.data && (
            <Badge
              variant="outline"
              className={healthData.data.status === 'ok' ? 'bg-green-100 text-green-800 border-transparent font-medium' : 'bg-red-100 text-red-800 border-transparent font-medium'}
            >
              System {healthData.data.status.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>

      {/* User Stats */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          User Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={stats?.users.total || 0}
            subtitle={`${stats?.users.active || 0} active`}
            icon={<UserGroupIcon />}
            color="primary.main"
          />
          <StatsCard
            title="Active Users"
            value={stats?.users.active || 0}
            icon={<CheckmarkCircle02Icon />}
            color="success.main"
          />
          <StatsCard
            title="Suspended Users"
            value={stats?.users.suspended || 0}
            icon={<UserBlock01Icon />}
            color="error.main"
          />
          <StatsCard
            title="Verified Users"
            value={stats?.users.verified || 0}
            icon={<UserCheck01Icon />}
            color="info.main"
          />
        </div>
      </div>

      {/* Financial Stats */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Financial Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Total Deposits"
            value={stats?.financials.totalDeposits || 0}
            icon={<TradeUpIcon />}
            color="success.main"
            format="currency"
          />
          <StatsCard
            title="Total Withdrawals"
            value={stats?.financials.totalWithdrawals || 0}
            icon={<TradeDownIcon />}
            color="warning.main"
            format="currency"
          />
          <StatsCard
            title="Total Transfers"
            value={stats?.financials.totalTransfers || 0}
            icon={<Exchange01Icon />}
            color="primary.main"
            format="currency"
          />
        </div>
      </div>

      {/* Transaction Stats */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Transaction Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Transactions"
            value={stats?.transactions.total || 0}
            icon={<Exchange01Icon />}
            color="primary.main"
          />
          <StatsCard
            title="Completed"
            value={stats?.transactions.completed || 0}
            icon={<CheckmarkCircle02Icon />}
            color="success.main"
          />
          <StatsCard
            title="Pending"
            value={stats?.transactions.pending || 0}
            icon={<HourglassIcon />}
            color="warning.main"
          />
          <StatsCard
            title="Failed"
            value={stats?.transactions.failed || 0}
            icon={<Cancel01Icon />}
            color="error.main"
          />
        </div>
      </div>

      {/* Transaction Chart */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Transaction Overview
          </h2>
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900" onClick={handlePreviousWeek}>
              <ArrowLeft01Icon size={18} />
            </Button>

            <div className="flex items-center gap-2 px-2 text-slate-600">
              <Calendar03Icon size={16} />
              <span className="text-sm font-medium">
                {format(currentWeekStart, 'MMM d')} - {format(currentWeekEnd, 'MMM d, yyyy')}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-slate-900 disabled:opacity-30"
              onClick={handleNextWeek}
              disabled={isCurrentWeek}
            >
              <ArrowRight01Icon size={18} />
            </Button>

            {!isCurrentWeek && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetToCurrent}
                className="ml-1 h-8 px-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
        <TransactionChart data={chartData} />
      </div>
    </div>
  );
}
