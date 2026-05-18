'use client';

import * as React from 'react';
import { Tabs as HeroTabs, Tab } from '@heroui/react';
import { cn } from '@/lib/utils';
import { isChildType } from '@/lib/parse-compound-children';

type TabEntry = {
  value: string;
  label: React.ReactNode;
  content?: React.ReactNode;
  triggerClassName?: string;
};

type TabsTriggerProps = { value: string; children?: React.ReactNode; className?: string };
type TabsContentProps = { value: string; children?: React.ReactNode; className?: string };
type TabsListProps = { children?: React.ReactNode; className?: string };

function containsTabsMarkers(children: React.ReactNode): boolean {
  let found = false;
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child) || found) return;
    if (isChildType(child, TabsList) || isChildType(child, TabsTrigger) || isChildType(child, TabsContent)) {
      found = true;
      return;
    }
    if (child.props?.children && containsTabsMarkers(child.props.children)) found = true;
  });
  return found;
}

function parseTabsTree(
  children: React.ReactNode,
  state: {
    entries: Map<string, TabEntry>;
    tabListClassName?: string;
    orphans: React.ReactNode[];
  }
) {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      if (child != null && child !== false) state.orphans.push(child);
      return;
    }

    if (isChildType(child, TabsList)) {
      const listProps = child.props as TabsListProps;
      state.tabListClassName = listProps.className;
      React.Children.forEach(listProps.children, (trigger) => {
        if (React.isValidElement<TabsTriggerProps>(trigger) && isChildType(trigger, TabsTrigger)) {
          const value = String(trigger.props.value);
          const existing = state.entries.get(value) ?? { value, label: trigger.props.children };
          state.entries.set(value, {
            ...existing,
            value,
            label: trigger.props.children,
            triggerClassName: trigger.props.className,
          });
        }
      });
      return;
    }

    if (isChildType(child, TabsTrigger)) {
      const props = child.props as TabsTriggerProps;
      const value = String(props.value);
      const existing = state.entries.get(value) ?? { value, label: props.children };
      state.entries.set(value, {
        ...existing,
        value,
        label: props.children,
        triggerClassName: props.className,
      });
      return;
    }

    if (isChildType(child, TabsContent)) {
      const props = child.props as TabsContentProps;
      const value = String(props.value);
      const existing = state.entries.get(value) ?? { value, label: value };
      state.entries.set(value, { ...existing, value, content: props.children });
      return;
    }

    if (child.props?.children && containsTabsMarkers(child.props.children)) {
      parseTabsTree(child.props.children, state);
    } else {
      state.orphans.push(child);
    }
  });
}

function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const state: {
    entries: Map<string, TabEntry>;
    tabListClassName?: string;
    orphans: React.ReactNode[];
  } = { entries: new Map<string, TabEntry>(), orphans: [] };
  parseTabsTree(children, state);
  const entries = Array.from(state.entries.values());
  const hasPanelContent = entries.some((e) => e.content != null);

  return (
    <div className={cn('w-full', className)}>
      <HeroTabs
        aria-label="Tabs"
        variant="underlined"
        color="primary"
        selectedKey={value}
        defaultSelectedKey={defaultValue}
        onSelectionChange={(key) => onValueChange?.(String(key))}
        classNames={{
          tabList: cn('rounded-none gap-0', state.tabListClassName),
          tab: 'rounded-none',
          panel: hasPanelContent ? 'pt-3' : 'hidden',
        }}
      >
        {entries.map((entry) => (
          <Tab
            key={entry.value}
            title={entry.label}
            className={entry.triggerClassName}
          >
            {entry.content}
          </Tab>
        ))}
      </HeroTabs>
      {state.orphans.length > 0 && <div>{state.orphans}</div>}
    </div>
  );
}

const TabsList = ({
  children,
  className: _className,
  ..._props
}: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <>{children}</>;
TabsList.displayName = 'TabsList';

const TabsTrigger = ({
  value: _value,
  children: _children,
  className: _className,
  ..._props
}: React.HTMLAttributes<HTMLButtonElement> & { value: string; children?: React.ReactNode }) => null;
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = ({
  value: _value,
  children: _children,
  className: _className,
  ..._props
}: React.HTMLAttributes<HTMLDivElement> & { value: string; children?: React.ReactNode }) => null;
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
