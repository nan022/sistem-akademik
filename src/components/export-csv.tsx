"use client"

import { Button } from "@/components/ui/button"
import { FileSpreadsheet } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { getExportUrl } from "@/lib/export" // Import file baru

export function ExportButton() {
    const searchParams = useSearchParams()

    const handleExport = async () => {
        // Ambil semua param yang ada di URL (filter, sort, dll)
        const params = Object.fromEntries(searchParams.entries())
        
        try {
            // Panggil server function untuk dapet URL API Backend
            const url = await getExportUrl(params)
            
            // Trigger download
            window.open(url, '_blank')
        } catch (error) {
            console.error("Gagal membuat link export:", error)
        }
    }

    return (
        <Button 
            onClick={handleExport}
            variant="outline" 
            className="w-full md:w-40 flex justify-between gap-3 px-3"
        >
            <span>Export CSV</span>
            <FileSpreadsheet className="h-4 w-4" />
        </Button>
    )
}