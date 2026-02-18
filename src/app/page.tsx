import Header from "@/components/header";
import FilterComponent from "@/components/filter";
import { Suspense } from "react";
import EnrollmentTableWrapper from "./enrollments/enrollment-table-wrapper";
import { TableSkeleton } from "@/components/table-skeleton";

export default async function Home(props: {
  searchParams: Promise<{ 
    page?: string; 
    sort?: string; 
    order?: string; 
    search?: string 
  }>;
}) {
  const searchParams = await props.searchParams;
  const suspenseKey = JSON.stringify(searchParams);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <main className="flex-1 container mx-auto py-6">
        <FilterComponent />
        
        <Suspense key={suspenseKey} fallback={<TableSkeleton />}>
          <EnrollmentTableWrapper searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}