'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
    </div>
  );
}






