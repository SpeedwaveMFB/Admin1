'use client';

import { Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VirtualAccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
          <Wallet className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Virtual Accounts
        </h1>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="pt-6">
          <Alert className="bg-purple-50 text-purple-700 border-purple-200 mb-4">
            <AlertDescription>
              Virtual accounts management will be available once the backend endpoints are ready.
            </AlertDescription>
          </Alert>
          <p className="text-slate-600 text-sm">
            This page will display all Nomba virtual accounts with details, status, and transaction history.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
