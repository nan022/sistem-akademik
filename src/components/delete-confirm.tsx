"use client"

import * as React from "react"
import { Trash2, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteEnrollment } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function DeleteEnrollment({ id, studentName }: { id: string; studentName: string }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false) 
  const router = useRouter()

  const onDelete = async (e: React.MouseEvent) => {
    e.preventDefault() 
    
    setIsLoading(true)
    const result = await deleteEnrollment(id)
    
    if (result.success) {
      toast.success("Dihapus!", { description: `Data KRS ${studentName} berhasil dihapus.` })
      router.refresh()
      setOpen(false) 
    } else {
      toast.error("Gagal!", { description: result.message })
    }
    setIsLoading(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button className="flex w-full items-center px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 outline-none cursor-pointer">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Data
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Data KRS mahasiswa <strong>{studentName}</strong> akan dihapus permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Ya, Hapus Data"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}