'use client';

import * as React from 'react';
import { Chip } from '@heroui/react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantMap = {
  default: { variant: 'solid', color: 'primary' },
  secondary: { variant: 'flat', color: 'default' },
  destructive: { variant: 'solid', color: 'danger' },
  outline: { variant: 'bordered', color: 'default' },
} as const satisfies Record<BadgeVariant, { variant: 'solid' | 'flat' | 'bordered'; color: 'primary' | 'default' | 'danger' }>;

function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const mapped = variantMap[variant];
  return (
    <Chip
      size="sm"
      radius="md"
      variant={mapped.variant}
      color={mapped.color}
      classNames={{ base: cn('h-6 border-none', className) }}
    >
      {children}
    </Chip>
  );
}

export { Badge };
