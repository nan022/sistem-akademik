import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm">
              <TableRow className="hover:bg-transparent border-b dark:border-slate-800">
                {[...Array(8)].map((_, i) => (
                  <TableHead 
                    key={i} 
                    className="h-11 px-4 align-middle"
                  >
                    <Skeleton className="h-3 w-20 bg-slate-200 dark:bg-slate-800" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, i) => (
                <TableRow 
                  key={i} 
                  className="border-b last:border-0 dark:border-slate-800"
                >
                  {[...Array(8)].map((_, j) => (
                    <TableCell key={j} className="px-4 py-3">
                      <Skeleton className="h-5 w-full bg-slate-100 dark:bg-slate-900" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}