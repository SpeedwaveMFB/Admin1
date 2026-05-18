'use client';

import * as React from 'react';
import { Input as HeroInput, type InputProps as HeroInputProps } from '@heroui/react';
import { cn } from '@/lib/utils';
import { herouiInputClassNames } from '@/lib/heroui-theme';

export type InputProps = Omit<HeroInputProps, 'value'> & {
  value?: string | number | readonly string[];
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, ...props }, ref) => (
    <HeroInput
      ref={ref}
      type={type}
      radius="lg"
      variant="bordered"
      classNames={herouiInputClassNames}
      className={cn('w-full', className)}
      value={value == null ? value : String(value)}
      onChange={onChange}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
