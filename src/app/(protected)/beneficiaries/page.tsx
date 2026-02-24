'use client';

import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BeneficiariesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Users className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Beneficiaries
        </h1>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="pt-6">
          <Alert className="bg-blue-50 text-blue-700 border-blue-200 mb-4">
            <AlertDescription>
              Beneficiaries management will be available once the backend endpoints are ready.
            </AlertDescription>
          </Alert>
          <p className="text-slate-600 text-sm">
            This page will display all beneficiaries across users with statistics and filtering options.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
