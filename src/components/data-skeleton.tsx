import { Skeleton } from "@/components/ui/skeleton"

export function DataSkeleton() {
  return (
    <div className="space-y-3 w-full max-w-6xl mx-auto px-4">
      {/* Skeleton untuk Header Tabel atau Baris */}
      <div className="flex items-center space-x-4 py-2">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      {/* Looping baris skeleton */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-2 py-4 border-b">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}