'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Grid,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Tv, Refresh } from '@mui/icons-material';
import { useCableBills, useBillStats } from '@/lib/hooks/useTransactions';
import { formatCurrency } from '@/lib/utils/format';
import { formatDateTime } from '@/lib/utils/date';
import StatusBadge from '@/components/shared/StatusBadge';
import StatsCard from '@/components/dashboard/StatsCard';
import ExportButton from '@/components/shared/ExportButton';

export default function BillsCablePage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 25,
    status: '',
    provider: '',
    smartcardNumber: '',
    userId: '',
    startDate: '',
    endDate: '',
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  const { data, isLoading, error, refetch } = useCableBills(filters);
  const { data: statsData } = useBillStats();

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
      field: 'serviceProvider',
      headerName: 'Provider',
      width: 150,
    },
    {
      field: 'planName',
      headerName: 'Plan',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'smartcardNumber',
      headerName: 'Smartcard Number',
      width: 170,
    },
    {
      field: 'customerName',
      headerName: 'Customer Name',
      flex: 1,
      minWidth: 160,
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
      field: 'user',
      headerName: 'User',
      flex: 1,
      minWidth: 180,
      valueGetter: (params, row) =>
        row.user ? `${row.user.firstName} ${row.user.lastName}` : 'N/A',
    },
    {
      field: 'reference',
      headerName: 'Reference',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 170,
      valueGetter: (value) => formatDateTime(value),
    },
  ];

  const transactions = data?.data?.transactions || [];
  const pagination = data?.data?.pagination;
  const stats = statsData?.data;

  const cableStats = stats?.byType?.find((item) => item.type === 'cable_tv');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tv />
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Cable TV Subscriptions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all cable TV subscriptions across the platform
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={() => refetch()} color="primary">
            <Refresh />
          </IconButton>
          <ExportButton
            data={transactions}
            filename="bills-cable"
            columns={[
              { header: 'Provider', dataKey: 'serviceProvider' },
              { header: 'Plan', dataKey: 'planName' },
              { header: 'Smartcard Number', dataKey: 'smartcardNumber' },
              { header: 'Customer Name', dataKey: 'customerName' },
              { header: 'Amount', dataKey: 'amount' },
              { header: 'Status', dataKey: 'status' },
              { header: 'Reference', dataKey: 'reference' },
              { header: 'Date', dataKey: 'createdAt' },
            ]}
          />
        </Box>
      </Box>

      {cableStats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Cable Txns"
              value={cableStats.totalCount}
              icon={<Tv />}
              color="secondary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Successful"
              value={cableStats.successCount}
              icon={<Chip color="success" size="small" label="OK" />}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Failed"
              value={cableStats.failedCount}
              icon={<Chip color="error" size="small" label="X" />}
              color="error.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Amount"
              value={cableStats.totalAmount}
              icon={<Tv />}
              color="secondary.main"
              format="currency"
            />
          </Grid>
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load cable TV transactions. Please try again.
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
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
              label="Provider"
              value={filters.provider}
              onChange={(e) => handleFilterChange('provider', e.target.value)}
              placeholder="e.g. DSTV, GOTV"
            />
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
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Smartcard Number"
              value={filters.smartcardNumber}
              onChange={(e) => handleFilterChange('smartcardNumber', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
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
          getRowId={(row) => row.id}
        />
      </Paper>
    </Box>
  );
}

