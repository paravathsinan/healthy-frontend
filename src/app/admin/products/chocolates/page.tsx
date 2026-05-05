"use client";

import { useEffect, useState, Suspense } from "react";
import { getAdminProducts, getCategories } from "@/lib/api";
import AdminProductTable from "@/components/admin/ProductTable";
import { Search, Filter, Plus, Package, Loader2, Edit3, Trash2 } from "lucide-react";
import { ProductModal } from "@/components/admin/ProductModal";
import { CategoryModal } from "@/components/admin/CategoryModal";
import ProductTabs from "@/components/admin/ProductTabs";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { toast } from "sonner";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

function ChocolateProductsContent() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  const fetchChocolateProducts = async () => {
    setLoading(true);
    try {
      // Directly fetch by slug which we know is 'chocolates'
      const data = await getAdminProducts({ category__slug: 'chocolates' });
      setProducts(data);
      
      // Also get category ID for the modal
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      const chocolateCat = categoriesData.find((c: any) => c.slug === 'chocolates');
      if (chocolateCat) {
        setCategory(chocolateCat);
      }
    } catch (error) {
      console.error("Failed to fetch chocolate products", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );


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
    fetchChocolateProducts();
  }, []);

  return (
    <div className="space-y-0">
      <ProductTabs />

      <div className="space-y-8">
        <div className="flex justify-between items-end">
        <div className="space-y-0.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight font-heading">
              Chocolate Delight Gallery
            </h1>
          </div>
          <p className="text-[13px] text-gray-500 font-medium max-w-md">Manage your premium chocolate collection for the storefront section.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-[#006837] transition-colors" />
            <input 
              type="text" 
              placeholder="Search chocolates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-[13px] font-bold text-gray-900 focus:outline-none focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 w-64 shadow-sm transition-all placeholder:text-gray-500"
            />

          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#006837] text-white px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-black transition-all shadow-md shadow-[#006837]/10 flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >

            <Plus className="h-4 w-4" />
            Add Chocolate
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center h-[500px]">
            <Loader2 className="h-8 w-8 text-[#006837] animate-spin" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <AdminProductTable products={filteredProducts} categories={categories} onSuccess={fetchChocolateProducts} />

        ) : (
          <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4">
            <div className="p-6 rounded-full bg-gray-50 text-gray-200">
              <Package size={40} />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-gray-900">No chocolates found</p>
              <p className="text-gray-400 text-xs">Start by adding your first premium chocolate treat.</p>
            </div>

          </div>
        )}
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchChocolateProducts}
        categories={categories}
        defaultCategoryId={category?.id?.toString()}
      />

      <CategoryModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={category}
        onSuccess={fetchChocolateProducts}
      />

      <DeleteConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Chocolate Category?"
        description="This action cannot be undone. This category will be permanently removed. The products will remain but will be uncategorized."
        isLoading={isDeleting}
      />
    </div>
  </div>
  );
}

export default function AdminChocolateProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[500px]"><Loader2 className="animate-spin text-[#006837]" /></div>}>
      <ChocolateProductsContent />
    </Suspense>
  );
}
