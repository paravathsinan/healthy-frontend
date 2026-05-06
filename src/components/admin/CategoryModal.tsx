"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";


interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: any;
  onSuccess: () => void;
}

export function CategoryModal({ isOpen, onClose, category, onSuccess }: CategoryModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    display_order: 0,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        image_url: category.image_url || "",
        display_order: category.display_order || 0,
      });
    } else {
      setFormData({
        name: "",
        image_url: "",
        display_order: 0,
      });
    }
  }, [category, isOpen]);

  /**
   * Uploads directly to Cloudinary using a signed token from our backend.
   * No Base64 — the raw file goes straight to Cloudinary, only the URL comes back.
   */
  const uploadToCloudinary = async (file: File | null) => {
    if (!file) return;
    const folder = 'dates_nuts/categories';
    setUploadingImage(true);

    try {
      // 1. Get a signed upload token from the backend
      const { data: sig } = await api.get(`/cloudinary-signature/?folder=${folder}`);

      // 2. Build multipart form for Cloudinary
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', sig.api_key);
      form.append('timestamp', sig.timestamp);
      form.append('signature', sig.signature);
      form.append('folder', sig.folder);

      // 3. POST directly to Cloudinary — no Django relay, no size limit issues
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
        { method: 'POST', body: form }
      );
      const result = await res.json();

      if (!result.secure_url) throw new Error(result.error?.message || 'Upload failed');

      setFormData(prev => ({ ...prev, image_url: result.secure_url }));
    } catch (err: any) {
      toast.error(`Image upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        await api.patch(`/categories/${category.id}/`, formData);
        toast.success("Category updated successfully");
      } else {
        await api.post("/categories/", formData);
        toast.success("Category created successfully");
      }
      onSuccess();
      router.refresh();
      onClose();

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="w-[95%] sm:max-w-[450px] bg-white rounded-3xl p-6 md:p-8 border-none shadow-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-black text-gray-900 font-heading">
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Manage your store categories here.
          </DialogDescription>
        </DialogHeader>

        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Category Name</Label>
            <Input 
              id="name"
              placeholder="e.g. Premium Dates"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="rounded-xl border-gray-200 bg-white focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 transition-all h-12 font-semibold text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Category Image</Label>
            <div 
              className="group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-white hover:border-[#006837] transition-all cursor-pointer overflow-hidden"
              onClick={() => !uploadingImage && document.getElementById('category-image-upload')?.click()}
            >
              {uploadingImage ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-7 w-7 border-2 border-[#006837]/30 border-t-[#006837] rounded-full animate-spin" />
                  <p className="text-xs font-bold text-gray-400">Uploading to Cloudinary…</p>
                </div>
              ) : formData.image_url ? (
                <div className="relative w-full h-full p-4">
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    className="w-full h-full object-contain" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold">Change Image</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-white shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <Plus className="h-5 w-5 text-gray-400 group-hover:text-[#006837]" />
                  </div>
                  <p className="text-xs font-bold text-gray-400 group-hover:text-gray-600">Click to upload image</p>
                </>
              )}
              <input 
                id="category-image-upload"
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadToCloudinary(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order" className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Display Order</Label>
            <Input 
              id="order"
              type="number"
              value={formData.display_order}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setFormData({ ...formData, display_order: isNaN(val) ? 0 : val });
              }}
              className="rounded-xl border-gray-200 bg-white focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 transition-all h-12 font-semibold text-gray-900"
            />
          </div>

          <DialogFooter className="pt-4 flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="rounded-full px-8 py-6 font-bold text-gray-500 hover:text-black hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || uploadingImage}
              loading={loading}
              className="rounded-full px-12 py-6 bg-[#006837] text-white font-bold hover:bg-black transition-all shadow-lg shadow-[#006837]/20 flex-1 min-w-[180px] disabled:opacity-60"
            >
              {loading 
                ? (category ? "Updating..." : "Creating...") 
                : (category ? "Update Category" : "Create Category")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
