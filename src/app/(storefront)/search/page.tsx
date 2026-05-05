"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/api";
import { ProductGrid } from "@/components/category/ProductGrid";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuery, setNewQuery] = useState(query);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await getProducts({ search: query });
        setProducts(response || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(newQuery.trim())}`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 font-heading">Search results</h1>
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <input 
              type="text" 
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              placeholder="Search for..." 
              className="w-full bg-white border border-gray-300 rounded-full py-4 pl-14 pr-6 text-gray-900 placeholder:text-gray-500 outline-none focus:ring-4 focus:ring-[#006837]/5 focus:border-[#006837] transition-all shadow-sm" 
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-[#006837]" />
          </div>
          <button 
            type="submit"
            className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold hover:bg-black transition-colors shrink-0"
          >
            Search again
          </button>
        </form>

        <p className="text-gray-600 text-lg">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching for "{query}"...
            </span>
          ) : (
            <>
              {products.length} results found for "{query}"
              <span className="block text-sm text-gray-400 mt-1">Showing 1 – {products.length} of {products.length} results</span>
            </>
          )}
        </p>
      </div>

      {!loading && products.length > 0 ? (
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              Products ({products.length})
            </h2>
            <ProductGrid products={products} columns={4} />
          </div>
        </div>
      ) : !loading && query && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="max-w-md mx-auto">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              We couldn't find any products matching "{query}". Try checking your spelling or using different keywords.
            </p>
            <Link href="/products" className="inline-block mt-8 text-[#006837] font-bold hover:underline">
              Browse all products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#006837]" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
