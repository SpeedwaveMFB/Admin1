'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Visibility, Refresh } from '@mui/icons-material';
import { useTransactions, useTransactionStats } from '@/lib/hooks/useTransactions';
import StatusBadge from '@/components/shared/StatusBadge';
import ExportButton from '@/components/shared/ExportButton';
import StatsCard from '@/components/dashboard/StatsCard';
import { formatCurrency } from '@/lib/utils/format';
import { formatDateTime } from '@/lib/utils/date';
import {
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  HourglassEmpty,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

export default function TransactionsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 25,
    type: '',
    status: '',
    userId: '',
    startDate: '',
    endDate: '',
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  const { data, isLoading, error, refetch } = useTransactions(filters);
  const { data: statsData } = useTransactionStats();

  const handlePageChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
    setFilters((prev) => ({ ...prev, page: newModel.page + 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value.replace('_', ' ')}
          size="small"
          color={
            params.value === 'deposit'
              ? 'success'
              : params.value === 'withdrawal'
              ? 'warning'
              : 'primary'
          }
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 140,
      renderCell: (params) => (
        <Typography fontWeight={600}>{formatCurrency(params.value)}</Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusBadge status={params.value} />,
    },
    {
      field: 'userName',
      headerName: 'User',
      flex: 1,
      minWidth: 160,
      valueGetter: (params, row) => row.userName || row.userEmail || 'N/A',
    },
    {
      field: 'reference',
      headerName: 'Reference',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'provider',
      headerName: 'Provider',
      width: 100,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 160,
      valueGetter: (value) => formatDateTime(value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          color="primary"
          onClick={() => router.push(`/transactions/${params.row.id}`)}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  const transactions = data?.data?.transactions || [];
  const pagination = data?.data?.pagination;
  const stats = statsData?.data;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Transactions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and manage all platform transactions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={() => refetch()} color="primary">
            <Refresh />
          </IconButton>
          <ExportButton
            data={transactions}
            filename="transactions"
            columns={[
              { header: 'Type', dataKey: 'type' },
              { header: 'Amount', dataKey: 'amount' },
              { header: 'Status', dataKey: 'status' },
              { header: 'Reference', dataKey: 'reference' },
              { header: 'Date', dataKey: 'createdAt' },
            ]}
          />
        </Box>
      </Box>

      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title="Total Deposits"
              value={stats.totalDeposits}
              icon={<TrendingUp />}
              color="success.main"
              format="currency"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title="Total Withdrawals"
              value={stats.totalWithdrawals}
              icon={<TrendingDown />}
              color="warning.main"
              format="currency"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatsCard
              title="Total Transfers"
              value={stats.totalTransfers}
              icon={<SwapHoriz />}
              color="primary.main"
              format="currency"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Pending"
              value={stats.pendingTransactions}
              icon={<HourglassEmpty />}
              color="warning.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Completed"
              value={stats.completedTransactions}
              icon={<CheckCircle />}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Failed"
              value={stats.failedTransactions}
              icon={<Cancel />}
              color="error.main"
            />
          </Grid>
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load transactions. Please try again.
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Type"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="deposit">Deposit</MenuItem>
              <MenuItem value="withdrawal">Withdrawal</MenuItem>
              <MenuItem value="transfer">Transfer</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="airtime">Airtime</MenuItem>
              <MenuItem value="data">Data</MenuItem>
              <MenuItem value="electricity">Electricity</MenuItem>
              <MenuItem value="cable_tv">Cable TV</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={9}>
            <TextField
              fullWidth
              label="User ID"
              placeholder="Filter by user ID"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              sx={{ height: '56px' }}
              onClick={() => refetch()}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ height: 600 }}>
        <DataGrid
          rows={transactions}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePageChange}
          pageSizeOptions={[10, 25, 50, 100]}
          rowCount={pagination?.totalItems || 0}
          paginationMode="server"
          loading={isLoading}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
}

