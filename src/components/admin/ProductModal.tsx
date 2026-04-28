"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import api, { getCategories } from "@/lib/api";
import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";


interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onSuccess: () => void;
  defaultCategoryId?: string;
  defaultFeatured?: boolean;
  defaultNewArrival?: boolean;
}


export function ProductModal({ isOpen, onClose, product, onSuccess, defaultCategoryId, defaultFeatured, defaultNewArrival }: ProductModalProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    base_price: "",
    base_discount_price: "",
    is_featured: false,
    is_new_arrival: false,
    is_sold_out: false,
    badge_text: "",
    stock: "100",
    image: "",
    gallery: [] as string[],
  });

  useEffect(() => {
    fetchCategories();
    if (product) {
      // Find the 1000g variant for the base price
      const baseVariant = product.variants?.find((v: any) => v.weight.includes('1000'));
      
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category?.toString() || "",
        base_price: baseVariant ? baseVariant.price : (product.cheapest_variant_price || ""),
        base_discount_price: baseVariant ? (baseVariant.discount_price || "") : "",
        is_featured: product.is_featured || false,
        is_new_arrival: product.is_new_arrival || false,
        is_sold_out: product.is_sold_out || false,
        badge_text: product.badge_text || "",
        stock: "100",
        image: product.images?.find((img: any) => img.is_primary)?.image_url || "",
        gallery: product.images?.filter((img: any) => !img.is_primary).map((img: any) => img.image_url) || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        category: defaultCategoryId || "",
        base_price: "",
        base_discount_price: "",
        is_featured: defaultFeatured || false,
        is_new_arrival: defaultNewArrival || false,
        is_sold_out: false,
        badge_text: "",
        stock: "100",
        image: "",
        gallery: [],
      });
    }
  }, [product, isOpen, defaultCategoryId, defaultFeatured, defaultNewArrival]);



  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryId = parseInt(formData.category);
      if (isNaN(categoryId)) {
        toast.error("Please select a valid category");
        setLoading(false);
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        category: categoryId,
        is_featured: formData.is_featured,
        is_new_arrival: formData.is_new_arrival,
        is_sold_out: formData.is_sold_out,
        badge_text: formData.badge_text,
        base_price: parseFloat(formData.base_price),
        base_discount_price: formData.base_discount_price ? parseFloat(formData.base_discount_price) : null,
        image_url: formData.image,
        gallery_images: formData.gallery,
      };


      if (product) {
        await api.patch(`/products/${product.slug}/`, payload);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products/", payload);
        toast.success("Product created successfully");
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
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[550px] bg-white rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden"
      >
        <div className="max-h-[90vh] overflow-y-auto p-5 md:p-8 pt-8 md:pt-10">
          <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-black text-gray-900 font-heading">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fill in the details for your product listing.
          </DialogDescription>
        </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-600">Product Name</Label>
            <Input 
              id="name"
              placeholder="e.g. Premium Ajwa Dates"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="rounded-xl border-gray-200 bg-white focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 transition-all h-11 md:h-12 font-semibold text-gray-900 placeholder:text-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-600">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(val: string) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger className="rounded-xl border-gray-200 bg-white h-11 md:h-12 font-semibold text-gray-900 focus:border-[#006837] transition-all">
                  <SelectValue placeholder="Select Category" className="placeholder:text-gray-400" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-100 rounded-xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()} className="font-semibold text-gray-900 hover:bg-gray-50 focus:bg-gray-50 focus:text-black">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-600">Price for 1KG / 1Unit (₹)</Label>
              <Input 
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                className="rounded-xl border-gray-200 bg-white focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 transition-all h-11 md:h-12 font-semibold text-gray-900 placeholder:text-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount_price" className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-gray-600">Original Price (₹) (Optional)</Label>
              <Input 
                id="discount_price"
                type="number"
                placeholder="0.00"
                value={formData.base_discount_price}
                onChange={(e) => setFormData({ ...formData, base_discount_price: e.target.value })}
                className="rounded-xl border-gray-200 bg-white focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 transition-all h-11 md:h-12 font-semibold text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="badge" className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Custom Badge (e.g. 16% OFF)</Label>
            <Input 
              id="badge"
              placeholder="PROMO TEXT"
              value={formData.badge_text}
              onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
              className="rounded-xl border-gray-200 bg-white focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 transition-all h-12 font-semibold text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <Switch 
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={(val: boolean) => setFormData({ ...formData, is_featured: val })}
                className="data-[state=checked]:bg-[#006837]"
              />
              <Label htmlFor="featured" className="text-sm font-bold text-gray-700 cursor-pointer">Show in Trending</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch 
                id="new_arrival"
                checked={formData.is_new_arrival}
                onCheckedChange={(val: boolean) => setFormData({ ...formData, is_new_arrival: val })}
                className="data-[state=checked]:bg-[#006837]"
              />
              <Label htmlFor="new_arrival" className="text-sm font-bold text-gray-700 cursor-pointer">Show in What's New</Label>
            </div>
            <div className="flex items-center gap-3 md:col-span-2 pt-2 border-t border-gray-200/50">
              <Switch 
                id="sold_out"
                checked={formData.is_sold_out}
                onCheckedChange={(val: boolean) => setFormData({ ...formData, is_sold_out: val })}
                className="data-[state=checked]:bg-red-600"
              />
              <Label htmlFor="sold_out" className="text-sm font-bold text-gray-700 cursor-pointer">Mark as Sold Out</Label>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Product Images</Label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Primary Image */}
              <div 
                className="group relative aspect-square border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-white hover:border-[#006837] transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center p-2"
                onClick={() => document.getElementById('primary-upload')?.click()}
              >
                {formData.image ? (
                  <div className="relative w-full h-full">
                    <img src={formData.image} alt="Primary" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] font-bold">Change Cover</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-gray-400 mb-1" />
                    <span className="text-[10px] font-bold text-gray-400">Cover Image</span>
                  </>
                )}
                <input 
                  id="primary-upload"
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData({ ...formData, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>

              {/* Gallery Images */}
              {formData.gallery.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden group">
                  <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => {
                      const newGallery = [...formData.gallery];
                      newGallery.splice(index, 1);
                      setFormData({ ...formData, gallery: newGallery });
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {/* Add to Gallery Button */}
              {formData.gallery.length < 5 && (
                <div 
                  className="group relative aspect-square border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-white hover:border-[#006837] transition-all cursor-pointer flex flex-col items-center justify-center text-center p-2"
                  onClick={() => document.getElementById('gallery-upload')?.click()}
                >
                  <Plus className="h-5 w-5 text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-gray-400">Add Gallery</span>
                  <input 
                    id="gallery-upload"
                    type="file" 
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData(prev => ({ 
                            ...prev, 
                            gallery: [...prev.gallery, reader.result as string].slice(0, 5) 
                          }));
                        };
                        reader.readAsDataURL(file);
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </div>


          <div className="space-y-2">
            <Label htmlFor="description" className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Description</Label>
            <Textarea 
              id="description"
              placeholder="Tell us about this premium product..."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-xl border-gray-200 bg-white focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 transition-all min-h-[100px] font-semibold text-gray-900 placeholder:text-gray-400"
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
              loading={loading}
              className="rounded-full px-12 py-6 bg-[#006837] text-white font-bold hover:bg-black transition-all shadow-lg shadow-[#006837]/20 flex-1"
            >
              {product ? "Update Product" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  </Dialog>
  );
}

