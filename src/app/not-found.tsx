'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center py-16">
        <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-br from-purple-600 to-violet-500 bg-clip-text text-transparent mb-6 leading-none">
          404
        </h1>

        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 mb-4">
          Page Not Found
        </h2>

        <p className="text-lg text-slate-500 mb-8 max-w-[500px]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Button asChild size="lg" className="px-8 h-12 rounded-xl text-base bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard">
              <Home className="mr-2 h-5 w-5" />
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.back()} className="px-8 h-12 rounded-xl text-base">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        <div className="mt-16 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-[400px] w-full text-left">
          <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider">
            Quick Links
          </h3>
          <div className="flex flex-col space-y-1">
            <Button asChild variant="ghost" className="justify-start text-slate-700 font-medium">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" className="justify-start text-slate-700 font-medium">
              <Link href="/users">Users</Link>
            </Button>
            <Button asChild variant="ghost" className="justify-start text-slate-700 font-medium">
              <Link href="/transactions">Transactions</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
