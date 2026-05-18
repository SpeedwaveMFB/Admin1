'use client';

import * as React from 'react';
import { Accordion as HeroAccordion, AccordionItem as HeroAccordionItem } from '@heroui/react';
import { isChildType } from '@/lib/parse-compound-children';

type AccordionEntry = { value: string; title: React.ReactNode; content: React.ReactNode };

function parseAccordionChildren(children: React.ReactNode): AccordionEntry[] {
  const entries: AccordionEntry[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child) || !isChildType(child, AccordionItem)) return;

    let title: React.ReactNode = null;
    let content: React.ReactNode = null;

    React.Children.forEach(child.props.children as React.ReactNode, (sub) => {
      if (!React.isValidElement<{ children?: React.ReactNode }>(sub)) return;
      if (isChildType(sub, AccordionTrigger)) title = sub.props.children;
      if (isChildType(sub, AccordionContent)) content = sub.props.children;
    });

    entries.push({ value: String(child.props.value), title, content });
  });

  return entries;
}

function Accordion({
  type = 'single',
  collapsible: _collapsible,
  children,
  className,
  defaultValue,
  value,
  onValueChange,
}: React.HTMLAttributes<HTMLDivElement> & {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}) {
  const entries = parseAccordionChildren(children);
  const selectionMode = type === 'multiple' ? 'multiple' : 'single';

  return (
    <HeroAccordion
      variant="splitted"
      selectionMode={selectionMode}
      isCompact={false}
      defaultExpandedKeys={
        defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : undefined
      }
      selectedKeys={value ? (Array.isArray(value) ? value : [value]) : undefined}
      onSelectionChange={(keys) => {
        const arr = Array.from(keys).map(String);
        onValueChange?.(type === 'multiple' ? arr : arr[0] ?? '');
      }}
      className={className}
    >
      {entries.map((entry) => (
        <HeroAccordionItem key={entry.value} aria-label={String(entry.value)} title={entry.title}>
          {entry.content}
        </HeroAccordionItem>
      ))}
    </HeroAccordion>
  );
}

const AccordionItem = ({
  children,
  className: _className,
  value: _value,
  ..._props
}: React.HTMLAttributes<HTMLDivElement> & { value: string; children?: React.ReactNode }) => (
  <>{children}</>
);
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = ({
  children,
  className: _className,
  ..._props
}: React.HTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => <>{children}</>;
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = ({
  children,
  className: _className,
  ..._props
}: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <>{children}</>;
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
