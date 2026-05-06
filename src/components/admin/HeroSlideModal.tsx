"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import api from "@/lib/api";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeroSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  slide?: any;
  onSuccess: () => void;
}

export function HeroSlideModal({ isOpen, onClose, slide, onSuccess }: HeroSlideModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    button_text: "Explore Now",
    button_link: "/category/all",
    image_url: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title || "",
        subtitle: slide.subtitle || "",
        button_text: slide.button_text || "Explore Now",
        button_link: slide.button_link || "/category/all",
        image_url: slide.image_url || "",
        display_order: slide.display_order || 0,
        is_active: slide.is_active ?? true,
      });
    } else {
      setFormData({
        title: "",
        subtitle: "",
        button_text: "Explore Now",
        button_link: "/category/all",
        image_url: "",
        display_order: 0,
        is_active: true,
      });
    }
  }, [slide, isOpen]);

  /**
   * Sends the raw file as multipart/form-data to our Django backend.
   * Django passes it to the Cloudinary SDK (already configured via env vars on Render).
   * Hero slides are large — this is especially critical for production reliability.
   */
  const uploadToCloudinary = async (file: File | null) => {
    if (!file) return;
    setUploadingImage(true);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'dates_nuts/hero');

      const { data } = await api.post('/upload-image/', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!data.url) throw new Error('Upload failed — no URL returned');

      setFormData(prev => ({ ...prev, image_url: data.url }));
      toast.success('Image uploaded successfully');
    } catch (err: any) {
      toast.error(`Image upload failed: ${err.response?.data?.error || err.message || 'Unknown error'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (slide) {
        await api.patch(`/heroslides/${slide.id}/`, formData);
        toast.success("Slide updated successfully");
      } else {
        await api.post("/heroslides/", formData);
        toast.success("Slide created successfully");
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
        className="sm:max-w-[550px] bg-white rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden"
      >

        <div className="max-h-[90vh] overflow-y-auto p-8 pt-10">
          <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-black text-gray-900 font-heading">
            {slide ? "Edit Hero Slide" : "Add New Hero Slide"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fill in the details for the hero banner slide.
          </DialogDescription>
        </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Slide Title</Label>
              <Input 
                id="title"
                placeholder="e.g. Nature's Finest Selection"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="rounded-xl border-[#006837]/20 focus:border-[#006837] focus-visible:ring-0 focus-visible:ring-offset-0 bg-white h-12 font-semibold text-gray-900 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle" className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Subtitle</Label>
              <Textarea 
                id="subtitle"
                placeholder="e.g. From the heart of the world's best groves..."
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="rounded-xl border-[#006837]/20 focus:border-[#006837] focus-visible:ring-0 focus-visible:ring-offset-0 bg-white min-h-[100px] font-semibold text-gray-900 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="btn_text" className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Button Text</Label>
                <Input 
                  id="btn_text"
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  className="rounded-xl border-[#006837]/20 focus:border-[#006837] focus-visible:ring-0 focus-visible:ring-offset-0 bg-white h-12 font-semibold text-gray-900 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="btn_link" className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Button Link</Label>
                <Input 
                  id="btn_link"
                  value={formData.button_link}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                  className="rounded-xl border-[#006837]/20 focus:border-[#006837] focus-visible:ring-0 focus-visible:ring-offset-0 bg-white h-12 font-semibold text-gray-900 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order" className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Display Order</Label>
                <Input 
                  id="order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="rounded-xl border-[#006837]/20 focus:border-[#006837] focus-visible:ring-0 focus-visible:ring-offset-0 bg-white h-12 font-semibold text-gray-900 transition-all"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch 
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(val) => setFormData({ ...formData, is_active: val })}
                  className="data-[state=checked]:bg-[#006837]"
                />
                <Label htmlFor="active" className="text-sm font-bold text-gray-700 cursor-pointer">Active</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-600">Slide Image</Label>
              <div 
                className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-white hover:border-[#006837] transition-all cursor-pointer overflow-hidden"
                onClick={() => !uploadingImage && document.getElementById('slide-image-upload')?.click()}
              >
                {uploadingImage ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-7 w-7 border-2 border-[#006837]/30 border-t-[#006837] rounded-full animate-spin" />
                    <p className="text-xs font-bold text-gray-400">Uploading to Cloudinary…</p>
                    <p className="text-[10px] text-gray-300">Large images may take a moment</p>
                  </div>
                ) : formData.image_url ? (
                  <div className="relative w-full h-full">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-white shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <Plus className="h-5 w-5 text-gray-400 group-hover:text-[#006837]" />
                    </div>
                    <p className="text-xs font-bold text-gray-400 group-hover:text-gray-600">Upload Slide Image (1920x800 recommended)</p>
                  </>
                )}
                <input 
                  id="slide-image-upload"
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => uploadToCloudinary(e.target.files?.[0] || null)}
                />
              </div>
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
                className="rounded-full px-12 py-6 bg-[#006837] text-white font-bold hover:bg-black transition-all shadow-lg shadow-[#006837]/20 flex-1 disabled:opacity-60"
              >
                {slide ? "Update Slide" : "Create Slide"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
