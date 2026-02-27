'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { RefreshCcw, Eye, Copy, Check } from 'lucide-react';
import { useVirtualAccounts } from '@/lib/hooks/useVirtualAccounts';
import StatusBadge from '@/components/shared/StatusBadge';
import ExportButton from '@/components/shared/ExportButton';
import { formatDate } from '@/lib/utils/date';
import { VirtualAccount } from '@/lib/api/virtualAccounts';
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
import { Card, CardContent } from '@/components/ui/card';

export default function VirtualAccountsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 25,
    search: '',
    status: '',
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useVirtualAccounts(filters);

  const handlePageChange = (updaterOrValue: any) => {
    setPagination(updaterOrValue);
    const newPageIndex = typeof updaterOrValue === 'function' ? updaterOrValue(pagination).pageIndex : updaterOrValue.pageIndex;
    setFilters((prev) => ({ ...prev, page: newPageIndex + 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const columns: ColumnDef<VirtualAccount>[] = [
    {
      accessorKey: 'accountName',
      header: 'Account Name',
      cell: ({ row }) => <span className="font-medium text-slate-900">{row.original.accountName}</span>,
    },
    {
      accessorKey: 'accountNumber',
      header: 'Account Number',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono">{row.original.accountNumber}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-slate-600"
            onClick={() => copyToClipboard(row.original.accountNumber, row.original.id)}
            title="Copy Account Number"
          >
            {copiedId === row.original.id ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'bankName',
      header: 'Bank Name',
    },
    {
      accessorKey: 'user',
      header: 'Assigned User',
      cell: ({ row }) => `${row.original.user.firstName} ${row.original.user.lastName}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} type="user" />, // Using 'user' type which maps active->green, inactive/closed->gray, suspended->red usually.
    },
    {
      accessorKey: 'createdAt',
      header: 'Created On',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/users/${row.original.userId}`)}
        >
          <Eye className="w-4 h-4 mr-1" />
          View User
        </Button>
      ),
    },
  ];

  const accounts = data?.data?.accounts || [];
  const paginationData = data?.data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Virtual Accounts</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage Nomba virtual accounts assigned to users
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCcw className="w-4 h-4 text-slate-600" />
          </Button>
          <ExportButton
            data={accounts}
            filename="virtual-accounts"
            columns={[
              { header: 'Account Name', dataKey: 'accountName' },
              { header: 'Account Number', dataKey: 'accountNumber' },
              { header: 'Bank Name', dataKey: 'bankName' },
              { header: 'Status', dataKey: 'status' },
            ]}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm">
          Failed to load virtual accounts. Please try again.
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by account number or name"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
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
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => refetch()} className="w-full sm:w-auto">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={accounts}
        pageCount={paginationData ? Math.ceil(paginationData.totalItems / paginationData.itemsPerPage) : -1}
        pagination={pagination}
        onPaginationChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
