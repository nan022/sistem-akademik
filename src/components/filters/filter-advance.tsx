"use client"

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, 
  SheetTrigger, SheetFooter, SheetDescription
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, ListFilter, FilterIcon, Plus } from "lucide-react";

// Tipe Data Filter
type FilterRow = {
  id: string; // unique id untuk key react
  field: string;
  operator: string;
  value: string; // untuk between, format: "val1,val2"
};

const AVAILABLE_FIELDS = [
  { value: "student_nim", label: "Student NIM" },
  { value: "student_name", label: "Student Name" },
  { value: "course_code", label: "Course Code" },
  { value: "academic_year", label: "Academic Year" },
  { value: "semester", label: "Semester" },
  { value: "status", label: "Status" },
];

const OPERATORS = [
  { value: "contains", label: "Contains" },
  { value: "startsWith", label: "Starts With" },
  { value: "equal", label: "Equal" },
  { value: "between", label: "Between (Range)" },
  { value: "in", label: "In (List)" },
];

export function AdvancedFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterRow[]>([]);

  // Load filters from URL on mount
  useEffect(() => {
    const filtersParam = searchParams.get("filters");
    if (filtersParam) {
      try {
        const parsed = JSON.parse(filtersParam);
        // Tambahkan ID unik untuk React rendering jika belum ada
        setFilters(parsed.map((f: any) => ({ ...f, id: Math.random().toString(36).substr(2, 9) })));
      } catch (e) {
        console.error("Failed to parse filters", e);
      }
    }
  }, [searchParams]);

  const addFilter = () => {
    setFilters([
      ...filters, 
      { id: Math.random().toString(36).substr(2, 9), field: "student_nim", operator: "contains", value: "" }
    ]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, key: keyof FilterRow, newVal: string) => {
    setFilters(filters.map(f => f.id === id ? { ...f, [key]: newVal } : f));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (filters.length > 0) {
      // Bersihkan data sebelum kirim (hapus id internal react)
      const payload = filters.map(({ id, ...rest }) => rest);
      params.set("filters", JSON.stringify(payload));
    } else {
      params.delete("filters");
    }
    
    // Reset ke halaman 1 saat filter berubah
    params.set("page", "1");
    
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setFilters([]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("filters");
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex justify-between gap-2 relative">
          <span>Advanced Filter</span>
          <ListFilter className="h-4 w-4" />
          {filters.length > 0 && (
            <Badge className="bg-indigo-600 ml-1 px-1.5 h-5">{filters.length}</Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-xl flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" /> Filter Lanjutan
          </SheetTitle>
          <SheetDescription>
            Multi-kolom filter sesuai instruksi teknis (NIM, Tahun, dll).
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 py-6 space-y-4">
          {filters.map((filter, index) => (
            <div key={filter.id} className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-3 relative group">
               {/* Header Row */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">RULE #{index + 1}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removeFilter(filter.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Controls Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-500">Kolom</span>
                  <Select value={filter.field} onValueChange={(v) => updateFilter(filter.id, "field", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_FIELDS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-500">Logika</span>
                  <Select value={filter.operator} onValueChange={(v) => updateFilter(filter.id, "operator", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map(op => <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Value Row - Conditional Rendering */}
              <div className="space-y-1">
                 <span className="text-[10px] font-semibold uppercase text-slate-500">Nilai Filter</span>
                 {filter.operator === 'between' ? (
                   <div className="flex items-center gap-2">
                     <Input 
                       placeholder="Min" 
                       value={filter.value.split(',')[0] || ''} 
                       onChange={(e) => {
                         const max = filter.value.split(',')[1] || '';
                         updateFilter(filter.id, 'value', `${e.target.value},${max}`);
                       }}
                     />
                     <span className="text-slate-400">-</span>
                     <Input 
                       placeholder="Max" 
                       value={filter.value.split(',')[1] || ''}
                       onChange={(e) => {
                         const min = filter.value.split(',')[0] || '';
                         updateFilter(filter.id, 'value', `${min},${e.target.value}`);
                       }}
                     />
                   </div>
                 ) : (
                   <Input 
                     placeholder={filter.operator === 'in' ? "Contoh: 2024,2025" : "Ketik nilai..."}
                     value={filter.value}
                     onChange={(e) => updateFilter(filter.id, "value", e.target.value)}
                   />
                 )}
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full border-dashed" onClick={addFilter}>
            <Plus className="h-4 w-4 mr-2" /> Tambah Kondisi Filter
          </Button>
        </div>

        <SheetFooter className="gap-2 sm:space-x-0">
          <Button variant="ghost" onClick={clearFilters}>Reset</Button>
          <Button onClick={applyFilters} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Terapkan Filter
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}