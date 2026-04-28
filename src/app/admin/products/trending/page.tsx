"use client";

import { useEffect, useState, Suspense } from "react";
import { getProducts } from "@/lib/api";
import AdminProductTable from "@/components/admin/ProductTable";
import { Search, Plus, Package, Loader2, Sparkles, Filter } from "lucide-react";
import { ProductModal } from "@/components/admin/ProductModal";
import ProductTabs from "@/components/admin/ProductTabs";
import { useSearchParams } from "next/navigation";
import { CategoryFilter } from "@/components/admin/CategoryFilter";

function TrendingProductsContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");



  const fetchTrendingProducts = async () => {
    setLoading(true);
    try {
      const params: any = { is_featured: true };
      if (categorySlug) params.category__slug = categorySlug;
      const data = await getProducts(params);
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch trending products", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  useEffect(() => {

    fetchTrendingProducts();
  }, [categorySlug]);

  return (
    <div className="space-y-0">
      <ProductTabs />

      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight font-heading">
                Trending Now Gallery
              </h1>
            </div>
            <p className="text-[13px] text-gray-500 font-medium max-w-md">Manage products currently highlighted in the "Trending Now" section of your storefront.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#006837] transition-colors" />
              <input
                type="text"
                placeholder="Search trending..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-[13px] font-bold text-gray-900 focus:outline-none focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 w-64 shadow-sm transition-all placeholder:text-gray-500"
              />

            </div>
            <CategoryFilter currentCategory={categorySlug} basePath="/admin/products/trending" />

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#006837] text-white px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-black transition-all shadow-md shadow-[#006837]/10 flex items-center gap-2 active:scale-95 whitespace-nowrap"
            >

              <Plus className="h-4 w-4" />
              Add Trending
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-100 rounded w-1/3" />
                      <div className="h-2 bg-gray-50 rounded w-1/4" />
                    </div>
                    <div className="h-4 bg-gray-100 rounded w-20" />
                    <div className="h-4 bg-gray-100 rounded w-16" />
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg" />
                      <div className="w-8 h-8 bg-gray-50 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <AdminProductTable products={filteredProducts} onSuccess={fetchTrendingProducts} />

          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4">
              <div className="p-6 rounded-full bg-gray-50 text-gray-200">
                <Sparkles size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">No trending products</p>
                <p className="text-gray-400 text-xs">Mark products as "Featured" to see them here.</p>
              </div>

            </div>
          )}
        </div>

        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchTrendingProducts}
          defaultFeatured={true}
        />

      </div>
    </div>
  );
}

export default function AdminTrendingProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[500px]"><Loader2 className="animate-spin text-[#006837]" /></div>}>
      <TrendingProductsContent />
    </Suspense>
  );
}
