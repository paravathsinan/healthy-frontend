"use client";

import { useEffect, useState, use } from "react";
import { getProducts, getCategories } from "@/lib/api";
import AdminProductTable from "@/components/admin/ProductTable";
import { Search, Plus, Package, Edit3, Trash2, ArrowLeft } from "lucide-react";
import { ProductModal } from "@/components/admin/ProductModal";
import { CategoryModal } from "@/components/admin/CategoryModal";
import ProductTabs from "@/components/admin/ProductTabs";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { toast } from "sonner";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DynamicCategoryProductsPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
   const [category, setCategory] = useState<any | null>(null);
   const [categories, setCategories] = useState<any[]>([]);
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      // 1. Fetch products for this category
      const productData = await getProducts({ category__slug: slug });
      setProducts(productData);
      
      // 2. Fetch category details
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      
      const currentCat = categoriesData.find((c: any) => c.slug === slug);
      if (currentCat) {
        setCategory(currentCat);
      } else {
        toast.error("Category not found");
        router.push('/admin/categories');
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to load category data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!category) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/categories/${category.id}/`);
      toast.success("Category deleted successfully");
      router.push('/admin/categories');
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [slug]);

  return (
    <div className="space-y-0">
      <ProductTabs />

      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Link 
              href="/admin/categories" 
              className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-[#006837] uppercase tracking-widest transition-colors mb-2"
            >
              <ArrowLeft size={12} />
              Back to Categories
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight font-heading">
                {category?.name || 'Category'} Gallery
              </h1>
              {category && (
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#006837] transition-colors"
                    title="Edit Category"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={handleDeleteCategory}
                    className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-[13px] text-gray-500 font-medium">
              Managing {products.length} products in {category?.name || 'this category'}.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 group-focus-within:text-[#006837] transition-colors" />
              <input 
                type="text" 
                placeholder={`Search in ${category?.name || 'category'}...`} 
                className="pl-9 pr-4 py-2 rounded-full border border-gray-100 bg-white text-[13px] font-bold focus:outline-none focus:border-[#006837] w-48 shadow-sm transition-all"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#006837] text-white px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-black transition-all shadow-md shadow-[#006837]/10 flex items-center gap-2 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Add Product
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
          ) : products.length > 0 ? (
            <AdminProductTable products={products} categories={categories} onSuccess={fetchCategoryData} />
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4">
              <div className="p-6 rounded-full bg-gray-50 text-gray-200">
                <Package size={40} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">No products here</p>
                <p className="text-gray-400 text-xs">Start by adding your first premium treat to this category.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#006837] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-black transition-all mt-4"
              >
                Create New Product
              </button>
            </div>
          )}
        </div>

        <ProductModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchCategoryData}
          categories={categories}
          defaultCategoryId={category?.id?.toString()}
        />

        <CategoryModal 
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          category={category}
          onSuccess={fetchCategoryData}
        />

        <DeleteConfirmDialog 
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          title="Delete Category?"
          description="This action cannot be undone. This category will be permanently removed. Products in this category will become uncategorized."
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
