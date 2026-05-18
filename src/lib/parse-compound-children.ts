import * as React from 'react';

export function childTypeName(type: unknown): string | undefined {
  if (typeof type === 'string') return type;
  if (typeof type === 'function') {
    return (type as { displayName?: string; name?: string }).displayName ?? type.name;
  }
  return undefined;
}

export function isChildType(child: React.ReactNode, marker: { displayName?: string; name?: string }): boolean {
  return React.isValidElement(child) && child.type === marker;
}
