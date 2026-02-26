'use client';

import { useState, useMemo } from 'react';
import { usePendingKyc, useAllKyc, useApproveKyc, useRejectKyc, useUserKyc } from '@/lib/hooks/useUsers';
import StatusBadge from '@/components/shared/StatusBadge';
import DocumentViewer from '@/components/kyc/DocumentViewer';
import { formatDateTime } from '@/lib/utils/date';
import { BadgeCheck, RefreshCw, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { DataTable } from '@/components/shared/DataTable';
import { ColumnDef, PaginationState } from '@tanstack/react-table';

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

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const pendingQuery = usePendingKyc({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: filters.search,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const allQuery = useAllKyc({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: filters.search,
    startDate: filters.startDate,
    endDate: filters.endDate,
    status: filters.status as any,
  });

  const isPendingTab = tab === 'pending';
  const activeQuery = isPendingTab ? pendingQuery : allQuery;

  const { data, isLoading, error, refetch } = activeQuery;
  const { mutateAsync: approveKyc, isPending: approving } = useApproveKyc();
  const { mutateAsync: rejectKyc, isPending: rejecting } = useRejectKyc();
  const { data: kycDetail, isLoading: kycDetailLoading } = useUserKyc(selectedUserId || '');

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
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

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: 'Name',
        cell: ({ row }) => (
          <span className="font-medium text-slate-900">
            {row.original.firstName} {row.original.lastName}
          </span>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <span className="text-slate-600">{row.getValue('email')}</span>,
      },
      {
        accessorKey: 'accountStatus',
        header: 'Account',
        cell: ({ row }) => <StatusBadge status={row.getValue('accountStatus')} type="user" />,
      },
      {
        accessorKey: 'kycStatus',
        header: 'KYC Status',
        cell: ({ row }) => {
          const value = (row.getValue('kycStatus') as string) || 'pending';
          return (
            <Badge
              variant="outline"
              className={`capitalize ${value === 'approved'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : value === 'rejected'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
            >
              {value}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Joined',
        cell: ({ row }) => <span className="text-slate-500 whitespace-nowrap">{formatDateTime(row.getValue('createdAt'))}</span>,
      },
      {
        accessorKey: 'kycVerifiedAt',
        header: 'Verified At',
        cell: ({ row }) => <span className="text-slate-500 whitespace-nowrap">{row.getValue('kycVerifiedAt') ? formatDateTime(row.getValue('kycVerifiedAt')) : '—'}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              onClick={() => setSelectedUserId(row.original.id)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {row.original.kycStatus !== 'approved' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                  onClick={() => handleApprove(row.original.id)}
                  disabled={approving}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                  onClick={() => openRejectDialog(row.original.id)}
                  disabled={rejecting}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [approving, rejecting, handleApprove]
  );

  const users = data?.data?.users || [];
  const totalItems = data?.data?.pagination?.totalItems || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <BadgeCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              KYC Verification
            </h1>
            <p className="text-sm text-slate-500">
              Review and approve customer identity documents
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="text-slate-600 shrink-0">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as 'pending' | 'all');
            setFilters((prev) => ({ ...prev, page: 1 }));
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
          }}
          className="w-full"
        >
          <div className="border-b border-slate-100">
            <TabsList className="bg-transparent h-auto p-0">
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-6 py-4 font-medium text-slate-600"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:text-purple-600 rounded-none px-6 py-4 font-medium text-slate-600"
              >
                All
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>Failed to load KYC records. Please try again.</AlertDescription>
              </Alert>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/3 xl:w-1/4 space-y-1">
                <label className="text-xs font-medium text-slate-500 ml-1">Search</label>
                <Input
                  placeholder="Search by name or email"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="bg-white"
                />
              </div>

              {tab === 'all' && (
                <div className="w-full md:w-1/4 xl:w-1/5 space-y-1">
                  <label className="text-xs font-medium text-slate-500 ml-1">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(val) => handleFilterChange('status', val === 'all' ? '' : val)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="w-full md:w-1/4 xl:w-1/5 space-y-1">
                <label className="text-xs font-medium text-slate-500 ml-1">Start Date</label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="bg-white"
                />
              </div>

              <div className="w-full md:w-1/4 xl:w-1/5 space-y-1">
                <label className="text-xs font-medium text-slate-500 ml-1">End Date</label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="bg-white"
                />
              </div>

              <div className="w-full md:w-auto xl:w-32 shrink-0">
                <Button onClick={() => refetch()} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={users}
              pageCount={Math.ceil(totalItems / pagination.pageSize)}
              pagination={pagination}
              onPaginationChange={setPagination}
              isLoading={isLoading}
            />
          </CardContent>
        </Tabs>
      </Card>

      {/* KYC Details Dialog */}
      <Dialog
        open={!!selectedUserId && !rejectDialogOpen}
        onOpenChange={(open) => !open && setSelectedUserId(null)}
      >
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle>KYC Details</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {kycDetailLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : kycDetail?.data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {kycDetail.data.firstName} {kycDetail.data.lastName}
                    </h3>
                    <p className="text-sm text-slate-500">{kycDetail.data.email}</p>
                  </div>
                  <div className="flex sm:justify-end items-start gap-2">
                    <span className="text-sm font-medium text-slate-500 mt-1">Status:</span>
                    <Badge
                      variant="outline"
                      className={`capitalize ${kycDetail.data.kycStatus === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : kycDetail.data.kycStatus === 'rejected'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                    >
                      {kycDetail.data.kycStatus || 'pending'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Joined</p>
                    <p className="text-sm font-semibold text-slate-900">{formatDateTime(kycDetail.data.createdAt)}</p>
                  </div>
                  {kycDetail.data.kycVerifiedAt && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">Verified At</p>
                      <p className="text-sm font-semibold text-slate-900">{formatDateTime(kycDetail.data.kycVerifiedAt)}</p>
                    </div>
                  )}
                  {kycDetail.data.kycNotes && (
                    <div className="sm:col-span-2 mt-2">
                      <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                        <AlertDescription>
                          <span className="font-semibold block mb-1">Notes:</span>
                          {kycDetail.data.kycNotes}
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">KYC Document</h4>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-2">
                    <DocumentViewer documentUrl={kycDetail.data.kycDocumentUrl} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Loading KYC details...</p>
            )}
          </div>
          <DialogFooter className="border-t border-slate-100 pt-4">
            <Button variant="outline" onClick={() => setSelectedUserId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Verification Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle>Reject Verification</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-slate-600">
              Please provide a reason for rejecting this verification. The user will see this message.
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Reason</label>
              <Textarea
                placeholder="E.g. Document is blurry, ID is expired, etc."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="border-t border-slate-100 pt-4">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || rejecting}
            >
              {rejecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
