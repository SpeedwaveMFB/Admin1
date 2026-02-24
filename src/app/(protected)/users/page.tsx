'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { RefreshCcw, Eye } from 'lucide-react';
import { useUsers, useUpdateUserStatus } from '@/lib/hooks/useUsers';
import StatusBadge from '@/components/shared/StatusBadge';
import ExportButton from '@/components/shared/ExportButton';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { formatCurrency } from '@/lib/utils/format';
import { formatDate } from '@/lib/utils/date';
import { User } from '@/types/user';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function UsersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 25,
    search: '',
    status: '',
    verified: undefined as boolean | undefined,
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    userId: '',
    action: '',
    status: '',
  });

  const { data, isLoading, error, refetch } = useUsers(filters);
  const updateStatusMutation = useUpdateUserStatus();

  const handlePageChange = (updaterOrValue: any) => {
    setPagination(updaterOrValue);
    const newPageIndex = typeof updaterOrValue === 'function' ? updaterOrValue(pagination).pageIndex : updaterOrValue.pageIndex;
    setFilters((prev) => ({ ...prev, page: newPageIndex + 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
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

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'balance',
      header: 'Balance',
      cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.balance)}</span>,
    },
    {
      accessorKey: 'accountStatus',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.accountStatus} type="user" />,
    },
    {
      accessorKey: 'isVerified',
      header: 'Verified',
      cell: ({ row }) => (
        <Badge variant={row.original.isVerified ? 'default' : 'secondary'} className={row.original.isVerified ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
          {row.original.isVerified ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      accessorKey: 'speedwaveId',
      header: 'Speedwave ID',
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/users/${row.original.id}`)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          {row.original.accountStatus === 'active' ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleStatusChange(row.original.id, 'suspended')}
            >
              Suspend
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => handleStatusChange(row.original.id, 'active')}
            >
              Activate
            </Button>
          )}
        </div>
      ),
    },
  ];

  const users = data?.data?.users || [];
  const paginationData = data?.data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Users Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCcw className="w-4 h-4 text-slate-600" />
          </Button>
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
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm">
          Failed to load users. Please try again.
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search by name, email, or Speedwave ID"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select
                value={filters.status}
                onValueChange={(val) => handleFilterChange('status', val === 'all' ? '' : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={filters.verified === undefined ? 'all' : filters.verified.toString()}
                onValueChange={(val) =>
                  handleFilterChange(
                    'verified',
                    val === 'all' ? undefined : val === 'true'
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Verification: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Verification: All</SelectItem>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button onClick={() => refetch()} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={users}
        pageCount={paginationData ? Math.ceil(paginationData.totalItems / paginationData.itemsPerPage) : -1}
        pagination={pagination}
        onPaginationChange={handlePageChange}
        isLoading={isLoading}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={`${confirmDialog.action} User`}
        message={`Are you sure you want to ${confirmDialog.action.toLowerCase()} this user?`}
        onConfirm={confirmStatusChange}
        onCancel={() => setConfirmDialog({ open: false, userId: '', action: '', status: '' })}
        severity={confirmDialog.action === 'Suspend' ? 'warning' : 'info'}
      />
    </div>
  );
}

