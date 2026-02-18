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

const semesters = ["GANJIL", "GENAP"]

export function FilterSemester() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const currentSemester = searchParams.get("semester")

  const handleSelect = (val: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val) params.set("semester", val)
    else params.delete("semester")
    
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full md:w-40 flex justify-between gap-3 px-3 capitalize">
          <span className="truncate text-left">
            {currentSemester ? currentSemester.toLowerCase() : "Semester"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleSelect(null)}>All Semester</DropdownMenuItem>
        {semesters.map((s) => (
          <DropdownMenuItem key={s} onClick={() => handleSelect(s)} className="flex items-center justify-between">
            {s}
            {currentSemester === s && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}