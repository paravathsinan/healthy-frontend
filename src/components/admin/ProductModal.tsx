"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import api, { getCategories } from "@/lib/api";
import { Plus, X, Trash2, Package, Tag, Layers, Image as ImageIcon, FileText, Save, Edit3, CheckCircle2, Clock, EyeOff, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onSuccess: () => void;
  categories: any[];
  defaultCategoryId?: string;
  defaultFeatured?: boolean;
  defaultNewArrival?: boolean;
}

const productStatuses = [
  { id: 'ACTIVE', label: 'Active', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { id: 'HIDDEN', label: 'Hidden', icon: EyeOff, color: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-200' },
  { id: 'OUT_OF_STOCK', label: 'Out of Stock', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
];

const badgeCategories = [
  {
    name: "Conversion Badges",
    icon: CheckCircle2,
    badges: [
      { id: '15% OFF', label: '15% OFF' },
      { id: 'Save ₹150', label: 'Save ₹150' },
      { id: 'Bestseller', label: 'Bestseller' },
      { id: 'Hot Selling', label: 'Hot Selling' },
      { id: 'New', label: 'New' },
      { id: 'Just Added', label: 'Just Added' },
    ]
  },
  {
    name: "Urgency & Offers",
    icon: Clock,
    badges: [
      { id: 'Limited Stock', label: 'Limited Stock' },
      { id: 'Only 5 left', label: 'Only 5 left' },
      { id: 'Low Stock', label: 'Low Stock' },
      { id: 'Free Delivery', label: 'Free Delivery' },
      { id: 'Free Shipping', label: 'Free Shipping' },
    ]
  },
  {
    name: "Health & Quality",
    icon: Layers,
    badges: [
      { id: '100% Natural', label: '100% Natural' },
      { id: 'Organic', label: 'Organic' },
      { id: 'Premium Quality', label: 'Premium Quality' },
      { id: 'No Added Sugar', label: 'No Added Sugar' },
    ]
  }
];

const getBadgeColor = (tag: string) => {
  const lower = tag.toLowerCase();
  if (lower.includes('off') || lower.includes('sale') || lower.includes('limited') || lower.includes('low')) return 'bg-[#D14343]';
  if (lower.includes('bestseller') || lower.includes('hot') || lower.includes('popular')) return 'bg-amber-500';
  if (lower.includes('new') || lower.includes('just added')) return 'bg-blue-600';
  if (lower.includes('natural') || lower.includes('organic') || lower.includes('health') || lower.includes('sugar') || lower.includes('no added')) return 'bg-emerald-600';
  if (lower.includes('free') || lower.includes('delivery') || lower.includes('shipping')) return 'bg-teal-600';
  if (lower.includes('premium') || lower.includes('quality')) return 'bg-purple-600';
  return 'bg-[#006837]'; // default brand green
};

export function ProductModal({ isOpen, onClose, product, onSuccess, categories, defaultCategoryId, defaultFeatured, defaultNewArrival }: ProductModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!product);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    base_price: "",
    base_discount_price: "",
    is_featured: false,
    is_new_arrival: false,
    is_sold_out: false,
    is_hidden: false,
    badge_text: "",
    tags: [] as string[],
    stock: "100",
    image: "",
    gallery: [] as string[],
  });

  useEffect(() => {
    if (isOpen && product && categories.length > 0) {
      let detectedId = "";
      if (product.category) {
        detectedId = typeof product.category === 'object' ? product.category.id?.toString() : product.category.toString();
      }
      if (!detectedId || detectedId === "null" || detectedId === "") {
        const found = categories.find(c => c.slug === product.category_slug);
        if (found) detectedId = found.id.toString();
      }
      if (!detectedId || detectedId === "null" || detectedId === "") {
        const found = categories.find(c => c.name.toLowerCase() === product.category_name?.toLowerCase());
        if (found) detectedId = found.id.toString();
      }
      if (detectedId && detectedId !== formData.category) {
        setFormData(prev => ({ ...prev, category: detectedId }));
      }
    }
  }, [isOpen, product, categories]);

  useEffect(() => {
    setIsEditing(!product);
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: "",
        base_price: product.admin_price || "",
        base_discount_price: product.variants?.find((v: any) => v.price === product.admin_price)?.discount_price || "",
        is_featured: product.is_featured || false,
        is_new_arrival: product.is_new_arrival || false,
        is_sold_out: product.is_sold_out || false,
        is_hidden: product.is_hidden || false,
        badge_text: product.badge_text || "",
        tags: Array.isArray(product.tags) ? product.tags : [],
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
        is_hidden: false,
        badge_text: "",
        tags: [],
        stock: "100",
        image: "",
        gallery: [],
      });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const categoryId = formData.category ? parseInt(formData.category.toString()) : null;
      const payload: any = {
        name: formData.name,
        description: formData.description,
        is_featured: formData.is_featured,
        is_new_arrival: formData.is_new_arrival,
        is_sold_out: formData.is_sold_out,
        is_hidden: formData.is_hidden,
        badge_text: formData.badge_text,
        tags: formData.tags,
      };
      if (categoryId && !isNaN(categoryId)) payload.category = categoryId;
      if (formData.base_price) payload.base_price = parseFloat(formData.base_price.toString());
      if (formData.base_discount_price) payload.base_discount_price = parseFloat(formData.base_discount_price.toString());
      if (formData.image) payload.image_url = formData.image;
      if (formData.gallery && formData.gallery.length > 0) payload.gallery_images = formData.gallery;

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

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      setLoading(true);
      try {
        await api.delete(`/products/${product.slug}/`);
        toast.success("Product deleted");
        onSuccess();
        onClose();
      } catch (error) {
        toast.error("Failed to delete product");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const currentStatus = formData.is_hidden ? 'HIDDEN' : (formData.is_sold_out ? 'OUT_OF_STOCK' : 'ACTIVE');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="py-4 px-8 border-b border-gray-100 flex justify-between items-center bg-gray-100/60 shrink-0">
              <div className="flex items-center gap-5">
                {product && (
                  <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm p-1.5 bg-white/80">
                    <img src={product.primary_image || 'https://via.placeholder.com/64'} className="w-full h-full object-contain" alt={product.name} />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-gray-900 font-heading">{product ? product.name : "New Product"}</h2>
                    {product && (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${productStatuses.find(s => s.id === currentStatus)?.bg} ${productStatuses.find(s => s.id === currentStatus)?.color} ${productStatuses.find(s => s.id === currentStatus)?.border}`}>
                        {productStatuses.find(s => s.id === currentStatus)?.label}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight mt-1 flex items-center gap-2">
                    {product ? product.sku : "Listing Information"}
                    {product && <><span className="text-gray-400 mx-1">·</span><span className="text-gray-400 font-normal normal-case">ID: {product.id}</span></>}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"><X size={24} className="text-gray-900" /></button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              {/* Status Strip */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Update Product Status</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productStatuses.map((status) => {
                    const Icon = status.icon;
                    const isActive = currentStatus === status.id;
                    return (
                      <button key={status.id} disabled={!isEditing} onClick={() => {
                        if (status.id === 'ACTIVE') setFormData({ ...formData, is_sold_out: false, is_hidden: false });
                        if (status.id === 'HIDDEN') setFormData({ ...formData, is_sold_out: false, is_hidden: true });
                        if (status.id === 'OUT_OF_STOCK') setFormData({ ...formData, is_sold_out: true, is_hidden: false });
                      }} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${isActive ? `${status.bg} ${status.color} ${status.border} ring-2 ring-offset-1 ring-gray-100 shadow-sm` : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:bg-gray-50'} disabled:opacity-50`}>
                        <Icon size={14} />{status.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* General Information */}
                <div className="space-y-6 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-gray-400"><Package size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">General Information</span></div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Product Name</Label>
                      <input 
                        id="name" 
                        readOnly={!isEditing} 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        className={`w-full rounded-full border border-[#006837]/20 bg-white h-12 px-6 font-bold focus:outline-none focus:border-[#006837] !ring-0 !outline-none transition-all ${!isEditing ? 'cursor-default pointer-events-none border-gray-100/50 text-gray-500' : 'text-gray-900'}`} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</Label>
                      <Select disabled={!isEditing} value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                        <SelectTrigger className={`rounded-full border border-[#006837]/20 bg-white h-12 px-6 font-bold transition-all focus:outline-none focus:border-[#006837] !ring-0 !outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:border-[#006837] ${!isEditing ? 'cursor-default pointer-events-none text-gray-500' : 'text-gray-900'}`}><SelectValue placeholder={product?.category_name || "Select Category"} /></SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 bg-white z-[110]">{categories.map((cat) => (<SelectItem key={cat.id} value={cat.id.toString()} className="font-bold text-gray-600 focus:bg-gray-50">{cat.name}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Pricing & Visibility */}
                <div className="space-y-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-gray-400"><Tag size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Pricing & Visibility</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Price (₹) - per kg/Unit</Label>
                      <input 
                        type="number" 
                        readOnly={!isEditing} 
                        value={formData.base_price} 
                        onChange={(e) => setFormData({ ...formData, base_price: e.target.value })} 
                        className="w-full rounded-full border border-[#006837]/20 bg-white h-12 px-6 font-bold text-gray-900 focus:outline-none focus:border-[#006837] !ring-0 !outline-none transition-all" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Old Price (₹) - per kg/Unit</Label>
                      <input 
                        type="number" 
                        readOnly={!isEditing} 
                        value={formData.base_discount_price} 
                        onChange={(e) => setFormData({ ...formData, base_discount_price: e.target.value })} 
                        className="w-full rounded-full border border-[#006837]/20 bg-white h-12 px-6 font-bold text-gray-900 focus:outline-none focus:border-[#006837] !ring-0 !outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Add / Edit Custom Badge</Label>
                      <div className="flex gap-2">
                        <input 
                          readOnly={!isEditing}
                          placeholder="Type a badge and press enter..."
                          value={formData.badge_text}
                          onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (formData.badge_text.trim()) {
                                setFormData(prev => ({
                                  ...prev,
                                  tags: Array.from(new Set([...prev.tags, prev.badge_text.trim()])),
                                  badge_text: ""
                                }));
                              }
                            }
                          }}
                          className="flex-1 rounded-full border border-[#006837]/20 bg-white h-12 px-6 font-bold text-gray-900 focus:outline-none focus:border-[#006837] !ring-0 !outline-none transition-all placeholder:text-gray-300"
                        />
                        <button
                          type="button"
                          disabled={!isEditing || !formData.badge_text.trim()}
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              tags: Array.from(new Set([...prev.tags, prev.badge_text.trim()])),
                              badge_text: ""
                            }));
                          }}
                          className="h-12 px-6 rounded-full bg-[#006837] text-white font-bold text-xs hover:bg-black transition-all disabled:opacity-50"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges & Tags */}
                <div className="space-y-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-400">
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Active Product Badges</span>
                    </div>
                    {formData.tags.length > 0 && isEditing && (
                      <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, tags: [] })}
                        className="text-[9px] font-bold text-red-500 hover:underline uppercase tracking-tighter"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Active Badges Display */}
                  <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-gray-100/50 rounded-[1.5rem] border border-gray-100">
                    {formData.tags.length === 0 ? (
                      <span className="text-[11px] text-gray-400 font-medium italic p-2">No active badges. Select from below or type above...</span>
                    ) : (
                      formData.tags.map((tag, idx) => {
                        const bgColor = getBadgeColor(tag);
                        return (
                          <div 
                            key={idx} 
                            className={`group flex items-center gap-2 ${bgColor} text-white pl-2 pr-1.5 py-0.5 rounded-[2px] text-[12px] md:text-[13px] font-black shadow-lg shadow-black/10 border border-white/10 animate-in fade-in zoom-in duration-200 tracking-wider leading-tight`}
                          >
                            <span 
                              className={`cursor-pointer ${isEditing ? 'hover:underline' : ''}`}
                              onClick={() => isEditing && setFormData({ ...formData, badge_text: tag, tags: formData.tags.filter((_, i) => i !== idx) })}
                            >
                              {tag}
                            </span>
                            {isEditing && (
                              <button 
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }))}
                                className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
                              >
                                <X size={10} />
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="space-y-8 bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
                    {badgeCategories.map((category) => (
                      <div key={category.name} className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-400 mb-2"><category.icon size={12} /><span className="text-[9px] font-black uppercase tracking-widest">{category.name}</span></div>
                        <div className="flex flex-wrap gap-2">
                          {category.badges.map((badge) => {
                            const isSelected = formData.tags.includes(badge.label);
                            
                            return (
                              <button 
                                key={badge.id} 
                                type="button" 
                                disabled={!isEditing} 
                                onClick={() => {
                                  if (isSelected) {
                                    setFormData(prev => ({
                                      ...prev,
                                      tags: prev.tags.filter(t => t !== badge.label)
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      tags: Array.from(new Set([...prev.tags, badge.label]))
                                    }));
                                  }
                                }} 
                                className={`px-4 py-2 rounded-full text-[11px] font-bold border transition-all ${isSelected ? "bg-[#006837] text-white border-[#006837] shadow-md scale-105" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
                              >
                                {badge.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Media */}
                <div className="space-y-6 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-gray-400"><ImageIcon size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Product Media</span></div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className={`group relative aspect-square border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col items-center justify-center p-2 cursor-pointer ${isEditing ? 'hover:border-[#006837]' : ''}`} onClick={() => isEditing && document.getElementById('primary-upload')?.click()}>
                      {formData.image ? <img src={formData.image} alt="Primary" className="w-full h-full object-contain" /> : <Plus className="h-6 w-6 text-gray-300" />}
                      <input id="primary-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </div>
                    {formData.gallery.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl bg-white border border-gray-100 overflow-hidden group">
                        <img src={img} className="w-full h-full object-contain" alt="" />
                        {isEditing && <button type="button" onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, i) => i !== idx)})} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><X size={10} /></button>}
                      </div>
                    ))}
                    {isEditing && formData.gallery.length < 3 && (
                      <div className="aspect-square border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white flex items-center justify-center cursor-pointer" onClick={() => document.getElementById('gallery-upload')?.click()}>
                        <Plus className="h-6 w-6 text-gray-300" /><input id="gallery-upload" type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          files.forEach(f => {
                            const r = new FileReader();
                            r.onloadend = () => setFormData(prev => ({...prev, gallery: [...prev.gallery, r.result as string].slice(0, 3)}));
                            r.readAsDataURL(f);
                          });
                        }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-6 pt-6 border-t border-gray-50 pb-8">
                  <div className="flex items-center gap-3 text-gray-400"><FileText size={16} /><span className="text-[10px] font-bold uppercase tracking-widest">Description</span></div>
                  <textarea 
                    readOnly={!isEditing} 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    className="w-full rounded-[2rem] border border-[#006837]/20 bg-white min-h-[150px] font-medium p-6 focus:outline-none focus:border-[#006837] !ring-0 !outline-none transition-all" 
                    placeholder="Enter product details..." 
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="py-4 px-8 bg-gray-100/80 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-6 shrink-0">
              <div className="flex items-center gap-4 flex-1">
                {!isEditing && (
                  <div><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-xs">Product Price</p><p className="text-2xl md:text-3xl font-black text-gray-900 font-heading tracking-tighter">₹{formData.base_price}</p></div>
                )}
                {isEditing && (
                  <button onClick={() => product ? setIsEditing(false) : onClose()} className="px-6 py-4 rounded-2xl bg-white border border-gray-100 text-gray-500 font-bold text-xs hover:bg-gray-50 transition-all">Cancel</button>
                )}
              </div>
              <div className="flex gap-3">
                {!isEditing ? (
                  <>
                    <button type="button" onClick={handleDelete} className="px-6 py-4 rounded-2xl bg-white border border-red-100 text-red-500 font-bold text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-2"><Trash2 size={16} />Delete</button>
                    <button onClick={() => setIsEditing(true)} className="bg-[#006837] text-white px-12 py-4 rounded-full text-sm font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"><Edit3 size={18} />Edit Product</button>
                  </>
                ) : (
                  <button type="submit" onClick={handleSubmit} disabled={loading} className="bg-[#006837] text-white px-12 py-4 rounded-full text-sm font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 min-w-[200px]">
                    {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{product ? <Save size={18} /> : <Plus size={18} />}{product ? "Save Changes" : "Add Product"}</>}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
