"use client"

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function SearchBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [text, setText] = useState(searchParams.get("search") || "");
    const [query] = useDebounce(text, 500);

    const handleClear = () => {
        setText("");
    };

    useEffect(() => {
        const s = searchParams.get("search") || "";
        if (s !== text) {
            setText(s);
        }
    }, [searchParams]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (query) {
            params.set("search", query);
            params.set("page", "1");
        } else {
            params.delete("search");
        }

        const newUrl = `${pathname}?${params.toString()}`;
        const currentUrl = `${pathname}?${searchParams.toString()}`;
        
        if (newUrl !== currentUrl) {
          router.push(newUrl);
        }
        
    }, [query, pathname, router]);

    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
            </div>

            <input
                type="text"
                value={text}
                className="block w-full p-2 pl-10 pr-10 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Cari NIM, Nama atau Kode MK"
                onChange={(e) => setText(e.target.value)} />

            {text && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 group">
                    <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                </button>
            )}
        </div>
    );
}