'use client';

import { useState, useMemo } from 'react';
import { useAirtimeBills, useBillStats } from '@/lib/hooks/useTransactions';
import { formatCurrency, formatNumber } from '@/lib/utils/format';
import { formatDateTime } from '@/lib/utils/date';
import StatusBadge from '@/components/shared/StatusBadge';
import StatsCard from '@/components/dashboard/StatsCard';
import ExportButton from '@/components/shared/ExportButton';
import { Phone, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/shared/DataTable';
import { ColumnDef, PaginationState } from '@tanstack/react-table';

export default function BillsAirtimePage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 25,
    status: '',
    telco: '',
    phoneNumber: '',
    userId: '',
    startDate: '',
    endDate: '',
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });

  const { data, isLoading, error, refetch } = useAirtimeBills({
    ...filters,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
  const { data: statsData } = useBillStats();

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'serviceProvider',
        header: 'Telco',
        cell: ({ row }) => <span className="font-medium">{row.getValue('serviceProvider')}</span>,
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => (
          <span className="font-semibold text-slate-900">{formatCurrency(row.getValue('amount'))}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
      },
      {
        id: 'user',
        header: 'User',
        cell: ({ row }) => {
          const user = row.original.user;
          return <span className="text-slate-700">{user ? `${user.firstName} ${user.lastName}` : 'N/A'}</span>;
        },
      },
      {
        accessorKey: 'reference',
        header: 'Reference',
        cell: ({ row }) => <span className="font-mono text-xs text-slate-500">{row.getValue('reference')}</span>,
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => <span className="text-slate-500 whitespace-nowrap">{formatDateTime(row.getValue('createdAt'))}</span>,
      },
    ],
    []
  );

  const transactions = data?.data?.transactions || [];
  const totalItems = data?.data?.pagination?.totalItems || 0;
  const stats = statsData?.data;

  const airtimeStats = stats?.byType?.find((item) => item.type === 'airtime');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
              Airtime Purchases
            </h1>
            <p className="text-sm text-slate-500">
              Manage all airtime bill payments across the platform
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="text-slate-600 shrink-0">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <ExportButton
            data={transactions}
            filename="bills-airtime"
            columns={[
              { header: 'Telco', dataKey: 'serviceProvider' },
              { header: 'Phone Number', dataKey: 'phoneNumber' },
              { header: 'Amount', dataKey: 'amount' },
              { header: 'Status', dataKey: 'status' },
              { header: 'Reference', dataKey: 'reference' },
              { header: 'Date', dataKey: 'createdAt' },
            ]}
          />
        </div>
      </div>

      {airtimeStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Airtime Txns"
            value={airtimeStats.totalCount}
            icon={<Phone className="h-4 w-4 text-blue-600" />}
            color="text-blue-600 bg-blue-50"
          />
          <StatsCard
            title="Successful"
            value={airtimeStats.successCount}
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            color="text-emerald-600 bg-emerald-50"
          />
          <StatsCard
            title="Failed"
            value={airtimeStats.failedCount}
            icon={<XCircle className="h-4 w-4 text-red-600" />}
            color="text-red-600 bg-red-50"
          />
          <StatsCard
            title="Total Amount"
            value={airtimeStats.totalAmount}
            format="currency"
            icon={<Phone className="h-4 w-4 text-blue-600" />}
            color="text-blue-600 bg-blue-50"
          />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>Failed to load airtime transactions. Please try again.</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Status</label>
              <Select
                value={filters.status}
                onValueChange={(val) => handleFilterChange('status', val === 'all' ? '' : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Telco</label>
              <Select
                value={filters.telco}
                onValueChange={(val) => handleFilterChange('telco', val === 'all' ? '' : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Telcos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="MTN">MTN</SelectItem>
                  <SelectItem value="AIRTEL">Airtel</SelectItem>
                  <SelectItem value="GLO">Glo</SelectItem>
                  <SelectItem value="9MOBILE">9mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">Phone Number</label>
              <Input
                placeholder="Filter by phone"
                value={filters.phoneNumber}
                onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
              />
            </div>

            <div className="space-y-1.5 lg:col-span-2">
              <label className="text-xs font-medium text-slate-500">User ID</label>
              <Input
                placeholder="Filter by user ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={() => refetch()} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={transactions}
            pageCount={Math.ceil(totalItems / pagination.pageSize)}
            pagination={pagination}
            onPaginationChange={setPagination}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
