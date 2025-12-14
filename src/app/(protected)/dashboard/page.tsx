'use client';

import { Grid, Typography, Box, Chip, CircularProgress, Alert } from '@mui/material';
import {
  People,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  CheckCircle,
  HourglassEmpty,
  Cancel,
} from '@mui/icons-material';
import StatsCard from '@/components/dashboard/StatsCard';
import TransactionChart from '@/components/dashboard/TransactionChart';
import { useDashboardStats, useHealthStatus } from '@/lib/hooks/useDashboard';
import { formatCurrency } from '@/lib/utils/format';

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: healthData, isLoading: healthLoading } = useHealthStatus();

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

  // Mock chart data - in production, this would come from an API endpoint
  const chartData = [
    { date: 'Mon', deposits: 150000, withdrawals: 80000, transfers: 120000 },
    { date: 'Tue', deposits: 200000, withdrawals: 120000, transfers: 150000 },
    { date: 'Wed', deposits: 180000, withdrawals: 100000, transfers: 130000 },
    { date: 'Thu', deposits: 220000, withdrawals: 140000, transfers: 160000 },
    { date: 'Fri', deposits: 250000, withdrawals: 160000, transfers: 180000 },
    { date: 'Sat', deposits: 190000, withdrawals: 110000, transfers: 140000 },
    { date: 'Sun', deposits: 170000, withdrawals: 90000, transfers: 110000 },
  ];

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
            icon={<People />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Users"
            value={stats?.users.active || 0}
            icon={<CheckCircle />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Suspended Users"
            value={stats?.users.suspended || 0}
            icon={<Cancel />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Verified Users"
            value={stats?.users.verified || 0}
            icon={<CheckCircle />}
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
            icon={<TrendingUp />}
            color="success.main"
            format="currency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Withdrawals"
            value={stats?.financials.totalWithdrawals || 0}
            icon={<TrendingDown />}
            color="warning.main"
            format="currency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Total Transfers"
            value={stats?.financials.totalTransfers || 0}
            icon={<SwapHoriz />}
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
            icon={<SwapHoriz />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Completed"
            value={stats?.transactions.completed || 0}
            icon={<CheckCircle />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending"
            value={stats?.transactions.pending || 0}
            icon={<HourglassEmpty />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Failed"
            value={stats?.transactions.failed || 0}
            icon={<Cancel />}
            color="error.main"
          />
        </Grid>
      </Grid>

      {/* Transaction Chart */}
      <TransactionChart data={chartData} />
    </Box>
  );
}

