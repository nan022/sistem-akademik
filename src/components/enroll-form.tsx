"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Loader2, User, BookOpen, ClipboardCheck, Edit } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { createEnrollment, updateEnrollment } from "@/lib/api"

interface EnrollmentFormProps {
  initialData?: any; // Data dari baris tabel jika mode edit
  isEdit?: boolean;
}

export function EnrollmentForm({ initialData, isEdit = false }: EnrollmentFormProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<any>({})

  // Inisialisasi state dengan data awal jika ada (untuk edit)
  const [formData, setFormData] = React.useState({
    nim: initialData?.student?.nim || "",
    student_name: initialData?.student?.name || "",
    email: initialData?.student?.email || "",
    course_code: initialData?.course?.code || "",
    course_name: initialData?.course?.name || "",
    credits: initialData?.course?.credits || "",
    academic_year: initialData?.academic_year || "",
    semester: initialData?.semester || "",
    status: initialData?.status || "DRAFT"
  })

  // Reset form saat modal dibuka/tutup atau data berubah
  React.useEffect(() => {
    if (open && initialData) {
        setFormData({
            nim: initialData?.student?.nim || "",
            student_name: initialData?.student?.name || "",
            email: initialData?.student?.email || "",
            course_code: initialData?.course?.code || "",
            course_name: initialData?.course?.name || "",
            credits: initialData?.course?.credits || "",
            academic_year: initialData?.academic_year || "",
            semester: initialData?.semester || "",
            status: initialData?.status || "DRAFT"
        });
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); 

    try {
      // Logic Switching: Panggil update jika isEdit, panggil create jika tidak
      const result = isEdit 
        ? await updateEnrollment(initialData.id, formData)
        : await createEnrollment(formData);

      if (result.success) {
        toast.success(isEdit ? "Update Berhasil!" : "Berhasil Dibuat!", { 
            description: result.message 
        });
        
        if (!isEdit) {
            setFormData({
                nim: "", student_name: "", email: "", 
                course_code: "", course_name: "", credits: "", 
                academic_year: "", semester: "", status: "DRAFT"
            });
        }
        
        setOpen(false);
        router.refresh();
      } else {
  if (result.errors) {
    setErrors(result.errors);
    // Ambil pesan error pertama dari object errors jika ada
    const firstErrorField = Object.keys(result.errors)[0];
    const errorMessage = result.errors[firstErrorField][0]; // Ambil detail pesannya

    toast.error("Gagal Menyimpan", { 
      description: errorMessage || `Masalah pada field: ${firstErrorField}` 
    });
  } else {
    // Jika tidak ada error per field, tapi ada message global (seperti duplikasi)
    toast.error("Gagal", { 
        description: result.message || "Terjadi kesalahan pada sistem." 
    });
  }
}
    } catch (error: any) {
      toast.error("Network Error", { description: "Gagal terhubung ke server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="sm" className="w-full justify-start px-2 py-1.5 text-sm cursor-pointer">
            <Edit className="w-4 h-4 mr-2" />
            Edit Data
          </Button>
        ) : (
          <Button variant="outline" className="border-indigo-500/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create New Enrollment
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[850px] max-h-[95vh] overflow-y-auto bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <ClipboardCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {isEdit ? "Update Enrollment" : "Enrollment Baru"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            {isEdit ? "Perbarui informasi pendaftaran mahasiswa." : "Pastikan data mahasiswa dan mata kuliah sudah benar sebelum menyimpan."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* SEKSI 1: MAHASISWA */}
            <div className="space-y-5 p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-2">
                <User className="w-4 h-4 text-blue-500" />
                <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 uppercase tracking-widest">Data Mahasiswa</h4>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nim" className={`font-semibold ${errors.nim ? "text-red-500" : "dark:text-slate-300"}`}>
                    NIM
                  </Label>
                  <Input 
                    id="nim"
                    disabled={isEdit} // NIM biasanya tidak boleh diubah saat edit
                    className={`bg-white dark:bg-slate-950 transition-all ${errors.nim ? "border-red-500" : "dark:border-slate-700"}`}
                    value={formData.nim} 
                    onChange={(e) => setFormData({...formData, nim: e.target.value.replace(/\D/g, "")})} 
                    placeholder="205530..." 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-slate-300">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    className="bg-white dark:bg-slate-950 dark:border-slate-700"
                    value={formData.student_name}
                    onChange={(e) => setFormData({...formData, student_name: e.target.value})}
                    placeholder="Contoh: John Doe" required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={`font-semibold ${errors.email ? "text-red-500" : "dark:text-slate-300"}`}>
                    Email Kampus
                  </Label>
                  <Input 
                    id="email"
                    disabled={isEdit} // Email juga biasanya identitas unik
                    className={`bg-white dark:bg-slate-950 ${errors.email ? "border-red-500" : "dark:border-slate-700"}`}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="mhs@kampus.ac.id"
                  />
                </div>
              </div>
            </div>

            {/* SEKSI 2: MATA KULIAH */}
            <div className="space-y-5 p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400 uppercase tracking-widest">Mata Kuliah</h4>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code" className={`font-semibold ${errors.course_code ? "text-red-500" : "dark:text-slate-300"}`}>
                      Kode MK
                    </Label>
                    <Input 
                      id="code" 
                      disabled={isEdit}
                      className="bg-white dark:bg-slate-950 uppercase"
                      value={formData.course_code}
                      onChange={(e) => setFormData({...formData, course_code: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="credits" className="dark:text-slate-300">SKS</Label>
                    <Input 
                      id="credits" type="number"
                      disabled={isEdit}
                      className="bg-white dark:bg-slate-950 dark:border-slate-700"
                      value={formData.credits}
                      onChange={(e) => setFormData({...formData, credits: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="c_name" className="dark:text-slate-300">Nama Mata Kuliah</Label>
                  <Input 
                    id="c_name"
                    disabled={isEdit}
                    className="bg-white dark:bg-slate-950 dark:border-slate-700"
                    value={formData.course_name}
                    onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEKSI 3: AKADEMIK & STATUS */}
          <div className="p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-950/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="dark:text-slate-300">Semester</Label>
                <Select onValueChange={(v) => setFormData({...formData, semester: v})} value={formData.semester}>
                  <SelectTrigger className="bg-white dark:bg-slate-950 w-full">
                    <SelectValue placeholder="Pilih Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GANJIL">Ganjil</SelectItem>
                    <SelectItem value="GENAP">Genap</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className={`font-semibold ${errors.academic_year ? "text-red-500" : "dark:text-slate-300"}`}>
                  Tahun Akademik
                </Label>
                <Input 
                  id="year"
                  className="bg-white dark:bg-slate-950"
                  value={formData.academic_year}
                  onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
                  placeholder="2025/2026" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-indigo-600 dark:text-indigo-400 font-semibold">Status Data</Label>
                <Select onValueChange={(v) => setFormData({...formData, status: v})} value={formData.status}>
                  <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-indigo-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t dark:border-slate-800 gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px]" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : isEdit ? "Simpan Perubahan" : "Simpan Enrollment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}