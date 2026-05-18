'use client';

import * as React from 'react';
import { Textarea as HeroTextarea, type TextAreaProps as HeroTextareaProps } from '@heroui/react';
import { cn } from '@/lib/utils';
import { herouiInputClassNames } from '@/lib/heroui-theme';

export type TextareaProps = HeroTextareaProps;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps & { rows?: number }>(
  ({ className, rows, minRows, ...props }, ref) => (
  <HeroTextarea
    ref={ref}
    radius="lg"
    variant="bordered"
    minRows={minRows ?? rows ?? 3}
    classNames={{
      inputWrapper: herouiInputClassNames.inputWrapper,
      input: cn('text-sm', herouiInputClassNames.input),
    }}
    className={cn('w-full', className)}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };
