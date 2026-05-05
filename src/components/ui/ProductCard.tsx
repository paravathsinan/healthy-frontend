"use client";

import React from "react";
import Image from "next/image";
import { Button } from "./button";
import { getOptimizedImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: any;
  index: number;
  onQuickView: (product: any) => void;
  onBuyNow: (product: any) => void;
  loadingId?: string | null;
}

const ProductCardBase = ({ product, index, onQuickView, onBuyNow, loadingId }: ProductCardProps) => {
  const isBuyNow = product.button === 'buy now';
  
  // Use w_400 for grid images for best balance
  const displayImage = getOptimizedImageUrl(product.primary_image, 400);

  return (
    <div className="group flex flex-col items-center text-center bg-white p-2 md:p-4 rounded-2xl border border-transparent hover:border-gray-50 transition-all">
      <div 
        className="relative w-full aspect-square mb-4 md:mb-8 block cursor-pointer group"
        onClick={() => isBuyNow ? onBuyNow(product) : onQuickView(product)}
      >
        {/* Badges Stack */}
        <div className="absolute top-2 md:top-4 left-2 md:left-4 z-10 flex flex-wrap gap-1 md:gap-1.5 max-w-[80%]">
          {product.is_sold_out && (
            <span className="bg-gray-900/80 backdrop-blur-md text-white text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
              SOLD OUT
            </span>
          )}
          
          {/* Primary Badge (Manual Badge Text) */}
          {product.badge_text && (
            <span className="bg-[#D14343] text-white text-[12px] md:text-[15px] font-black px-2 md:px-3 py-0.5 rounded-[2px] uppercase tracking-wider shadow-lg shadow-black/10 border border-white/10 leading-tight">
              {product.badge_text}
            </span>
          )}

          {/* Dynamic Tags */}
          {Array.isArray(product.tags) && product.tags.map((tag: string, idx: number) => {
            const t = tag.toLowerCase();
            let style = "bg-[#006837] text-white";
            
            if (t.includes('off') || t.includes('save') || t.includes('sale') || t.includes('limited') || t.includes('low') || t.includes('left')) 
              style = "bg-[#D14343] text-white";
            else if (t.includes('bestseller') || t.includes('hot') || t.includes('popular')) 
              style = "bg-amber-500 text-white";
            else if (t.includes('new') || t.includes('added')) 
              style = "bg-blue-600 text-white";
            else if (t.includes('free') || t.includes('delivery') || t.includes('shipping')) 
              style = "bg-teal-600 text-white";
            else if (t.includes('natural') || t.includes('organic') || t.includes('health') || t.includes('sugar') || t.includes('quality')) 
              style = "bg-emerald-600 text-white";
            else if (t.includes('premium'))
              style = "bg-purple-600 text-white";

            return (
              <span key={`tag-${tag}-${idx}`} className={`${style} text-[12px] md:text-[15px] font-black px-2 md:px-3 py-0.5 rounded-[2px] uppercase tracking-wider shadow-lg shadow-black/10 border border-white/10 whitespace-nowrap leading-tight`}>
                {tag}
              </span>
            );
          })}
        </div>

        <div className="relative w-full h-full flex items-center justify-center">
          <Image 
            src={displayImage} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 50vw, 33vw"
            className={`object-contain transition-transform duration-700 group-hover:scale-110 ${product.is_sold_out ? 'grayscale opacity-60' : ''}`}
            priority={index < 4}
          />
        </div>
      </div>
      
      <div className="space-y-1.5 md:space-y-3 w-full px-1 md:px-2 flex-1 flex flex-col">
        <p className="text-[10px] md:text-[14px] text-gray-600 font-medium tracking-tight">
          {product.on_sale ? 'On Sale from ' : 'From '}Rs. {parseFloat(product.cheapest_variant_price).toFixed(2)}
        </p>
        <h3 className="text-[13px] md:text-[18px] font-bold text-gray-900 leading-tight flex-1 line-clamp-2">
          {product.name}
        </h3>
        <div className="pt-2 md:pt-4">
          {product.is_sold_out ? (
            <div className="h-10 md:h-12" />
          ) : (
            <Button 
              onClick={() => isBuyNow ? onBuyNow(product) : onQuickView(product)}
              loading={loadingId === product.id}
              className="w-full py-2.5 md:py-3.5 border border-gray-900 rounded-full text-[11px] md:text-[14px] font-bold text-gray-900 hover:bg-black hover:text-white transition-all tracking-wider bg-transparent h-auto"
            >
              {isBuyNow ? 'Buy Now' : 'Options'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProductCard = React.memo(ProductCardBase);
