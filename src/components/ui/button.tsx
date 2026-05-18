'use client';

import * as React from 'react';
import { Button as HeroButton, type ButtonProps as HeroButtonProps } from '@heroui/react';
import { cn } from '@/lib/utils';
import { herouiButtonClassName } from '@/lib/heroui-theme';

type ShadcnVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ShadcnSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends Omit<HeroButtonProps, 'variant' | 'size' | 'color'> {
  variant?: ShadcnVariant;
  size?: ShadcnSize;
  asChild?: boolean;
}

const variantMap: Record<
  ShadcnVariant,
  { variant: HeroButtonProps['variant']; color: HeroButtonProps['color'] }
> = {
  default: { variant: 'solid', color: 'primary' },
  destructive: { variant: 'solid', color: 'danger' },
  outline: { variant: 'bordered', color: 'default' },
  secondary: { variant: 'flat', color: 'default' },
  ghost: { variant: 'light', color: 'default' },
  link: { variant: 'light', color: 'primary' },
};

const sizeMap: Record<ShadcnSize, HeroButtonProps['size']> = {
  default: 'md',
  sm: 'sm',
  lg: 'lg',
  icon: 'sm',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild, children, ...props }, ref) => {
    const mapped = variantMap[variant];
    const isIcon = size === 'icon';

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(herouiButtonClassName, (children as React.ReactElement).props.className, className),
      });
    }

    return (
      <HeroButton
        ref={ref}
        radius="lg"
        variant={mapped.variant}
        color={mapped.color}
        size={sizeMap[size]}
        isIconOnly={isIcon}
        className={cn(
          herouiButtonClassName,
          variant === 'link' && 'underline-offset-4 hover:underline bg-transparent',
          className
        )}
        {...props}
      >
        {children}
      </HeroButton>
    );
  }
);
Button.displayName = 'Button';

export { Button };
