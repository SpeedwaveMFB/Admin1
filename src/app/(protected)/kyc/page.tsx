'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Button,
  Grid,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Verified, Refresh, Visibility } from '@mui/icons-material';
import { usePendingKyc, useAllKyc, useApproveKyc, useRejectKyc, useUserKyc } from '@/lib/hooks/useUsers';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDateTime } from '@/lib/utils/date';
import { formatCurrency } from '@/lib/utils/format';

export default function KYCPage() {
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 25,
    search: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const pendingQuery = usePendingKyc({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const allQuery = useAllKyc({
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
    startDate: filters.startDate,
    endDate: filters.endDate,
    status: filters.status as any,
  });

  const isPendingTab = tab === 'pending';
  const activeQuery = isPendingTab ? pendingQuery : allQuery;

  const { data, isLoading, error, refetch } = activeQuery;
  const { mutateAsync: approveKyc, isLoading: approving } = useApproveKyc();
  const { mutateAsync: rejectKyc, isLoading: rejecting } = useRejectKyc();
  const { data: kycDetail } = useUserKyc(selectedUserId || '');

  const handlePageChange = (newModel: GridPaginationModel) => {
    setPaginationModel(newModel);
    setFilters((prev) => ({ ...prev, page: newModel.page + 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const openRejectDialog = (userId: string) => {
    setSelectedUserId(userId);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const handleReject = async () => {
    if (!selectedUserId || !rejectReason.trim()) return;
    await rejectKyc({ userId: selectedUserId, reason: rejectReason.trim() });
    setRejectDialogOpen(false);
  };

  const handleApprove = async (userId: string) => {
    await approveKyc(userId);
  };

  const columns: GridColDef[] = [
    {
      field: 'fullName',
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
      field: 'accountStatus',
      headerName: 'Account',
      width: 120,
      renderCell: (params) => <StatusBadge status={params.value} type="user" />,
    },
    {
      field: 'kycStatus',
      headerName: 'KYC Status',
      width: 130,
      renderCell: (params) => {
        const value = params.value || 'pending';
        const color =
          value === 'approved' ? 'success' : value === 'rejected' ? 'error' : 'warning';
        return <Chip label={value} color={color} size="small" sx={{ textTransform: 'capitalize' }} />;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 160,
      valueGetter: (value) => formatDateTime(value),
    },
    {
      field: 'kycVerifiedAt',
      headerName: 'Verified At',
      width: 170,
      valueGetter: (value) => (value ? formatDateTime(value) : '—'),
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
          }}
        >
          <IconButton
            size="small"
            color="primary"
            onClick={() => setSelectedUserId(params.row.id)}
          >
            <Visibility />
          </IconButton>
          {params.row.kycStatus !== 'approved' && (
            <>
              <Button
                size="small"
                variant="outlined"
                color="success"
                sx={{ borderRadius: 999, px: 2.5, textTransform: 'none', fontWeight: 500 }}
                onClick={() => handleApprove(params.row.id)}
                disabled={approving}
              >
                Approve
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                sx={{ borderRadius: 999, px: 2.5, textTransform: 'none', fontWeight: 500 }}
                onClick={() => openRejectDialog(params.row.id)}
                disabled={rejecting}
              >
                Reject
              </Button>
            </>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Verified />
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              KYC Verification
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review and approve customer identity documents
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={() => refetch()} color="primary">
          <Refresh />
        </IconButton>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, value) => {
            setTab(value);
            setFilters((prev) => ({ ...prev, page: 1 }));
            setPaginationModel({ page: 0, pageSize: prev.pageSize || 25 } as GridPaginationModel);
          }}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="pending" label="Pending" />
          <Tab value="all" label="All" />
        </Tabs>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load KYC records. Please try again.
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Search by name or email"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </Grid>
          {tab === 'all' && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="KYC Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={tab === 'all' ? 2 : 3}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={tab === 'all' ? 2 : 3}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
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
          getRowId={(row) => row.id}
        />
      </Paper>

      <Dialog
        open={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>KYC Details</DialogTitle>
        <DialogContent dividers>
          {kycDetail?.data ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {kycDetail.data.firstName} {kycDetail.data.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {kycDetail.data.email}
              </Typography>
              <Typography variant="body2">
                Status:{' '}
                <Chip
                  label={kycDetail.data.kycStatus || 'pending'}
                  size="small"
                  sx={{ textTransform: 'capitalize', ml: 1 }}
                />
              </Typography>
              <Typography variant="body2">
                Joined: {formatDateTime(kycDetail.data.createdAt)}
              </Typography>
              {kycDetail.data.kycVerifiedAt && (
                <Typography variant="body2">
                  Verified At: {formatDateTime(kycDetail.data.kycVerifiedAt)}
                </Typography>
              )}
              {kycDetail.data.kycNotes && (
                <Typography variant="body2" color="error.main">
                  Notes: {kycDetail.data.kycNotes}
                </Typography>
              )}
              {kycDetail.data.kycDocumentUrl && (
                <Typography variant="body2">
                  Document:{' '}
                  <MuiLink
                    href={kycDetail.data.kycDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View uploaded document
                  </MuiLink>
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Loading KYC details...
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUserId(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Verification</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please provide a reason for rejecting this verification. The user will see this message.
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleReject}
            disabled={!rejectReason.trim() || rejecting}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

