"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { MoreHorizontal, ExternalLink, Edit3, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { ProductModal } from "./ProductModal";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

const formatWeight = (weight: string) => {
  if (!weight) return "";
  const normalized = weight.toLowerCase().trim();
  if (normalized === "1000 g" || normalized === "1000g") return "1kg";
  if (normalized === "1 unit" || normalized === "1unit") return "unit";
  return weight.toLowerCase();
};

export default function AdminProductTable({ products: initialProducts, categories, onSuccess }: { products: any[], categories: any[], onSuccess: () => void }) {
  const router = useRouter();
  const [productList, setProductList] = useState(initialProducts);

  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state with props
  useEffect(() => {
    setProductList(initialProducts);
  }, [initialProducts]);

  const toggleStatus = async (id: number, slug: string, currentFeatured: boolean) => {
    try {
      await api.patch(`/products/${slug}/`, {
        is_featured: !currentFeatured
      });
      toast.success("Featured status updated");
      router.refresh();

      setProductList(prev => prev.map(p => p.id === id ? {...p, is_featured: !currentFeatured} : p));
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      await api.delete(`/products/${slug}/`);
      toast.success("Product deleted successfully");
      router.refresh();

      setProductList(prev => prev.filter(p => p.slug !== slug));
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[800px]">

        <TableHeader>
          <TableRow className="hover:bg-transparent border-gray-50">
            <TableHead className="font-bold text-gray-900 h-12 px-6 text-[11px] uppercase tracking-wider">Product</TableHead>
            <TableHead className="font-bold text-gray-900 h-12 text-[11px] uppercase tracking-wider">Category</TableHead>
            <TableHead className="font-bold text-gray-900 h-12 text-[11px] uppercase tracking-wider">Status</TableHead>
            <TableHead className="font-bold text-gray-900 h-12 text-[11px] uppercase tracking-wider">Selling Price / kg or Unit</TableHead>
            <TableHead className="font-bold text-gray-900 h-12 text-right px-6 text-[11px] uppercase tracking-wider">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productList.map((product) => (
            <TableRow 
              key={product.id} 
              className="hover:bg-gray-50/50 transition-colors border-gray-50 cursor-pointer group"
              onClick={() => {
                setEditingProduct(product);
                setIsModalOpen(true);
              }}
            >
              <TableCell className="py-3 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center p-1">
                    <img src={product.primary_image || 'https://via.placeholder.com/40'} className="w-full h-full object-contain" alt={product.name} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-bold text-[13px] leading-tight group-hover:text-[#006837] transition-colors">{product.name}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      {product.sku}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="px-2.5 py-0.5 rounded-md bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-200/50">
                  {product.category_name || 'Uncategorized'}
                </span>
              </TableCell>
              <TableCell>
                {product.is_sold_out ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider border border-red-100">
                    Out of Stock
                  </span>
                ) : product.is_hidden ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-gray-200">
                    Hidden
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-[#006837] text-[10px] font-bold uppercase tracking-wider border border-green-100">
                    Active
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-gray-900 font-bold text-[13px]">₹{product.base_price || product.admin_price}</span>
                  {product.admin_weight && (
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                      / {formatWeight(product.admin_weight)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {new Date(product.updated_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={onSuccess}
        categories={categories}
      />
    </div>
  );
}
