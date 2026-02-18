"use client"

import { Button } from "@/components/ui/button"
import { FileSpreadsheet } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { getExportUrl } from "@/lib/export"

export function ExportButton() {
    const searchParams = useSearchParams()

    const handleExport = async () => {
        const params = Object.fromEntries(searchParams.entries())
        
        try {
            const url = await getExportUrl(params)
            window.open(url, '_blank')
        } catch (error) {
            console.error("Gagal membuat link export:", error)
        }
    }

    return (
        <Button 
            onClick={handleExport}
            variant="outline" 
            className="w-full md:w-40 flex justify-between gap-3 px-3">
            <span>Export CSV</span>
            <FileSpreadsheet className="h-4 w-4" />
        </Button>
    )
}