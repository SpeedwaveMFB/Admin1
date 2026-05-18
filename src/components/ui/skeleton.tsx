'use client';

import { Skeleton as HeroSkeleton } from '@heroui/react';
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <HeroSkeleton className={cn('rounded-lg', className)} {...props} />;
}

export { Skeleton };
