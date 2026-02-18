"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EnrollmentForm } from "@/components/enroll-form"
import { DeleteEnrollment } from "@/components/delete-confirm"

export type Enrollment = {
  id: string
  student_nim: string
  student_name: string
  course_code: string
  course_name: string
  semester: string
  academic_year: string
  status: string
}

const sortableHeader = (title: string, column: any) => {
  const isSorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isSorted === "asc")}
      className="-ml-4 h-8 flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold"
    >
      {title}
      {isSorted === "asc" && <ArrowUp className="h-4 w-4 text-blue-600" />}
      {isSorted === "desc" && <ArrowDown className="h-4 w-4 text-blue-600" />}
      {!isSorted && <ArrowUpDown className="h-4 w-4 text-slate-400" />}
    </Button>
  )
}

export const columns: ColumnDef<Enrollment>[] = [
  {
    id: "student.nim",
    accessorKey: "student.nim",
    header: ({ column }) => sortableHeader("NIM", column),
  },
  {
    id: "student.name",
    accessorKey: "student.name",
    header: ({ column }) => sortableHeader("Nama Mahasiswa", column),
  },
  {
    id: "course.code",
    accessorKey: "course.code",
    header: ({ column }) => sortableHeader("Kode MK", column),
  },
  {
    id: "course.name",
    accessorKey: "course.name",
    header: ({ column }) => sortableHeader("Nama MK", column),
  },
  {
    id: "semester",
    accessorKey: "semester",
    header: ({ column }) => sortableHeader("Semester", column),
  },
  {
    id: "academic_year",
    accessorKey: "academic_year",
    header: ({ column }) => sortableHeader("Tahun", column),
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colors: Record<string, string> = {
        APPROVED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
        SUBMITTED: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
        REJECTED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
        DRAFT: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
      };

      return (
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-bold border",
          colors[status] || colors.DRAFT
        )}>
          {status}
        </span>
      );
    }
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const enrollment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <EnrollmentForm isEdit={true} initialData={enrollment} />
            <DeleteEnrollment 
                id={enrollment.id} 
                studentName={enrollment.student_name || "Mahasiswa"} 
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]