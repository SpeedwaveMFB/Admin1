'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useTransaction } from '@/lib/hooks/useTransactions';
import { formatCurrency } from '@/lib/utils/format';
import { formatDateTime } from '@/lib/utils/date';
import StatusBadge from '@/components/shared/StatusBadge';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const transactionId = params.id as string;

  const { data, isLoading, error } = useTransaction(transactionId);
  const cachedTransactionLists = queryClient.getQueriesData({ queryKey: ['transactions'] });
  const cachedTransactions = cachedTransactionLists.flatMap(([, value]) => {
    const items = (value as any)?.data?.transactions;
    return Array.isArray(items) ? items : [];
  });

  const fallbackTransaction =
    cachedTransactions.find((tx: any) => tx?.id === transactionId || tx?.reference === transactionId) || null;

  const normalizeTransaction = (tx: any) => {
    if (!tx) return null;
    const amountRaw = tx.amount ?? tx.transaction_amount ?? tx.transactionAmount ?? 0;
    const amountParsed = typeof amountRaw === 'string' ? parseFloat(amountRaw) : amountRaw;
    const amount = Number.isFinite(amountParsed) ? amountParsed : 0;

    return {
      ...tx,
      id: tx.id ?? tx.transaction_id ?? tx.transactionId ?? transactionId,
      userId: tx.userId ?? tx.user_id ?? tx.customer_id ?? '',
      userName: tx.userName ?? tx.user_name ?? tx.customer_name ?? tx.customerName,
      userEmail: tx.userEmail ?? tx.user_email ?? tx.customer_email ?? tx.customerEmail,
      type: tx.type ?? tx.transaction_type ?? tx.transactionType ?? '',
      amount,
      status: tx.status ?? tx.transaction_status ?? tx.transactionStatus ?? '',
      reference: tx.reference ?? tx.transaction_reference ?? tx.transactionReference ?? '',
      description: tx.description ?? tx.narration ?? '',
      provider: tx.provider ?? tx.service_provider ?? tx.serviceProvider,
      providerReference: tx.providerReference ?? tx.provider_reference,
      recipientAccountNumber: tx.recipientAccountNumber ?? tx.recipient_account_number,
      recipientAccountName: tx.recipientAccountName ?? tx.recipient_account_name,
      recipientBankName: tx.recipientBankName ?? tx.recipient_bank_name,
      transferFee: tx.transferFee ?? tx.transfer_fee,
      serviceProvider: tx.serviceProvider ?? tx.service_provider,
      serviceType: tx.serviceType ?? tx.service_type,
      phoneNumber: tx.phoneNumber ?? tx.phone_number,
      meterNumber: tx.meterNumber ?? tx.meter_number,
      smartcardNumber: tx.smartcardNumber ?? tx.smartcard_number,
      planName: tx.planName ?? tx.plan_name,
      createdAt: tx.createdAt ?? tx.created_at,
      metadata: tx.metadata ?? tx.meta ?? {},
    };
  };

  const transaction = normalizeTransaction(data?.data) ?? normalizeTransaction(fallbackTransaction);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if ((error && !fallbackTransaction) || !transaction) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>Failed to load transaction details. Please try again.</AlertDescription>
        </Alert>
        <Button variant="ghost" onClick={() => router.push('/transactions')} className="text-slate-600">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Transactions
        </Button>
      </div>
    );
  }

  const renderField = (label: string, value: any) => (
    <div className="mb-4">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="font-semibold text-slate-900">{value || 'N/A'}</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <Button variant="ghost" onClick={() => router.push('/transactions')} className="-ml-3 text-slate-600">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Transactions
      </Button>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Transaction Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800">
                Transaction Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {renderField('Transaction ID', transaction.id)}
                {renderField('Reference', transaction.reference)}
                {renderField('Type', transaction.type.replace('_', ' ').toUpperCase())}

                <div className="mb-4">
                  <p className="text-sm text-slate-500 mb-2">Status</p>
                  <StatusBadge status={transaction.status} />
                </div>

                {renderField('Amount', formatCurrency(transaction.amount))}
                {renderField('Provider', transaction.provider || 'N/A')}
                {renderField('Date', formatDateTime(transaction.createdAt))}

                <div className="sm:col-span-2">
                  {renderField('Description', transaction.description)}
                </div>
              </div>

              {/* Bank Transfer Details */}
              {transaction.type === 'bank_transfer' && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Bank Transfer Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {renderField('Recipient Account Number', transaction.recipientAccountNumber)}
                    {renderField('Recipient Account Name', transaction.recipientAccountName)}
                    {renderField('Bank Name', transaction.recipientBankName)}
                    {renderField('Transfer Fee', transaction.transferFee ? formatCurrency(transaction.transferFee) : 'N/A')}
                  </div>
                </div>
              )}

              {/* Bill Payment Details */}
              {['airtime', 'data', 'electricity', 'cable_tv'].includes(transaction.type) && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Bill Payment Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {/* Electricity Specifics */}
                    {transaction.type === 'electricity' && (
                      <>
                        {renderField('Token', transaction.metadata?.payflexResponse?.token || transaction.metadata?.token || 'N/A')}
                        {renderField('Meter Number', transaction.metadata?.meter || transaction.meterNumber || 'N/A')}
                        {renderField('Unit', transaction.metadata?.unit || 'N/A')}
                      </>
                    )}

                    {/* Airtime/Data Specifics */}
                    {['airtime', 'data'].includes(transaction.type) && (
                      <>
                        {renderField('Phone Number', transaction.metadata?.phoneNumber || transaction.phoneNumber || 'N/A')}
                        {renderField('Network', transaction.metadata?.network || transaction.serviceProvider || 'N/A')}
                        {transaction.type === 'data' && (
                          renderField('Plan', transaction.metadata?.plan_name || transaction.planName || 'N/A')
                        )}
                      </>
                    )}

                    {/* Cable Specifics */}
                    {transaction.type === 'cable_tv' && (
                      <>
                        {renderField('Smartcard/IUC', transaction.metadata?.smartcardNumber || transaction.smartcardNumber || 'N/A')}
                        {renderField('Provider', transaction.metadata?.provider || transaction.serviceProvider || 'N/A')}
                        {renderField('Package', transaction.metadata?.package_name || transaction.planName || 'N/A')}
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Raw Data Section */}
          <Accordion type="single" collapsible className="w-full bg-white rounded-xl shadow-sm border border-slate-200">
            <AccordionItem value="raw-data" className="border-none">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50 rounded-xl transition-colors font-semibold text-slate-800">
                Raw Data
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <pre className="p-4 bg-slate-100 rounded-lg overflow-auto text-xs font-mono text-slate-700 max-h-[400px]">
                  {JSON.stringify(transaction.metadata || {}, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-500">
                User Information
              </p>
              <h3 className="text-lg font-semibold text-slate-900 mt-1">
                {transaction.userName || 'N/A'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {transaction.userEmail || 'N/A'}
              </p>
              {transaction.userId && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => router.push(`/users/${transaction.userId}`)}
                >
                  View User Profile
                </Button>
              )}
            </CardContent>
          </Card>

          {transaction.providerReference && (
            <Card className="shadow-sm border-slate-200">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-500">
                  Provider Reference
                </p>
                <p className="text-base font-semibold text-slate-900 mt-1 break-all">
                  {transaction.providerReference}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
