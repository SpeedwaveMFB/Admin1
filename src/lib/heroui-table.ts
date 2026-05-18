/** Shared HeroUI table surface — fixed layout, no horizontal scroll */
export const adminTableClassNames = {
  base: 'max-w-full',
  wrapper: [
    'rounded-2xl border border-default-200 shadow-sm',
    'bg-content1 overflow-x-hidden overflow-y-visible max-w-full',
  ].join(' '),
  table: 'w-full table-fixed',
  thead: '[&>tr]:first:shadow-none',
  th: [
    'bg-default-100 text-default-600 text-[11px] uppercase tracking-wide font-semibold',
    'whitespace-normal break-words px-3 py-3',
  ].join(' '),
  td: [
    'py-3 px-3 text-sm text-default-700 align-top',
    'whitespace-normal break-words',
  ].join(' '),
  tr: 'border-b border-default-100 last:border-0',
  tbody: 'divide-y divide-default-100',
  emptyWrapper: 'py-12',
};

export const adminPaginationClassNames = {
  wrapper: 'gap-2 flex-wrap justify-center sm:justify-end',
  item: 'rounded-xl',
  cursor: 'rounded-xl bg-primary text-primary-foreground font-medium',
};

/** Clamp long text inside table cells */
export function tableClamp(lines: 1 | 2 | 3 = 2) {
  const map = { 1: 'line-clamp-1', 2: 'line-clamp-2', 3: 'line-clamp-3' } as const;
  return map[lines];
}
