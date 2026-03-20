'use client';

import { useState } from 'react';
import { useFees, useUpdateFee } from '@/lib/hooks/useFees';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, RefreshCcw, Edit2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FeeManagementPage() {
  const router = useRouter();
  const { data: feesData, isLoading, refetch } = useFees();
  const updateFeeMutation = useUpdateFee();

  const sanitizeString = (value: any): string => {
    if (value === undefined || value === null) return '';
    const str = String(value);
    const normalized = str.trim().toLowerCase();
    if (normalized === 'undefined' || normalized === 'null' || normalized === 'nan') return '';
    return str;
  };

  const getFeeTransactionTypeKey = (fee: any): string => {
    const candidate = sanitizeString(fee?.type ?? fee?.transactionType ?? fee?.serviceType ?? fee?.key ?? '');
    return candidate || 'Unknown';
  };

  const getFeeDisplayName = (fee: any): string => {
    const candidate = sanitizeString(
      fee?.name ??
        fee?.label ??
        fee?.feeName ??
        fee?.fee_name ??
        fee?.serviceName ??
        fee?.transactionName ??
        fee?.transaction_name ??
        fee?.title ??
        fee?.description ??
        getFeeTransactionTypeKey(fee) ??
        'Fee',
    );
    return candidate || 'Fee';
  };

  const normalizeFeeKind = (fee: any): 'flat' | 'percentage' => {
    const rawKind = sanitizeString(fee?.feeType ?? fee?.fee_type ?? fee?.kind ?? fee?.rateType);
    if (rawKind === 'percentage' || rawKind === 'flat') return rawKind;

    const hasPercentage =
      sanitizeString(fee?.percentageValue) !== '' ||
      sanitizeString(fee?.percentage_value) !== '' ||
      sanitizeString(fee?.percentage_fee) !== '' ||
      sanitizeString(fee?.percentage) !== '';
    const hasFlat =
      sanitizeString(fee?.flatValue) !== '' ||
      sanitizeString(fee?.flat_value) !== '' ||
      sanitizeString(fee?.flat_fee) !== '' ||
      sanitizeString(fee?.flat) !== '';

    if (hasPercentage && !hasFlat) return 'percentage';
    return 'flat';
  };

  const normalizeFeeValue = (fee: any): number => {
    const value =
      fee?.value ??
      fee?.feeValue ??
      fee?.fee_value ??
      fee?.amount ??
      fee?.rate ??
      fee?.flatValue ??
      fee?.flat_value ??
      fee?.percentageValue ??
      fee?.percentage_value;

    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    return Number.isFinite(parsed) ? (parsed as number) : 0;
  };

  const [editFee, setEditFee] = useState({
    open: false,
    loading: false,
    type: '',
    name: '',
    data: {
      feeType: 'flat' as 'flat' | 'percentage',
      value: 0,
    }
  });

  const handleEdit = (fee: any) => {
    const txType = getFeeTransactionTypeKey(fee);
    const feeKind = normalizeFeeKind(fee);
    setEditFee({
      open: true,
      loading: false,
      type: txType,
      name: getFeeDisplayName(fee),
      data: {
        feeType: feeKind,
        value: normalizeFeeValue(fee),
      }
    });
  };

  const handleSubmit = async () => {
    setEditFee(prev => ({ ...prev, loading: true }));
    try {
      await updateFeeMutation.mutateAsync({
        type: editFee.type,
        data: editFee.data
      });
      setEditFee(prev => ({ ...prev, open: false, loading: false }));
    } catch (error) {
      setEditFee(prev => ({ ...prev, loading: false }));
    }
  };

  const fees: any[] = Array.isArray(feesData?.data)
    ? feesData.data
    : (feesData?.data as any)?.fees ?? [];

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/settings')} className="-ml-3 text-slate-600">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Settings
      </Button>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
            Fee Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage dynamic transaction fees for all services
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse h-32" />
          ))
        ) : (
          fees.map((fee: any, i: number) => {
            const feeKind = normalizeFeeKind(fee);
            const feeValue = normalizeFeeValue(fee);
            const txType = getFeeTransactionTypeKey(fee);
            const feeKey = fee?.id ?? fee?._id ?? txType ?? i;

            return (
            <Card key={feeKey} className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      {getFeeDisplayName(fee)}
                    </CardTitle>
                    <CardDescription className="text-xs uppercase font-medium">
                      {txType?.replace('_', ' ') || txType}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-600" onClick={() => handleEdit(fee)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {feeKind === 'percentage' ? `${feeValue}%` : `₦${feeValue}`}
                  </span>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium capitalize">
                    {feeKind}
                  </span>
                </div>
              </CardContent>
            </Card>
            );
          })
        )}
      </div>

      <Dialog open={editFee.open} onOpenChange={(open) => !open && setEditFee({ ...editFee, open: false })}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Fee: {editFee.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Fee Type</Label>
              <Select 
                value={editFee.data.feeType} 
                onValueChange={(val: any) => setEditFee({ ...editFee, data: { ...editFee.data, feeType: val } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat Amount (₦)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input 
                type="number" 
                value={editFee.data.value} 
                onChange={(e) => setEditFee({ ...editFee, data: { ...editFee.data, value: parseFloat(e.target.value) } })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFee({ ...editFee, open: false })}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={editFee.loading || updateFeeMutation.isPending}>
              {(editFee.loading || updateFeeMutation.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
