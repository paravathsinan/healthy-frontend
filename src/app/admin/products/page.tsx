"use client";

import { useEffect, useState, Suspense } from "react";
import { getProducts, getCategories } from "@/lib/api";
import AdminProductTable from "@/components/admin/ProductTable";
import { Search, Filter, Plus, Package, Loader2, X, Layers, Tag, EyeOff, CheckCircle2, IndianRupee, Calendar, Clock, AlertCircle, Eye } from "lucide-react";
import { ProductModal } from "@/components/admin/ProductModal";
import ProductTabs from "@/components/admin/ProductTabs";
import { useSearchParams, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categorySlug = searchParams.get("category");
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // New Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState(categorySlug || "all");

  // Sync active category with URL
  useEffect(() => {
    setActiveCategory(categorySlug || "all");
  }, [categorySlug]);


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (categorySlug) {
        params.category__slug = categorySlug;
      }
      const data = await getProducts(params);
      setProducts(data);

      const categoriesData = await getCategories();
      setCategories(categoriesData);

      if (categorySlug) {
        const cat = categoriesData.find((c: any) => c.slug === categorySlug);
        setCategoryName(cat ? cat.name : categorySlug);
        setCategoryId(cat ? cat.id.toString() : null);
      } else {
        setCategoryName(null);
        setCategoryId(null);
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


  const filteredProducts = products.filter(product => {
    // Search query match
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status match
    let matchesStatus = true;
    if (statusFilter === "active") matchesStatus = !product.is_hidden && !product.is_sold_out;
    else if (statusFilter === "hidden") matchesStatus = product.is_hidden;
    else if (statusFilter === "sold_out") matchesStatus = product.is_sold_out;

    // Category match
    const matchesCategory = activeCategory === "all" || product.category_slug === activeCategory;

    // Price match
    let matchesPrice = true;
    if (priceFilter !== "all") {
      const price = parseFloat(product.cheapest_variant_price || 0);
      if (priceFilter === "under_500") matchesPrice = price < 500;
      else if (priceFilter === "500_1000") matchesPrice = price >= 500 && price <= 1000;
      else if (priceFilter === "1000_2000") matchesPrice = price > 1000 && price <= 2000;
      else if (priceFilter === "over_2000") matchesPrice = price > 2000;
    }

    // Date match (updated_at)
    let matchesDate = true;
    if (dateFilter !== "all") {
      const updatedDate = new Date(product.updated_at);
      const now = new Date();
      if (dateFilter === "today") matchesDate = updatedDate.toDateString() === now.toDateString();
      else if (dateFilter === "7days") {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        matchesDate = updatedDate >= sevenDaysAgo;
      } else if (dateFilter === "30days") {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        matchesDate = updatedDate >= thirtyDaysAgo;
      }
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesPrice && matchesDate;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriceFilter("all");
    setDateFilter("all");
    setActiveCategory("all");
    router.push('/admin/products', { scroll: false });
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
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center h-[52px] rounded-2xl font-bold transition-all duration-300 ease-in-out border border-[#006837] hover:bg-[#006837]/5 justify-center ${
                  showFilters 
                    ? "w-[135px] bg-transparent text-[#006837]" 
                    : "w-[52px] bg-white text-[#006837]"
                }`}
              >
                <Filter className="h-4 w-4 shrink-0 text-[#006837]" />
                
                <div className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
                  showFilters ? "max-w-[100px] opacity-100 ml-2" : "max-w-0 opacity-0 ml-0"
                }`}>
                  <span className="text-[#006837] whitespace-nowrap">
                    Filters
                  </span>
                  
                  {/* Sliding Reset X */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFilters();
                    }}
                    className={`flex items-center justify-center transition-all duration-300 ease-in-out overflow-hidden ${
                      (statusFilter !== "all" || priceFilter !== "all" || dateFilter !== "all" || activeCategory !== "all" || searchQuery !== "")
                        ? "w-5 opacity-100 ml-1.5" 
                        : "w-0 opacity-0 ml-0"
                    }`}
                  >
                    <div className="p-0.5 rounded-full hover:bg-[#006837]/10 transition-colors translate-y-[1px]">
                      <X className="h-3.5 w-3.5" strokeWidth={3} />
                    </div>
                  </div>
                </div>
                
                {!showFilters && (statusFilter !== "all" || priceFilter !== "all" || dateFilter !== "all" || activeCategory !== "all" || searchQuery !== "") && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#006837] border-2 border-white animate-pulse" />
                )}
              </button>
              
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

        {/* Sliding Filter Toolbar */}
        <div 
          className={`grid transition-all duration-300 ease-in-out ${
            showFilters ? "grid-rows-[1fr] opacity-100 mb-6" : "grid-rows-[0fr] opacity-0 mb-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap items-end gap-6 p-6 bg-gray-50/30 rounded-2xl border border-gray-100">
              {/* Category Filter */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</span>
                <Select value={activeCategory} onValueChange={(val) => {
                  setActiveCategory(val);
                  if (val === "all") router.push('/admin/products', { scroll: false });
                  else router.push(`/admin/products?category=${val}`, { scroll: false });
                }}>
                  <SelectTrigger className={`w-[180px] h-10 rounded-xl text-[12px] font-bold bg-white focus:ring-0 focus:ring-offset-0 transition-all duration-200 text-gray-600 data-[state=open]:border-[#006837] ${
                    activeCategory !== "all" ? "border-[#006837]" : "border-gray-200"
                  }`}>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 bg-white shadow-xl z-[100] min-w-[180px]">
                    <SelectItem value="all" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                      All Categories
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug} className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Status</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className={`w-[160px] h-10 rounded-xl text-[12px] font-bold bg-white focus:ring-0 focus:ring-offset-0 transition-all duration-200 text-gray-600 data-[state=open]:border-[#006837] ${
                    statusFilter !== "all" ? "border-[#006837]" : "border-gray-200"
                  }`}>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 bg-white shadow-xl z-[100] min-w-[160px]">
                    <SelectItem value="all" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                      All Status
                    </SelectItem>
                    <SelectItem value="active" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                      Active Only
                    </SelectItem>
                    <SelectItem value="hidden" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                      Hidden Only
                    </SelectItem>
                    <SelectItem value="sold_out" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                      Sold Out
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Filter */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price</span>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className={`w-[160px] h-10 rounded-xl text-[12px] font-bold bg-white focus:ring-0 focus:ring-offset-0 transition-all duration-200 text-gray-600 data-[state=open]:border-[#006837] ${
                    priceFilter !== "all" ? "border-[#006837]" : "border-gray-200"
                  }`}>
                    <SelectValue placeholder="Any Price" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 bg-white shadow-xl z-[100] min-w-[160px]">
                    <SelectItem value="all" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">Any Price</SelectItem>
                    <SelectItem value="under_500" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">Under ₹500</SelectItem>
                    <SelectItem value="500_1000" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">₹500 - ₹1000</SelectItem>
                    <SelectItem value="1000_2000" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">₹1000 - ₹2000</SelectItem>
                    <SelectItem value="over_2000" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">Over ₹2000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Updated</span>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className={`w-[150px] h-10 rounded-xl text-[12px] font-bold bg-white focus:ring-0 focus:ring-offset-0 transition-all duration-200 text-gray-600 data-[state=open]:border-[#006837] ${
                    dateFilter !== "all" ? "border-[#006837]" : "border-gray-200"
                  }`}>
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 bg-white shadow-xl z-[100] min-w-[150px]">
                    <SelectItem value="all" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">All Time</SelectItem>
                    <SelectItem value="today" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50 text-emerald-600">Today</SelectItem>
                    <SelectItem value="7days" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">Last 7 Days</SelectItem>
                    <SelectItem value="30days" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            <AdminProductTable products={filteredProducts} categories={categories} onSuccess={fetchProducts} />

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
          categories={categories}
          defaultCategoryId={categoryId || undefined}
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
