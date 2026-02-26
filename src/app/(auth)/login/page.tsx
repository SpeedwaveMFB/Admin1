'use client';

import Image from 'next/image';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/lib/utils/validation';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/authStore';
import { ApiResponse } from '@/types/api';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    permissions?: string[];
  };
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        '/admin/login',
        data
      );

      if (response.data.success && response.data.data) {
        const { token, admin } = response.data.data;
        setAuth(token, admin);
        router.push('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Failed to login. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] px-4">
      <Card className="shadow-lg border-slate-200">
        <CardContent className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="flex justify-center mb-6 w-full">
              <Image src="/logo.png" alt="Speedwave Logo" width={200} height={60} className="w-auto h-12" priority />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
              Speedwave Admin
            </h1>
            <p className="text-sm text-slate-500">
              Sign in to access the admin portal
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-50 text-red-700 border-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                {...register('email')}
                className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm font-medium text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...register('password')}
                  className={errors.password ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 py-2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm font-medium text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-6 h-11 text-base bg-purple-600 hover:bg-purple-700 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
