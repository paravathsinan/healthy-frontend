"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategories } from "@/lib/api";
import { Plus, Layers, Edit3, Trash2, ArrowUpRight, RefreshCw, Search } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { CategoryModal } from "@/components/admin/CategoryModal";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchCategories = useCallback(async () => {

    setLoading(true);
    try {
      console.log("Fetching categories...");
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete === null) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/categories/${categoryToDelete}/`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 md:gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight font-heading">
            Categories
          </h1>
          <p className="text-[12px] md:text-[14px] text-gray-500 font-medium max-w-md">Organize your collection into beautiful, navigable categories.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1 sm:min-w-[240px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#006837] transition-colors" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-[13px] font-bold text-gray-900 focus:outline-none focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 w-full shadow-sm transition-all placeholder:text-gray-400"
            />
          </div>

          <button 
            onClick={handleAdd}
            className="bg-[#006837] text-white px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-[#006837]/20 flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            New Category
          </button>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Loading Skeletons (4 cards)
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-50 flex items-center justify-center">
                <Layers className="w-12 h-12 text-gray-200" />
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="h-6 bg-gray-100 rounded-lg w-3/4" />
                    <div className="h-3 bg-gray-50 rounded-lg w-1/2" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50" />
                </div>
              </div>
            </div>
          ))
        ) : (
          filteredCategories.map((cat: any) => (

            <div key={cat.id} className="relative bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
              <Link 
                href={`/admin/products?category=${cat.slug}`}
                className="block"
              >
                <div className="relative h-48 bg-transparent flex items-center justify-center p-8 overflow-hidden">
                  <div className="absolute inset-0 bg-transparent transition-colors duration-500 z-10" />
                  {(cat.image_url && (cat.image_url.startsWith('http') || cat.image_url.startsWith('/') || cat.image_url.startsWith('data:'))) ? (
                    <Image 
                      src={cat.image_url} 
                      alt={cat.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                    />

                  ) : (
                    <Layers className="w-12 h-12 text-gray-200" />
                  )}
                </div>
                <div className="p-8 pt-2 space-y-4 flex justify-between items-start group/card">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 font-heading group-hover/card:text-[#006837] transition-colors">{cat.name}</h3>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{cat.products_count || 0} Products</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover/card:text-black transition-colors hover:bg-gray-100">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </Link>
              
              {/* Actions Overlay - Hidden by default, shows on hover */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEdit(cat);
                  }}
                  className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-[#006837] transition-colors"
                >
                  <Edit3 size={14} />
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(cat.id);
                  }}
                  className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
        
        {/* Add New Category Card Placeholder - Only show when not loading */}
        {!loading && (
          <button 
            onClick={handleAdd}
            className="bg-white rounded-[2rem] border-2 border-dashed border-gray-100 p-8 flex flex-col items-center justify-center space-y-4 text-gray-400 hover:border-[#006837] hover:text-[#006837] transition-all group min-h-[320px]"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#006837]/10 transition-colors">
              <Plus size={32} />
            </div>
            <span className="font-bold text-sm tracking-wide uppercase">Add Category</span>
          </button>
        )}
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSuccess={fetchCategories}
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
  );
}
