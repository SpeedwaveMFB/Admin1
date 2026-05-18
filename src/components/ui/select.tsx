'use client';

import * as React from 'react';
import { Select as HeroSelect, SelectItem as HeroSelectItem } from '@heroui/react';
import { cn } from '@/lib/utils';
import { herouiInputClassNames } from '@/lib/heroui-theme';
import { isChildType } from '@/lib/parse-compound-children';

type SelectItemData = { value: string; label: React.ReactNode; disabled?: boolean };

function parseSelectChildren(children: React.ReactNode): { placeholder?: string; items: SelectItemData[] } {
  let placeholder: string | undefined;
  const items: SelectItemData[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (isChildType(child, SelectTrigger)) {
      React.Children.forEach(child.props.children as React.ReactNode, (sub) => {
        if (React.isValidElement<{ placeholder?: string }>(sub) && isChildType(sub, SelectValue)) {
          placeholder = sub.props.placeholder;
        }
      });
    }

    if (isChildType(child, SelectContent)) {
      React.Children.forEach(child.props.children as React.ReactNode, (item) => {
        if (
          React.isValidElement<{ value: string; children?: React.ReactNode; disabled?: boolean }>(item) &&
          isChildType(item, SelectItem)
        ) {
          items.push({
            value: String(item.props.value),
            label: item.props.children,
            disabled: item.props.disabled,
          });
        }
      });
    }
  });

  return { placeholder, items };
}

function Select({
  value,
  defaultValue,
  onValueChange,
  disabled,
  children,
  ...props
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const { placeholder, items } = parseSelectChildren(children);
  const selected = value ?? defaultValue;

  return (
    <HeroSelect
      aria-label={placeholder ?? 'Select option'}
      placeholder={placeholder}
      selectedKeys={selected ? new Set([selected]) : new Set()}
      defaultSelectedKeys={defaultValue ? new Set([defaultValue]) : undefined}
      onSelectionChange={(keys) => {
        const key = Array.from(keys)[0];
        if (key != null) onValueChange?.(String(key));
      }}
      isDisabled={disabled}
      radius="lg"
      variant="bordered"
      classNames={{
        trigger: cn('rounded-xl min-h-9', herouiInputClassNames.inputWrapper),
        value: 'text-sm',
      }}
      className="w-full"
      {...props}
    >
      {items.map((item) => (
        <HeroSelectItem key={item.value} isDisabled={item.disabled}>
          {item.label}
        </HeroSelectItem>
      ))}
    </HeroSelect>
  );
}

function SelectGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SelectValue(_props: { placeholder?: string }) {
  return null;
}
SelectValue.displayName = 'SelectValue';

const SelectTrigger = ({
  children,
  className: _className,
  ..._props
}: React.HTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => <>{children}</>;
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = ({
  children,
  className: _className,
  ..._props
}: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <>{children}</>;
SelectContent.displayName = 'SelectContent';

const SelectItem = ({
  value: _value,
  children: _children,
  disabled: _disabled,
  className: _className,
  ..._props
}: React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  children?: React.ReactNode;
  disabled?: boolean;
}) => null;
SelectItem.displayName = 'SelectItem';

const SelectLabel = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <span className={cn('px-2 py-1.5 text-sm font-semibold', className)}>{children}</span>
);

const SelectSeparator = () => null;
const SelectScrollUpButton = () => null;
const SelectScrollDownButton = () => null;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
