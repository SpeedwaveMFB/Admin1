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
import { useUsers, useUpdateUserStatus } from '@/lib/hooks/useUsers';
import StatusBadge from '@/components/shared/StatusBadge';
import ExportButton from '@/components/shared/ExportButton';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { formatCurrency } from '@/lib/utils/format';
import { formatDate } from '@/lib/utils/date';
import { User } from '@/types/user';

export default function UsersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 25,
    search: '',
    status: '',
    verified: undefined as boolean | undefined,
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string;
    action: string;
    status: string;
  }>({
    open: false,
    userId: '',
    action: '',
    status: '',
  });

  const { data, isLoading, error, refetch } = useUsers(filters);
  const updateStatusMutation = useUpdateUserStatus();

  const handlePageChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
    setFilters((prev) => ({ ...prev, page: newModel.page + 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    setConfirmDialog({
      open: true,
      userId,
      action: newStatus === 'suspended' ? 'Suspend' : 'Activate',
      status: newStatus,
    });
  };

  const confirmStatusChange = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        id: confirmDialog.userId,
        status: confirmDialog.status,
      });
      setConfirmDialog({ open: false, userId: '', action: '', status: '' });
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 180,
      valueGetter: (params, row) => `${row.firstName} ${row.lastName}`,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'balance',
      headerName: 'Balance',
      width: 140,
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: 'accountStatus',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusBadge status={params.value} type="user" />,
    },
    {
      field: 'isVerified',
      headerName: 'Verified',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Yes' : 'No'}
          size="small"
          color={params.value ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'speedwaveId',
      headerName: 'Speedwave ID',
      width: 140,
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 120,
      valueGetter: (value) => formatDate(value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            mx: 'auto',
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility />}
            sx={{
              borderRadius: 999,
              px: 2.5,
              textTransform: 'none',
              fontWeight: 500,
            }}
            onClick={() => router.push(`/users/${params.row.id}`)}
          >
            View
          </Button>
          {params.row.accountStatus === 'active' ? (
            <Button
              size="small"
              variant="outlined"
              color="error"
              sx={{
                borderRadius: 999,
                px: 2.5,
                textTransform: 'none',
                fontWeight: 500,
                borderColor: 'error.main',
              }}
              onClick={() => handleStatusChange(params.row.id, 'suspended')}
            >
              Suspend
            </Button>
          ) : (
            <Button
              size="small"
              variant="outlined"
              color="success"
              sx={{
                borderRadius: 999,
                px: 2.5,
                textTransform: 'none',
                fontWeight: 500,
                borderColor: 'success.main',
              }}
              onClick={() => handleStatusChange(params.row.id, 'active')}
            >
              Activate
            </Button>
          )}
        </Box>
      ),
      align: 'center',
      headerAlign: 'center',
    },
  ];

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Users Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage user accounts and permissions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={() => refetch()} color="primary">
            <Refresh />
          </IconButton>
          <ExportButton
            data={users}
            filename="users"
            columns={[
              { header: 'Name', dataKey: 'name' },
              { header: 'Email', dataKey: 'email' },
              { header: 'Balance', dataKey: 'balance' },
              { header: 'Status', dataKey: 'accountStatus' },
            ]}
          />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load users. Please try again.
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Search by name, email, or Speedwave ID"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
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
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Verification"
              value={filters.verified === undefined ? '' : filters.verified.toString()}
              onChange={(e) =>
                handleFilterChange(
                  'verified',
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Verified</MenuItem>
              <MenuItem value="false">Unverified</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
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
          rows={users}
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

      <ConfirmDialog
        open={confirmDialog.open}
        title={`${confirmDialog.action} User`}
        message={`Are you sure you want to ${confirmDialog.action.toLowerCase()} this user?`}
        onConfirm={confirmStatusChange}
        onCancel={() => setConfirmDialog({ open: false, userId: '', action: '', status: '' })}
        severity={confirmDialog.action === 'Suspend' ? 'warning' : 'info'}
      />
    </Box>
  );
}

