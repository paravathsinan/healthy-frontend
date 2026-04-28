"use client";

import { useEffect, useState, Suspense } from "react";
import { getProducts, getCategories } from "@/lib/api";
import AdminProductTable from "@/components/admin/ProductTable";
import { Search, Filter, Plus, Package, Loader2, X } from "lucide-react";
import { ProductModal } from "@/components/admin/ProductModal";
import ProductTabs from "@/components/admin/ProductTabs";
import { useSearchParams, useRouter } from "next/navigation";

import { CategoryFilter } from "@/components/admin/CategoryFilter";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categorySlug = searchParams.get("category");
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (categorySlug) {
        params.category__slug = categorySlug;
      }
      const data = await getProducts(params);
      setProducts(data);

      if (categorySlug) {
        const categories = await getCategories();
        const cat = categories.find((c: any) => c.slug === categorySlug);
        setCategoryName(cat ? cat.name : categorySlug);
      } else {
        setCategoryName(null);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categorySlug]);


  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearFilter = () => {

    router.push('/admin/products');
  };

  return (
    <div className="space-y-6 max-w-[100vw] overflow-x-hidden">
      <ProductTabs />
      
      <div className="space-y-6 md:space-y-8 max-w-full overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-4 md:gap-6">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight font-heading">
                {categoryName ? `${categoryName} Gallery` : "Products Gallery"}
              </h1>
              {categorySlug && (
                <button 
                  onClick={clearFilter}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-[9px] font-bold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all shrink-0"
                >
                  <X size={8} />
                  CLEAR
                </button>
              )}
            </div>
            <p className="text-[12px] md:text-[14px] text-gray-500 font-medium max-w-sm md:max-w-md">
              {categoryName 
                ? `Managing products in the ${categoryName} category.` 
                : "Manage your premium inventory and pricing."}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full xl:w-auto">
            <div className="relative group flex-1 sm:min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#006837] transition-colors" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-[13px] font-bold text-gray-900 focus:outline-none focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 w-full shadow-sm transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <CategoryFilter currentCategory={categorySlug} basePath="/admin/products" />
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 h-[52px] sm:flex-none bg-[#006837] text-white px-8 py-3 rounded-2xl text-[13px] font-bold hover:bg-black transition-all shadow-lg shadow-[#006837]/10 flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] w-full">
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
            <AdminProductTable products={filteredProducts} onSuccess={fetchProducts} />

          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4">
              <div className="p-6 rounded-full bg-gray-50 text-gray-200">
                <Package size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">No products found</p>
                <p className="text-gray-400 text-xs">Start by adding your first premium treat.</p>
              </div>

            </div>
          )}
        </div>

        <ProductModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchProducts}
          defaultCategoryId={categorySlug || undefined}
        />
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[500px]"><Loader2 className="animate-spin text-[#006837]" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
