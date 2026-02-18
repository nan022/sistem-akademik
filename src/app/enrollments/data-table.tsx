"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  total: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  total,
}: DataTableProps<TData, TValue>) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const currentPage = Number(searchParams.get("page")) || 1
    const pageSize = Number(searchParams.get("per_page")) || 10

    // Baca state sorting dari URL agar UI sinkron
    const sortParam = searchParams.get("sort") || "id"
    const orderParam = searchParams.get("order") || "desc"

    const sortingState = React.useMemo(() => [
        { id: sortParam, desc: orderParam === "desc" }
    ], [sortParam, orderParam])

    const handleSortingChange = (updaterOrValue: any) => {
        // Ambil nilai sorting berikutnya dari Tanstack
        const nextSorting = typeof updaterOrValue === 'function' 
            ? updaterOrValue(sortingState) 
            : updaterOrValue
        
        const params = new URLSearchParams(searchParams.toString())
        
        if (nextSorting.length > 0) {
            // Logika Penting: Jika user mengklik kolom yang sama, Tanstack akan 
            // memutar: undefined -> asc -> desc. 
            params.set("sort", nextSorting[0].id)
            params.set("order", nextSorting[0].desc ? "desc" : "asc")
        } else {
            // Jika sorting dihapus (toggle off)
            params.delete("sort")
            params.delete("order")
        }
        
        // Reset ke halaman 1 saat sort berubah agar tidak bingung
        params.set("page", "1") 
        
        router.push(`${pathname}?${params.toString()}`)
    }

    const createQueryString = React.useCallback(
        (value: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", value.toString())
        return params.toString()
        },
        [searchParams]
    )

    const handlePageChange = (newPage: number) => {
        router.push(`${pathname}?${createQueryString(newPage)}`)
    }

    const handlePageSizeChange = (newSize: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("per_page", newSize)
      params.set("page", "1") // Reset ke halaman 1 jika ukuran berubah
      router.push(`${pathname}?${params.toString()}`)
    }

    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount,
        manualPagination: true,
        manualSorting: true,
        state: {
        pagination: {
            pageIndex: currentPage - 1,
            pageSize: pageSize,
        },
        sorting: sortingState,
        },
        onSortingChange: handleSortingChange,
        getCoreRowModel: getCoreRowModel(),
    })

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-4">
      {/* Container Tabel Utama dengan Dark Mode support */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-b dark:border-slate-800">
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id} 
                      className="h-11 px-4 text-left align-middle font-bold text-slate-700 dark:text-slate-200 uppercase text-[11px] tracking-widest whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {data.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow 
                    key={row.id}
                    className="border-b last:border-0 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-slate-400 dark:text-slate-500">
                    Tidak ada data yang tersedia.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* FOOTER NAVIGASI dengan Dark Mode support */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-4">
          {/* Tambahan UI Page Size */}
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-slate-500">Baris per halaman</p>
            <Select
              value={`${pageSize}`}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            Menampilkan <span className="font-semibold text-slate-900 dark:text-slate-100">
              {data?.length || 0}
            </span> dari{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {Number(total || 0).toLocaleString('id-ID')}
            </span> data.
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Prev
          </Button>
          <Button
                variant="outline"
                size="sm"
                className="dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pageCount || pageCount === 0}
                >
                Next 
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
      </div>
    </div>
  )
}