"use server";

/**
 * Fungsi untuk menghasilkan URL export yang dinamis berdasarkan filter yang aktif.
 * Menggunakan "use server" agar process.env tetap aman di sisi server.
 */
export const getExportUrl = async (params: {
    sort?: string;
    order?: string;
    search?: string;
    status?: string;
    semester?: string;
    filters?: string;
}) => {
    // 1. Ambil Base URL dari environment variable
    const baseUrl = `${process.env.APP_URL}/export-enrollments`;
    
    // 2. Susun query parameters
    const queryParams = new URLSearchParams();

    // Default sorting jika tidak ada
    queryParams.set('sort', params.sort || 'id');
    queryParams.set('order', params.order || 'desc');

    // Tambahkan filter jika tersedia
    if (params.search) queryParams.set('search', params.search);
    if (params.status) queryParams.set('status', params.status);
    if (params.semester) queryParams.set('semester', params.semester);
    if (params.filters) queryParams.set('filters', params.filters);

    // 3. Kembalikan URL lengkap
    return `${baseUrl}?${queryParams.toString()}`;
};