'use client';

import * as React from 'react';
import { Avatar as HeroAvatar } from '@heroui/react';
import { cn } from '@/lib/utils';

function parseAvatarChildren(children: React.ReactNode): { src?: string; fallback?: React.ReactNode } {
  let src: string | undefined;
  let fallback: React.ReactNode;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === AvatarImage) src = child.props.src;
    if (child.type === AvatarFallback) fallback = child.props.children;
  });

  return { src, fallback };
}

const Avatar = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children }, ref) => {
    const { src, fallback } = parseAvatarChildren(children);
    const name = typeof fallback === 'string' ? fallback : undefined;

    return (
      <HeroAvatar
        ref={ref}
        src={src}
        name={name}
        showFallback
        radius="full"
        className={cn(className)}
      >
        {!src && fallback}
      </HeroAvatar>
    );
  }
);
Avatar.displayName = 'Avatar';

const AvatarImage = (_props: { src?: string; alt?: string; className?: string }) => null;
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = (_props: { children?: React.ReactNode; className?: string }) => null;
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };
