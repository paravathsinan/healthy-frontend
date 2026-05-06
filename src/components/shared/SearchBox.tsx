"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { getProducts } from "@/lib/api";
import { getOptimizedImageUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const PLACEHOLDER_TERMS = [
  "Ajwa dates…",
  "Medjool King…",
  "almonds…",
  "pistachios…",
  "saffron…",
  "cashews…",
  "gift boxes…",
  "dry fruits…",
  "walnuts…",
];

interface SearchBoxProps {
  isMobile?: boolean;
}

export const SearchBox = ({ isMobile }: SearchBoxProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cycle placeholder every 2.5s with a fade-out/fade-in transition
  useEffect(() => {
    if (query) return;
    const interval = setInterval(() => {
      setPlaceholderVisible(false);
      setTimeout(() => {
        setPlaceholderIndex(i => (i + 1) % PLACEHOLDER_TERMS.length);
        setPlaceholderVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 0) {
        setLoading(true);
        setShowDropdown(true); // Show dropdown immediately when typing starts
        try {
          const response = await getProducts({ search: query, page_size: 5 });
          setResults(response || []);
        } catch (error) {
          console.error("Search fetch error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className={`relative ${isMobile ? 'flex-1' : 'w-full max-w-xl'}`} ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setShowDropdown(true)}
          placeholder=""
          className={`w-full bg-[#F9F9F9] border border-gray-300 rounded-full outline-none transition-all text-black
            ${isMobile 
              ? 'py-2.5 pl-10 pr-4 text-[13px] focus:border-[#006837]' 
              : 'py-3.5 pl-14 pr-12 focus:ring-4 focus:ring-[#006837]/5 focus:border-[#006837] shadow-sm'
            }`}
        />

        {/* Animated cycling placeholder — hidden when user starts typing */}
        {!query && (
          <span
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-black/50 select-none transition-opacity duration-300
              ${isMobile ? 'left-10 text-[13px]' : 'left-14 text-[14px]'}
              ${placeholderVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            Search for&nbsp;<span className="font-medium">{PLACEHOLDER_TERMS[placeholderIndex]}</span>
          </span>
        )}

        <Search className={`absolute text-gray-400 transition-colors group-focus-within:text-[#006837] top-1/2 -translate-y-1/2
          ${isMobile ? 'left-3.5 h-4 w-4' : 'left-5 h-6 w-6'}`} 
        />
        {query && (
          <button 
            type="button"
            onClick={() => {
              setQuery("");
              setShowDropdown(false);
            }}
            className={`absolute text-gray-400 hover:text-gray-600 transition-colors top-1/2 -translate-y-1/2
              ${isMobile ? 'right-3' : 'right-5'}`}
          >
            <X className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
          </button>
        )}
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute right-0 mt-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100]
              ${isMobile ? 'absolute left-0 w-[calc(100vw-3rem)] top-full mt-4' : 'w-[350px]'}`}
          >
            <div className="p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Suggestions Section */}
              <div className="mb-6">
                <div className="space-y-1">
                  {loading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="px-3 py-2 flex items-center gap-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                      </div>
                    ))
                  ) : (
                    <>
                      <button 
                        onClick={() => handleSearch()}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                      >
                        <span className="text-sm font-medium text-gray-900 group-hover:text-[#006837]">{query}</span>
                      </button>
                      {results.slice(0, 2).map((item) => (
                        <button 
                          key={item.id}
                          onClick={() => {
                            setQuery(item.name);
                            router.push(`/product/${item.slug}`);
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                        >
                          <span className="text-sm font-medium text-gray-500 group-hover:text-[#006837]">{item.name.toLowerCase()}</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Products Section */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="px-3 text-[12px] font-bold text-gray-400 uppercase tracking-[0.05em] mb-4">Products</h3>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-2">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                          <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-4">
                    {results.slice(0, 4).map((product) => (
                      <Link 
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 transition-all group"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                          <Image 
                            src={getOptimizedImageUrl(product.primary_image)} 
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-[#006837] mb-0.5 transition-colors">
                            {product.on_sale ? `On Sale from Rs. ${parseFloat(product.cheapest_variant_price).toFixed(2)}` : `Rs. ${parseFloat(product.cheapest_variant_price).toFixed(2)}`}
                          </p>
                          <p className="text-[13px] font-bold text-gray-900 truncate">
                            {product.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-8 text-sm text-gray-500 italic text-center">
                    No matching products found
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Search Button */}
            <div className="p-4 bg-white border-t border-gray-50">
              <button 
                onClick={() => handleSearch()}
                className="w-full bg-[#006837] hover:bg-[#00522c] text-white py-3.5 rounded-full font-bold text-[13px] transition-all shadow-sm flex items-center justify-center gap-2 transform active:scale-[0.98]"
              >
                Search for "{query}"
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
