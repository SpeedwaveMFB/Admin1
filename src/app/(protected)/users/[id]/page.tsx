'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useUpdateUserStatus } from '@/lib/hooks/useUsers';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { formatCurrency } from '@/lib/utils/format';
import { formatDateTime } from '@/lib/utils/date';
import StatusBadge from '@/components/shared/StatusBadge';
import { ArrowLeft, Edit2, Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/shared/DataTable';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { usersApi } from '@/lib/api/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: '',
    status: '',
  });

  const { data: userData, isLoading, error } = useUser(userId);
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({ userId, limit: 10 });
  const updateStatusMutation = useUpdateUserStatus();
  const queryClient = useQueryClient();

  const [editSpeedTag, setEditSpeedTag] = useState({
    open: false,
    value: '',
    loading: false,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const updateSpeedTagMutation = useMutation({
    mutationFn: (newTag: string) => usersApi.updateSpeedTag(userId, newTag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      setEditSpeedTag((prev) => ({ ...prev, open: false, loading: false }));
    },
    onError: () => {
      setEditSpeedTag((prev) => ({ ...prev, loading: false }));
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

  const transactionColumns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.getValue('type') as string;
          return <Badge variant="outline" className="capitalize">{type.replace('_', ' ')}</Badge>;
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('amount'));
          return <span className="font-medium text-slate-900">{formatCurrency(amount)}</span>;
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
      },
      {
        accessorKey: 'reference',
        header: 'Reference',
        cell: ({ row }) => <span className="text-slate-600 font-mono text-xs">{row.getValue('reference')}</span>,
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => <span className="text-slate-500 whitespace-nowrap">{formatDateTime(row.getValue('createdAt'))}</span>,
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>Failed to load user details. Please try again.</AlertDescription>
        </Alert>
        <Button variant="ghost" onClick={() => router.push('/users')} className="text-slate-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>
    );
  }

  const renderField = (label: string, value: any) => (
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <div className="font-semibold text-slate-900">{value || 'N/A'}</div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <Button variant="ghost" onClick={() => router.push('/users')} className="-ml-3 text-slate-600">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Button>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
            User Details
          </h1>
          <p className="text-sm text-slate-500">
            View and manage user profile and activity
          </p>
        </div>
        <div className="flex gap-3">
          {user.accountStatus === 'active' ? (
            <Button variant="destructive" onClick={() => handleStatusChange('suspended')}>
              Suspend Account
            </Button>
          ) : (
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleStatusChange('active')}>
              Activate Account
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-slate-200 h-full">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800">
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                {renderField('Name', `${user.firstName} ${user.lastName}`)}
                {renderField('Email', user.email)}
                {renderField('Phone Number', user.phoneNumber)}

                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Speedwave ID</p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{user.speedwaveId || 'N/A'}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      onClick={() => setEditSpeedTag({ open: true, value: user.speedwaveId || '', loading: false })}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Account Status</p>
                  <StatusBadge status={user.accountStatus} type="user" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Verification Status</p>
                  <Badge variant={user.isVerified ? 'default' : 'secondary'} className={user.isVerified ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none' : ''}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>

                {renderField('Member Since', formatDateTime(user.createdAt))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm border-none bg-gradient-to-br from-purple-600 to-violet-600 text-white">
            <CardContent className="pt-6 pb-6">
              <p className="text-purple-100 text-sm font-medium mb-1">
                Account Balance
              </p>
              <h3 className="text-4xl font-bold tracking-tight">
                {formatCurrency(user.balance)}
              </h3>
            </CardContent>
          </Card>

          {user.virtualAccount && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-3 pt-4">
                <CardTitle className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  Virtual Account
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-2xl font-bold text-slate-900 tracking-tight">
                  {user.virtualAccount.accountNumber}
                </p>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  {user.virtualAccount.bankName}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <Tabs defaultValue="transactions" className="w-full">
          <CardHeader className="border-b border-slate-100 p-0">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-none">
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-6 py-4 font-medium text-slate-600 hover:text-slate-900"
              >
                Recent Transactions
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-6 py-4 font-medium text-slate-600 hover:text-slate-900"
              >
                Activity
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="p-0">
            <TabsContent value="transactions" className="m-0 border-none outline-none">
              <div className="p-4 sm:p-6">
                <DataTable
                  columns={transactionColumns}
                  data={transactions}
                  pageCount={Math.ceil((transactionsData?.data?.pagination?.totalItems || 0) / pagination.pageSize)}
                  pagination={pagination}
                  onPaginationChange={setPagination}
                  isLoading={transactionsLoading}
                />
              </div>
            </TabsContent>
            <TabsContent value="activity" className="m-0 border-none outline-none">
              <div className="p-8 text-center">
                <p className="text-slate-500">
                  Activity history coming soon...
                </p>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, action: '', status: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.action} User</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600">
              Are you sure you want to <strong className="text-slate-900">{confirmDialog.action.toLowerCase()}</strong> this user account?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, action: '', status: '' })}>
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === 'Suspend' ? 'destructive' : 'default'}
              className={confirmDialog.action !== 'Suspend' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              onClick={confirmStatusChange}
            >
              {confirmDialog.action} Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editSpeedTag.open} onOpenChange={(open) => !open && setEditSpeedTag({ ...editSpeedTag, open: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Speed Tag</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Alert className="bg-amber-50 text-amber-800 border-amber-200">
              <AlertDescription>
                Warning: This is intended to be permanent. Only change if necessary.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="speedwaveId">Speedwave ID</Label>
              <Input
                id="speedwaveId"
                value={editSpeedTag.value}
                onChange={(e) => setEditSpeedTag({ ...editSpeedTag, value: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSpeedTag({ ...editSpeedTag, open: false })}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSpeedTag} disabled={editSpeedTag.loading}>
              {editSpeedTag.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
