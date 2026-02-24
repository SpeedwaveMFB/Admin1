'use client';

import { BarChart4, FileText, Receipt, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ReportsPage() {
  const reportTypes = [
    {
      title: 'Financial Reports',
      description: 'Transaction and revenue reports',
      icon: <Receipt className="w-6 h-6" />,
      colorClass: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'User Reports',
      description: 'User activity and registration reports',
      icon: <Users className="w-6 h-6" />,
      colorClass: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Transaction Reports',
      description: 'Detailed transaction analytics',
      icon: <FileText className="w-6 h-6" />,
      colorClass: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Bill Payment Reports',
      description: 'Bill payment analytics and statistics',
      icon: <BarChart4 className="w-6 h-6" />,
      colorClass: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Reports & Analytics
        </h1>
        <p className="text-slate-500 text-sm">
          Generate and export comprehensive reports
        </p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="pt-6">
          <Alert className="bg-blue-50 text-blue-700 border-blue-200 mb-0">
            <AlertDescription>
              Report generation will be available once the backend endpoints are ready.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.title} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${report.colorClass}`}>
                {report.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {report.title}
              </h3>
              <p className="text-sm text-slate-500">
                {report.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
