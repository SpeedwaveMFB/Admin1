'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { useTransactions, useTransactionStats } from '@/lib/hooks/useTransactions';
import StatusBadge from '@/components/shared/StatusBadge';
import ExportButton from '@/components/shared/ExportButton';
import StatsCard from '@/components/dashboard/StatsCard';
import { formatCurrency } from '@/lib/utils/format';
import { formatDateTime } from '@/lib/utils/date';
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
import { Badge } from '@/components/ui/badge';

import {
  TradeUpIcon,
  TradeDownIcon,
  Exchange01Icon, // SwapHoriz
  HourglassIcon,
  CheckmarkCircle02Icon, // CheckCircle (Completed)
  Cancel01Icon, // Cancel (Failed)
  SmartPhone01Icon, // PhoneAndroid
  Wifi01Icon, // SignalCellularAlt
  Tv01Icon, // Tv
  FlashIcon, // Lightbulb
  BankIcon, // AccountBalance
  ViewIcon, // Visibility
  RefreshIcon,
} from 'hugeicons-react';

type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'bank_transfer' | 'airtime' | 'data' | 'electricity' | 'cable_tv';

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

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const { data, isLoading, error, refetch } = useTransactions(filters);
  const { data: statsData } = useTransactionStats();

  const handlePageChange = (updaterOrValue: any) => {
    setPagination(updaterOrValue);
    const newPageIndex = typeof updaterOrValue === 'function' ? updaterOrValue(pagination).pageIndex : updaterOrValue.pageIndex;
    setFilters((prev) => ({ ...prev, page: newPageIndex + 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const getTransactionTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'airtime': return <SmartPhone01Icon size={14} className="mr-1" />;
      case 'data': return <Wifi01Icon size={14} className="mr-1" />;
      case 'cable_tv': return <Tv01Icon size={14} className="mr-1" />;
      case 'electricity': return <FlashIcon size={14} className="mr-1" />;
      case 'bank_transfer': return <BankIcon size={14} className="mr-1" />;
      case 'transfer': return <Exchange01Icon size={14} className="mr-1" />;
      default: return null;
    }
  };

  const getTransactionTypeColor = (type: TransactionType) => {
    if (type === 'deposit') return 'bg-green-100 text-green-800 border-transparent';
    if (type === 'withdrawal') return 'bg-yellow-100 text-yellow-800 border-transparent';
    return 'bg-slate-100 text-slate-800 border-transparent';
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline" className={`capitalize font-normal ${getTransactionTypeColor(row.original.type as TransactionType)}`}>
          {getTransactionTypeIcon(row.original.type as TransactionType)}
          {row.original.type.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.original.amount)}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'userName',
      header: 'User',
      cell: ({ row }) => row.original.userName || row.original.userEmail || 'N/A',
    },
    {
      accessorKey: 'reference',
      header: 'Reference',
    },
    {
      accessorKey: 'provider',
      header: 'Provider',
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => formatDateTime(row.original.createdAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary hover:bg-primary/10"
          onClick={() => router.push(`/transactions/${row.original.id}`)}
        >
          <ViewIcon size={18} />
        </Button>
      ),
    },
  ];

  const transactions = data?.data?.transactions || [];
  const paginationData = data?.data?.pagination;
  const stats = statsData?.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor and manage all platform transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshIcon size={20} className="text-slate-600" />
          </Button>
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
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Total Deposits"
            value={stats.totalDeposits}
            icon={<TradeUpIcon />}
            color="success.main"
            format="currency"
          />
          <StatsCard
            title="Total Withdrawals"
            value={stats.totalWithdrawals}
            icon={<TradeDownIcon />}
            color="warning.main"
            format="currency"
          />
          <StatsCard
            title="Total Transfers"
            value={stats.totalTransfers}
            icon={<Exchange01Icon />}
            color="primary.main"
            format="currency"
          />
          <StatsCard
            title="Pending"
            value={stats.pendingTransactions}
            icon={<HourglassIcon />}
            color="warning.main"
          />
          <StatsCard
            title="Completed"
            value={stats.completedTransactions}
            icon={<CheckmarkCircle02Icon />}
            color="success.main"
          />
          <StatsCard
            title="Failed"
            value={stats.failedTransactions}
            icon={<Cancel01Icon />}
            color="error.main"
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm">
          Failed to load transactions. Please try again.
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Select
                value={filters.type}
                onValueChange={(val) => handleFilterChange('type', val === 'all' ? '' : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="airtime">Airtime</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="cable_tv">Cable TV</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full"
              />
              <span className="text-xs text-slate-500 mt-1 block">Start Date</span>
            </div>
            <div>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full"
              />
              <span className="text-xs text-slate-500 mt-1 block">End Date</span>
            </div>
            <div className="lg:col-span-3">
              <Input
                placeholder="Filter by User ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Button onClick={() => refetch()} className="w-full h-full min-h-[40px]">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={transactions}
        pageCount={paginationData ? Math.ceil(paginationData.totalItems / paginationData.itemsPerPage) : -1}
        pagination={pagination}
        onPaginationChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}

