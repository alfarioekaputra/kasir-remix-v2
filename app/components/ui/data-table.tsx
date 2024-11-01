'use client';

import { useNavigate } from '@remix-run/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from '~/components/ui/pagination';
import { Button } from './button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  perPage: number;
  totalPages: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  perPage,
  totalPages,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const [pageState, setPage] = useState(page);

  const handlePageChange = (newPage: any) => {
    setPage(newPage);
    // Fetch new data based on the new page
    // This can be done using Remix's useFetcher or a similar approach
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              onClick={() =>
                navigate(`?page=${page - 1}&perPage=${perPage}`)
              }
              disabled={page <= 1}
            >
              Previous
            </Button>
          </PaginationItem>
          <PaginationItem>
            Page {page} of {totalPages}
          </PaginationItem>
          <PaginationItem>
            <Button
              onClick={() =>
                navigate(`?page=${page + 1}&perPage=${perPage}`)
              }
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
