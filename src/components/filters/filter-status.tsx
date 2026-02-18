"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Check } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

const statuses = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"]

export function FilterStatus() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Ambil nilai status aktif dari URL
  const currentStatus = searchParams.get("status")

  const handleSelect = (status: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (status) {
      params.set("status", status)
    } else {
      params.delete("status")
    }
    
    // Sesuai praktik terbaik, reset ke halaman 1 saat filter berubah
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-40 flex justify-between gap-3 px-3 capitalize">
          <span className="truncate text-left">
            {currentStatus ? currentStatus.toLowerCase() : "Enroll Status"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleSelect(null)}>
          All Status
        </DropdownMenuItem>
        {statuses.map((status) => (
          <DropdownMenuItem 
            key={status} 
            onClick={() => handleSelect(status)}
            className="flex items-center justify-between"
          >
            {status}
            {currentStatus === status && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}