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

export default function AdminProductTable({ products: initialProducts, onSuccess }: { products: any[], onSuccess: () => void }) {
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
            <TableHead className="font-bold text-gray-900 h-12 text-[11px] uppercase tracking-wider">Price (INR)</TableHead>

            <TableHead className="font-bold text-gray-900 h-12 text-right px-6 text-[11px] uppercase tracking-wider">Actions</TableHead>
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
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.sku || `#${product.id}`}</span>

                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="px-2.5 py-0.5 rounded-md bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-200/50">
                  {product.category_name || 'Uncategorized'}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-gray-900 font-bold text-[13px]">₹{product.cheapest_variant_price}</span>
              </TableCell>

              <TableCell className="text-right px-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white rounded-3xl p-8 border-none shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-black text-gray-900">Delete Product?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500 font-medium pt-2">
                          Are you sure you want to delete <span className="font-bold text-gray-900">"{product.name}"</span>? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="pt-4 flex gap-3">
                        <AlertDialogCancel className="rounded-full px-6 py-2.5 font-bold text-gray-500 border-none hover:bg-gray-50">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(product.slug)}
                          className="rounded-full px-8 py-2.5 bg-red-600 text-white font-bold hover:bg-red-700 transition-all border-none"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black" asChild>
                    <a href={`/category/${product.category_slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
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
      />
    </div>
  );
}
