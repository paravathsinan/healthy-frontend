"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, MessageCircle, Star, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { sendWhatsAppOrder } from "@/lib/whatsapp";
import { toast } from "sonner";

interface ProductViewProps {
  product: any;
}

export default function ProductView({ product }: ProductViewProps) {
  // Sort variants by price (smallest to largest)
  const sortedVariants = [...(product.variants || [])].sort((a, b) => a.price - b.price);
  const [selectedVariant, setSelectedVariant] = useState(sortedVariants[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    addItem({
      id: selectedVariant.id,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      weight: selectedVariant.weight,
      price: selectedVariant.price,
      quantity: 1,
      image: product.images?.[0]?.image_url || product.primary_image,
    });
    setIsAdding(false);
    toast.success("Added to basket!");
  };

  const handleWhatsAppOrder = async () => {
    setIsOrdering(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    sendWhatsAppOrder(product.name, selectedVariant.weight, selectedVariant.price);
    setIsOrdering(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-stone-100 shadow-sm group">
            <Image 
              src={product.images?.[0]?.image_url || product.primary_image || '/images/placeholder.png'} 
              alt={product.name} 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.slice(1).map((img: any, i: number) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-stone-50 border border-stone-100">
                <Image src={img.image_url} alt={product.name} fill sizes="25vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {product.badge_text && (
                <span className="bg-[#D14343] text-white text-[12px] md:text-[15px] font-black px-2 md:px-3 py-0.5 rounded-[2px] uppercase tracking-wider shadow-lg shadow-black/10 border border-white/10 leading-tight">
                  {product.badge_text}
                </span>
              )}
              {Array.isArray(product.tags) && product.tags.map((tag: string) => {
                const t = tag.toLowerCase();
                let style = "bg-[#006837] text-white";
                if (t.includes('off') || t.includes('save') || t.includes('sale') || t.includes('limited') || t.includes('low') || t.includes('left')) style = "bg-[#D14343] text-white";
                else if (t.includes('bestseller') || t.includes('hot') || t.includes('popular')) style = "bg-amber-500 text-white";
                else if (t.includes('new') || t.includes('added')) style = "bg-blue-600 text-white";
                else if (t.includes('free') || t.includes('delivery') || t.includes('shipping')) style = "bg-teal-600 text-white";
                else if (t.includes('natural') || t.includes('organic') || t.includes('health') || t.includes('sugar') || t.includes('quality')) style = "bg-emerald-600 text-white";
                else if (t.includes('premium')) style = "bg-purple-600 text-white";

                return (
                  <span key={tag} className={`${style} text-[12px] md:text-[15px] font-black px-2 md:px-3 py-0.5 rounded-[2px] uppercase tracking-wider shadow-lg shadow-black/10 border border-white/10 whitespace-nowrap leading-tight`}>
                    {tag}
                  </span>
                );
              })}
              <div className="flex items-center text-amber-500 gap-0.5">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-bold text-stone-900 ml-1">4.9 (120+ reviews)</span>
              </div>
            </div>
            <p className="text-[14px] text-[#006837] font-medium tracking-wide mb-2">HEALTHY</p>
            <h1 className="text-4xl font-bold text-stone-900 tracking-tight">{product.name}</h1>
            <p className="text-gray-500 text-lg leading-relaxed">{product.description}</p>
          </div>

          {/* Pricing & Variants */}
          <div className="mb-8 border-t border-b border-gray-100 py-6">
            <div className="space-y-4">
              <p className="text-[15px] text-gray-600 font-medium">Available in</p>
              <div className="flex flex-wrap gap-3 mb-6">
                {sortedVariants.map((v: any, vIdx: number) => (
                  <button
                    type="button"
                    key={v.id || `v-${vIdx}`}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-8 py-2.5 rounded-full text-[15px] font-medium transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-[1.5px] border-black text-black shadow-sm'
                        : 'border border-gray-200 text-black hover:border-gray-400'
                    }`}
                  >
                    {v.weight}
                  </button>
                ))}
              </div>
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-[32px] md:text-[42px] font-bold text-gray-900 tracking-tight">
                  Rs. {selectedVariant?.price || 0} INR
                </span>
                {selectedVariant?.discount_price && (
                  <span className="text-[18px] text-gray-400 line-through">
                    Rs. {selectedVariant.discount_price} INR
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100">
                <Truck className="h-5 w-5 text-amber-600" />
                <span className="text-xs font-medium text-stone-700 uppercase tracking-wide">Fast Delivery</span>
             </div>
             <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100">
                <ShieldCheck className="h-5 w-5 text-amber-600" />
                <span className="text-xs font-medium text-stone-700 uppercase tracking-wide">Pure & Natural</span>
             </div>
          </div>

          {/* Action Bar (Sticky Mobile) */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 md:relative md:bg-transparent md:border-none md:p-0 z-40">
            <div className="flex gap-4 max-w-7xl mx-auto">
              <Button 
                onClick={handleAddToCart}
                loading={isAdding}
                className="flex-1 py-7 rounded-2xl border-2 border-stone-900 text-stone-900 font-bold text-lg hover:bg-stone-50 bg-transparent h-auto"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Basket
              </Button>
              <Button 
                onClick={handleWhatsAppOrder}
                loading={isOrdering}
                className="flex-1 py-7 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg shadow-green-200 h-auto"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Order via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
