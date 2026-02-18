"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

export function ResetFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Cek apakah ada filter yang aktif (selain page)
  const hasFilters = Array.from(searchParams.keys()).some(key => key !== 'page')

  const handleReset = () => {
    router.push(pathname)
  }

  if (!hasFilters) return null

  return (
    <Button 
      variant="ghost" 
      onClick={handleReset}
      className="h-9 px-2 lg:px-3 text-slate-500 hover:text-red-600 transition-colors"
    >
      Reset
      <RotateCcw className="ml-2 h-4 w-4" />
    </Button>
  )
}