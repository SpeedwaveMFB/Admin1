'use client';

import * as React from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu as HeroDropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { cn } from '@/lib/utils';
import { isChildType } from '@/lib/parse-compound-children';

function parseDropdownChildren(children: React.ReactNode): {
  trigger: React.ReactNode;
  contentChildren: React.ReactNode[];
  contentClassName?: string;
} {
  let trigger: React.ReactNode = null;
  let contentChildren: React.ReactNode[] = [];
  let contentClassName: string | undefined;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (isChildType(child, DropdownMenuTrigger)) {
      trigger = child.props.asChild ? child.props.children : child.props.children;
    }

    if (isChildType(child, DropdownMenuContent)) {
      contentClassName = child.props.className;
      contentChildren = React.Children.toArray(child.props.children);
    }
  });

  return { trigger, contentChildren, contentClassName };
}

function DropdownMenu({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const { trigger, contentChildren, contentClassName } = parseDropdownChildren(children);

  const items = contentChildren.map((child, index) => {
    if (!React.isValidElement(child)) return null;

    if (isChildType(child, DropdownMenuItem)) {
      const { onClick, className, children: itemChildren, disabled } = child.props;
      return (
        <DropdownItem
          key={`item-${index}`}
          className={cn('rounded-lg', className)}
          isDisabled={disabled}
          onPress={() => onClick?.({} as React.MouseEvent)}
        >
          {itemChildren}
        </DropdownItem>
      );
    }

    if (isChildType(child, DropdownMenuSeparator)) {
      return <DropdownItem key={`sep-${index}`} isReadOnly className="h-px min-h-px p-0 my-1 bg-default-200" />;
    }

    return (
      <DropdownItem key={`custom-${index}`} isReadOnly className="h-auto cursor-default p-0 data-[hover=true]:bg-transparent">
        {child}
      </DropdownItem>
    );
  });

  return (
    <Dropdown isOpen={open} onOpenChange={onOpenChange} radius="lg" placement="bottom-end">
      <DropdownTrigger>{trigger}</DropdownTrigger>
      <HeroDropdownMenu aria-label="Menu" className={cn('rounded-xl p-1', contentClassName)}>
        {items}
      </HeroDropdownMenu>
    </Dropdown>
  );
}

const DropdownMenuTrigger = ({
  children,
  asChild: _asChild,
  ..._props
}: React.HTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  asChild?: boolean;
}) => <>{children}</>;
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuContent = ({
  children,
  className: _className,
  align: _align,
  forceMount: _forceMount,
  ..._props
}: React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  forceMount?: boolean;
}) => <>{children}</>;
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = ({
  onClick: _onClick,
  children: _children,
  className: _className,
  disabled: _disabled,
  inset: _inset,
  ..._props
}: React.HTMLAttributes<HTMLDivElement> & {
  inset?: boolean;
  disabled?: boolean;
}) => null;
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuCheckboxItem = DropdownMenuItem;
const DropdownMenuRadioItem = DropdownMenuItem;
const DropdownMenuLabel = ({
  children,
  inset: _inset,
  className: _className,
  ..._props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) => <>{children}</>;
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

const DropdownMenuSeparator = ({
  className: _className,
  ..._props
}: React.HTMLAttributes<HTMLDivElement>) => null;
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
);
const DropdownMenuGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
const DropdownMenuPortal = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
const DropdownMenuSub = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
const DropdownMenuSubContent = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
const DropdownMenuSubTrigger = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
const DropdownMenuRadioGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
