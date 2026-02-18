import { getEnrollments } from "@/lib/api";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function EnrollmentTableWrapper({ 
  searchParams 
}: { 
  searchParams: any 
}) {
  const currentPage = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.per_page) || 10;
  const sort = searchParams.sort || "id";
  const order = searchParams.order || "desc";
  const search = searchParams.search || "";
  const status = searchParams.status || ""; 
  const semester = searchParams.semester || "";
  const filters = searchParams.filters || ""; // Ambil filter mentah (JSON string)

  const { data, totalPages, total } = await getEnrollments(
    currentPage, 
    sort, 
    order, 
    search,
    status,
    semester,
    filters,
    perPage
  );

  return (
    <DataTable 
      columns={columns} 
      data={data} 
      pageCount={totalPages} 
      total={total} 
    />
  );
}