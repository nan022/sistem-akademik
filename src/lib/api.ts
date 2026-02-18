"use server";

export const getEnrollments = async (
        page: number = 1, 
        sort: string = 'id', 
        order: string = 'desc',
        search: string = '',
        status: string = '', 
        semester: string = '',
        filters: string = '',
        perPage: number = 10
    ) => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            sort: sort,
            order: order,
            per_page: perPage.toString(),
        }); 

        if (search) params.set('search', search);
        if (status) params.set('status', status); 
        if (semester) params.set('semester', semester);
        if (filters) params.set('filters', filters);

        const url = `${process.env.APP_URL}/enrollments?${params.toString()}`;
        
        const res = await fetch(url, {
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(10000) 
        });
        
        if (!res.ok) {
            console.error(`API Error: ${res.status} ${res.statusText}`);
            return { data: [], totalPages: 0, total: 0, error: "Gagal mengambil data dari server" };
        }
        
        const json = await res.json();
        return {
            data: json.data || [],
            totalPages: json.last_page || 0,
            total: json.total || 0,
            error: null
        };

    } catch (error) {
        console.error("Fetch Connection Failed:", error);
        
        return { 
            data: [], 
            totalPages: 0, 
            total: 0, 
            error: "Tidak dapat terhubung ke server API. Pastikan server API menyala." 
        };
    }
}

export const createEnrollment = async (payload: any) => {
    try {
        const res = await fetch(`${process.env.APP_URL}/enrollments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const json = await res.json();

        if (!res.ok) {
            return { 
                success: false, 
                errors: json.errors || json,
                message: json.message || "Gagal menyimpan data" 
            };
        }

        return { success: true, data: json };
    } catch (error) {
        return { success: false, message: "Koneksi ke server gagal." };
    }
}

export const updateEnrollment = async (id: string | number, payload: any) => {
    try {
        const res = await fetch(`${process.env.APP_URL}/enrollments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const json = await res.json();

        if (!res.ok) {
            return { 
                success: false, 
                errors: json.errors || json, 
                message: json.message || "Gagal memperbarui data" 
            };
        }

        return { success: true, data: json };
    } catch (error) {
        return { success: false, message: "Koneksi ke server gagal." };
    }
}

export const deleteEnrollment = async (id: string | number) => {
    try {
        const res = await fetch(`${process.env.APP_URL}/enrollments/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const json = await res.json();
            return { success: false, message: json.message || "Gagal menghapus data" };
        }

        return { success: true };
    } catch (error) {
        return { success: false, message: "Koneksi ke server gagal." };
    }
}