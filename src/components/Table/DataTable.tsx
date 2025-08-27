/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Skeleton } from "../Loaders/Skeleton";
import ColumnSelector from "./ColumnSelector";

type AnyRow = Record<string, any>;

export interface DataTableProps<Row extends AnyRow, ColKey extends string> {
  title: string;
  subtitle?: string;
  data: Row[];
  isLoading?: boolean;
  columns: ColumnDef<Row>[];
  // column visibility
  visibleColumns: Record<ColKey, boolean>;
  setVisibleColumns: React.Dispatch<React.SetStateAction<Record<ColKey, boolean>>>;
  columnLabels: Record<ColKey, string>;
  disabledColumns?: ColKey[];
  // table options
  pageSize?: number;
  placeholder?: string; // search
  filterFn?: (row: Row, search: string) => boolean;
  // optional right-side extra controls
  RightControls?: React.ReactNode;
}

export function DataTable<Row extends AnyRow, ColKey extends string>({
  title,
  subtitle,
  data,
  isLoading = false,
  columns,
  visibleColumns,
  setVisibleColumns,
  columnLabels,
  disabledColumns = [],
  pageSize = 10,
  placeholder = "Search…",
  filterFn,
  RightControls,
}: DataTableProps<Row, ColKey>) {
  const [search, setSearch] = useState("");
  const [openSelector, setOpenSelector] = useState(false);

  // Build visible columns array from keys (don’t rely on array index order)
  const visibleCols = useMemo(
    () =>
      columns.filter((col) => {
        const visibleSet = new Set((Object.keys(visibleColumns) as ColKey[]).filter((k) => visibleColumns[k]));
        // prefer id then accessorKey to match your keys map
        const id = (col.id ?? (col as any).accessorKey) as string | undefined;
        return id ? visibleSet.has(id as ColKey) : true;
      }),
    [columns, visibleColumns],
  );

  const table = useReactTable({
    data,
    columns: visibleCols,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
    globalFilterFn: (row, _colId, val) => (filterFn ? filterFn(row.original, String(val)) : String(val).length === 0),
    state: { globalFilter: search },
    onGlobalFilterChange: setSearch,
  });

  return (
    <div className="rounded-3xl border border-valar-gray-200 bg-white p-8 shadow-soft">
      <div className="mb-6">
        <h3 className="mb-2 text-3xl font-bold text-valar-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-600">{subtitle}</p>}
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-valar-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus:border-valar-blue-500 focus:ring-valar-blue-500/20 w-full rounded-xl border border-valar-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenSelector((v) => !v)}
            className="inline-flex items-center rounded-xl border border-valar-gray-300 px-4 py-2 text-sm font-medium text-valar-gray-700 transition-colors hover:bg-valar-gray-50"
          >
            Columns {!openSelector ? <ChevronDown className="ml-1 h-4 w-4" /> : <ChevronUp className="ml-1 h-4 w-4" />}
          </button>
          {openSelector && (
            <ColumnSelector<keyof typeof visibleColumns & string>
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns as any}
              onClose={() => setOpenSelector(false)}
              columnLabels={columnLabels as any}
              disabledColumns={disabledColumns as any}
            />
          )}
        </div>

        {RightControls}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-valar-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-valar-gray-50">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      style={{ width: h.column.getSize() }}
                      className={`px-6 py-4 text-left text-sm font-semibold text-valar-gray-900 ${h.column.getCanSort() ? "cursor-pointer hover:bg-valar-gray-100" : ""}`}
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-2">
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getCanSort() && (
                          <span className="text-valar-gray-400">
                            {{
                              asc: <ArrowUp size={14} className="ml-1" />,
                              desc: <ArrowDown size={14} className="ml-1" />,
                            }[h.column.getIsSorted() as string] ?? <ChevronsUpDown size={14} className="ml-1" />}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-valar-gray-200 bg-white">
              {isLoading
                ? Array.from({ length: pageSize }).map((_, rowIdx) => (
                    <tr key={`skeleton-${rowIdx}`} className="hover:bg-valar-gray-50">
                      {visibleCols.map((_, colIdx) => (
                        <td key={colIdx} className="px-6 py-4 text-sm">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : table.getRowModel().rows.map((r) => (
                    <tr key={r.id} className="hover:bg-valar-gray-50">
                      {r.getVisibleCells().map((c) => (
                        <td key={c.id} className="px-6 py-4 text-sm">
                          {flexRender(c.column.columnDef.cell, c.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-valar-gray-700">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          of {table.getFilteredRowModel().rows.length}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="inline-flex items-center rounded-lg border border-valar-gray-300 bg-white px-3 py-2 text-sm font-medium text-valar-gray-700 hover:bg-valar-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-valar-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="inline-flex items-center rounded-lg border border-valar-gray-300 bg-white px-3 py-2 text-sm font-medium text-valar-gray-700 hover:bg-valar-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
