"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { getCategories } from "@/lib/api";
import { useRouter } from "next/navigation";

interface CategoryFilterProps {
  currentCategory?: string | null;
  basePath: string;
}

export function CategoryFilter({ currentCategory, basePath }: CategoryFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories for filter", err);
      }
    };
    fetchCats();
  }, []);

  const handleSelect = (slug: string | null) => {
    if (slug) {
      router.push(`${basePath}?category=${slug}`);
    } else {
      router.push(basePath);
    }
    setIsFilterOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className={`p-2.5 rounded-full border border-gray-200 transition-all flex items-center justify-center hover:border-[#006837] hover:text-[#006837] active:scale-95 shadow-sm bg-white ${isFilterOpen || currentCategory ? 'bg-[#006837]/5 border-[#006837]/30 text-[#006837]' : 'text-gray-500'}`}
        title="Filter by category"
      >
        <Filter className="h-4 w-4" />
      </button>

      {isFilterOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in duration-200 origin-top-right">
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Category</p>
            </div>
            <button
              onClick={() => handleSelect(null)}
              className={`w-full text-left px-4 py-2.5 text-[13px] font-bold transition-colors hover:bg-gray-50 flex items-center justify-between ${!currentCategory ? 'text-[#006837] bg-[#006837]/5' : 'text-gray-600'}`}
            >
              All Categories
              {!currentCategory && <div className="w-1.5 h-1.5 rounded-full bg-[#006837]" />}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.slug)}
                className={`w-full text-left px-4 py-2.5 text-[13px] font-bold transition-colors hover:bg-gray-50 flex items-center justify-between ${currentCategory === cat.slug ? 'text-[#006837] bg-[#006837]/5' : 'text-gray-600'}`}
              >
                {cat.name}
                {currentCategory === cat.slug && <div className="w-1.5 h-1.5 rounded-full bg-[#006837]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
