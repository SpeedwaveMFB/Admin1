'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Skeleton,
} from '@heroui/react';
import { cn } from '@/lib/utils';
import { adminTableClassNames, adminPaginationClassNames } from '@/lib/heroui-table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>;
  isLoading?: boolean;
  'aria-label'?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  isLoading,
  'aria-label': ariaLabel = 'Data table',
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { pagination },
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const headerGroup = table.getHeaderGroups()[0];

  return (
    <div className="space-y-4 w-full max-w-full min-w-0">
      <Table
        aria-label={ariaLabel}
        radius="lg"
        shadow="sm"
        isCompact
        removeWrapper={false}
        classNames={adminTableClassNames}
      >
        <TableHeader>
          {headerGroup.headers.map((header) => {
            const meta = header.column.columnDef.meta;
            return (
              <TableColumn
                key={header.id}
                className={cn(meta?.headerClassName)}
                style={meta?.width ? { width: meta.width } : undefined}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableColumn>
            );
          })}
        </TableHeader>
        <TableBody
          emptyContent={
            <span className="text-default-500 text-sm">No results.</span>
          }
          isLoading={isLoading}
          loadingContent={
            <div className="flex flex-col gap-3 py-6 w-full px-4">
              {Array.from({ length: Math.min(pagination.pageSize, 5) }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full rounded-lg" />
              ))}
            </div>
          }
        >
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="hover:bg-default-50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta;
                return (
                  <TableCell
                    key={cell.id}
                    className={cn(meta?.cellClassName)}
                    style={meta?.width ? { width: meta.width } : undefined}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pageCount > 1 ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-2">
          <p className="text-sm text-default-500 shrink-0">
            Page {pagination.pageIndex + 1} of {Math.max(pageCount, 1)}
          </p>
          <Pagination
            isCompact
            showControls
            radius="lg"
            classNames={adminPaginationClassNames}
            total={Math.max(pageCount, 1)}
            page={pagination.pageIndex + 1}
            isDisabled={isLoading}
            onChange={(page) =>
              onPaginationChange((prev) => ({ ...prev, pageIndex: page - 1 }))
            }
          />
        </div>
      ) : null}
    </div>
  );
}
