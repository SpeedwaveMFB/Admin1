'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useUser, useUpdateUserStatus } from '@/lib/hooks/useUsers';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { formatCurrency } from '@/lib/utils/format';
import { formatDateTime } from '@/lib/utils/date';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Edit } from '@mui/icons-material';
import { usersApi } from '@/lib/api/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [tabValue, setTabValue] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: '',
    status: '',
  });

  const { data: userData, isLoading, error } = useUser(userId);
  const { data: transactionsData } = useTransactions({ userId, limit: 20 });
  const updateStatusMutation = useUpdateUserStatus();
  const queryClient = useQueryClient();

  const [editSpeedTag, setEditSpeedTag] = useState({
    open: false,
    value: '',
    loading: false,
  });

  const updateSpeedTagMutation = useMutation({
    mutationFn: (newTag: string) => usersApi.updateSpeedTag(userId, newTag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      setEditSpeedTag((prev) => ({ ...prev, open: false, loading: false }));
    },
    onError: () => {
      setEditSpeedTag((prev) => ({ ...prev, loading: false }));
      // Error handling logic if needed
    },
  });

  const handleUpdateSpeedTag = async () => {
    if (!editSpeedTag.value) return;
    setEditSpeedTag((prev) => ({ ...prev, loading: true }));
    try {
      await updateSpeedTagMutation.mutateAsync(editSpeedTag.value);
    } catch (error) {
      console.error('Failed to update speed tag:', error);
    }
  };

  const user = userData?.data;
  const transactions = transactionsData?.data?.transactions || [];

  const handleStatusChange = (newStatus: string) => {
    setConfirmDialog({
      open: true,
      action: newStatus === 'suspended' ? 'Suspend' : 'Activate',
      status: newStatus,
    });
  };

  const confirmStatusChange = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        id: userId,
        status: confirmDialog.status,
      });
      setConfirmDialog({ open: false, action: '', status: '' });
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const transactionColumns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} size="small" sx={{ textTransform: 'capitalize' }} />
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 140,
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusBadge status={params.value} />,
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
      width: 160,
      valueGetter: (value) => formatDateTime(value),
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box>
        <Alert severity="error">Failed to load user details. Please try again.</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => router.push('/users')} sx={{ mt: 2 }}>
          Back to Users
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => router.push('/users')} sx={{ mb: 3 }}>
        Back to Users
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          User Details
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {user.accountStatus === 'active' ? (
            <Button variant="outlined" color="error" onClick={() => handleStatusChange('suspended')}>
              Suspend Account
            </Button>
          ) : (
            <Button variant="outlined" color="success" onClick={() => handleStatusChange('active')}>
              Activate Account
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Profile Information
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {user.firstName} {user.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {user.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {user.phoneNumber || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Speedwave ID
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" fontWeight={600}>
                    {user.speedwaveId || 'N/A'}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => setEditSpeedTag({ open: true, value: user.speedwaveId || '', loading: false })}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    Edit
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Account Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <StatusBadge status={user.accountStatus} type="user" />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Verification Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={user.isVerified ? 'Verified' : 'Unverified'}
                    size="small"
                    color={user.isVerified ? 'success' : 'default'}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatDateTime(user.createdAt)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2, bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Account Balance
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                {formatCurrency(user.balance)}
              </Typography>
            </CardContent>
          </Card>

          {user.virtualAccount && (
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Virtual Account
                </Typography>
                <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>
                  {user.virtualAccount.accountNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {user.virtualAccount.bankName}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Paper>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Recent Transactions" />
          <Tab label="Activity" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <DataGrid
            rows={transactions}
            columns={transactionColumns}
            autoHeight
            pageSizeOptions={[10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="body2" color="text.secondary">
            Activity history coming soon...
          </Typography>
        </TabPanel>
      </Paper>

      <ConfirmDialog
        open={confirmDialog.open}
        title={`${confirmDialog.action} User`}
        message={`Are you sure you want to ${confirmDialog.action.toLowerCase()} this user account?`}
        onConfirm={confirmStatusChange}
        onCancel={() => setConfirmDialog({ open: false, action: '', status: '' })}
        severity={confirmDialog.action === 'Suspend' ? 'warning' : 'info'}
      />
      <Dialog open={editSpeedTag.open} onClose={() => setEditSpeedTag({ ...editSpeedTag, open: false })}>
        <DialogTitle>Edit Speed Tag</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            Warning: This is intended to be permanent. Only change if necessary.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Speedwave ID"
            fullWidth
            variant="outlined"
            value={editSpeedTag.value}
            onChange={(e) => setEditSpeedTag({ ...editSpeedTag, value: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSpeedTag({ ...editSpeedTag, open: false })}>Cancel</Button>
          <Button onClick={handleUpdateSpeedTag} disabled={editSpeedTag.loading}>
            {editSpeedTag.loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

