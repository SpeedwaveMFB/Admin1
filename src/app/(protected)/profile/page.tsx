'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '@/lib/store/authStore';
import { User, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { admin } = useAuthStore();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setError(null);
    setSuccess(false);
    // TODO: Implement password change API call
    console.log('Password change:', data);
    setSuccess(true);
    reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
          Profile Settings
        </h1>
        <p className="text-sm text-slate-500">
          Manage your admin profile and password
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-slate-200 h-fit">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-800">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Name</p>
                <p className="font-semibold text-slate-900">
                  {admin?.firstName && admin?.lastName
                    ? `${admin.firstName} ${admin.lastName}`
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
                <p className="font-semibold text-slate-900">
                  {admin?.email || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Role</p>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 uppercase">
                  {admin?.role || 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-800">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Lock className="w-5 h-5" />
              </div>
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {success && (
              <Alert className="bg-green-50 text-green-700 border-green-200">
                <AlertDescription>Password changed successfully!</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert className="bg-blue-50 text-blue-700 border-blue-200">
              <AlertDescription>
                Password change functionality will be available once the backend endpoint is ready.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="currentPassword">
                  Current Password
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  disabled
                  {...register('currentPassword')}
                  className={errors.currentPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.currentPassword && (
                  <p className="text-sm font-medium text-red-500">{errors.currentPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="newPassword">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  disabled
                  {...register('newPassword')}
                  className={errors.newPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.newPassword && (
                  <p className="text-sm font-medium text-red-500">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  disabled
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-sm font-medium text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-2" disabled>
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
