'use client';

import { Grid, Typography, Box, Chip, CircularProgress, Alert } from '@mui/material';
import {
  UserGroupIcon, // People
  TradeUpIcon, // Corrected from TrendingUpIcon
  TradeDownIcon, // Corrected from TrendingDownIcon
  Exchange01Icon, // Corrected from ArrowRightLeftIcon
  CheckmarkCircle02Icon, // CheckCircle
  HourglassIcon, // HourglassEmpty
  Cancel01Icon, // Cancel
  UserCheck01Icon, // Verified User equivalent? Or just CheckCircle
  UserBlock01Icon, // Suspended
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
} from 'hugeicons-react';
import StatsCard from '@/components/dashboard/StatsCard';
import TransactionChart from '@/components/dashboard/TransactionChart';
import { useDashboardStats, useHealthStatus } from '@/lib/hooks/useDashboard';
import { useTransactions } from '@/lib/hooks/useTransactions'; // New hook
import { formatCurrency } from '@/lib/utils/format';
import { useMemo, useState } from 'react'; // For aggregation
import { format, subDays, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameWeek } from 'date-fns';
import { Button, IconButton, Paper } from '@mui/material';

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
  }, [transactionsData]);

  if (statsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (statsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load dashboard data. Please try again.</Alert>
      </Box>
    );
  }

  const stats = statsData?.data;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time overview of your platform
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {!healthLoading && healthData?.data && (
            <Chip
              label={`System ${healthData.data.status.toUpperCase()}`}
              color={healthData.data.status === 'ok' ? 'success' : 'error'}
              size="small"
            />
          )}
        </Box>
      </Box>

      {/* User Stats */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        User Statistics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Users"
            value={stats?.users.total || 0}
            subtitle={`${stats?.users.active || 0} active`}
            icon={<UserGroupIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Users"
            value={stats?.users.active || 0}
            icon={<CheckmarkCircle02Icon />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Suspended Users"
            value={stats?.users.suspended || 0}
            icon={<UserBlock01Icon />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Verified Users"
            value={stats?.users.verified || 0}
            icon={<UserCheck01Icon />}
            color="info.main"
          />
        </Grid>
      </Grid>

      {/* Financial Stats */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Financial Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Deposits"
            value={stats?.financials.totalDeposits || 0}
            icon={<TradeUpIcon />}
            color="success.main"
            format="currency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Withdrawals"
            value={stats?.financials.totalWithdrawals || 0}
            icon={<TradeDownIcon />}
            color="warning.main"
            format="currency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Transfers"
            value={stats?.financials.totalTransfers || 0}
            icon={<Exchange01Icon />}
            color="primary.main"
            format="currency"
          />
        </Grid>
      </Grid>

      {/* Transaction Stats */}
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Transaction Statistics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Transactions"
            value={stats?.transactions.total || 0}
            icon={<Exchange01Icon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Completed"
            value={stats?.transactions.completed || 0}
            icon={<CheckmarkCircle02Icon />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending"
            value={stats?.transactions.pending || 0}
            icon={<HourglassIcon />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Failed"
            value={stats?.transactions.failed || 0}
            icon={<Cancel01Icon />}
            color="error.main"
          />
        </Grid>
      </Grid>

      {/* Transaction Chart */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={600}>
          Transaction Overview
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.paper', p: 0.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <IconButton size="small" onClick={handlePreviousWeek}>
            <ArrowLeft01Icon size={18} />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
            <Calendar03Icon size={16} color="#6B7280" />
            <Typography variant="body2" fontWeight={500}>
              {format(currentWeekStart, 'MMM d')} - {format(currentWeekEnd, 'MMM d, yyyy')}
            </Typography>
          </Box>

          <IconButton size="small" onClick={handleNextWeek} disabled={isCurrentWeek}>
            <ArrowRight01Icon size={18} color={isCurrentWeek ? '#E5E7EB' : 'inherit'} />
          </IconButton>

          {!isCurrentWeek && (
            <Button
              size="small"
              variant="text"
              onClick={handleResetToCurrent}
              sx={{ minWidth: 'auto', ml: 1, textTransform: 'none', fontSize: '0.75rem' }}
            >
              Reset
            </Button>
          )}
        </Box>
      </Box>
      <TransactionChart data={chartData} />
    </Box>
  );
}

