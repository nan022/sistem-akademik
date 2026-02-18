import { ExportButton } from "./export-csv";
import { AdvancedFilter } from "./filters/filter-advance";
import { FilterSemester } from "./filters/filter-semester";
import { FilterStatus } from "./filters/filter-status";
import { ResetFilter } from "./filters/reset-filter";
import SearchBar from "./filters/search-bar";

export default function FilterComponent() {
  return (
    <section className="w-full flex justify-center px-4">
      <div className="w-full max-w-6xl py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search bar mengambil ruang sisa di mobile dan desktop */}
          <div className="w-full md:flex-1">
            <SearchBar />
          </div>

          <div className="grid grid-cols-2 md:flex items-center gap-2 w-full md:w-auto">
            <FilterSemester />
            <FilterStatus />
            <AdvancedFilter />
            <ResetFilter />
            <ExportButton />
          </div>
          
        </div>
      </div>
    </section>
  );
}