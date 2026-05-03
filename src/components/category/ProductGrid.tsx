'use client';

import { useState } from 'react';
import Image from 'next/image';
import { QuickViewModal } from './QuickViewModal';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { ProductCardSkeleton } from '@/components/ui/ProductCardSkeleton';

interface ProductGridProps {
  products: any[];
  columns?: number;
  loading?: boolean;
}

export const ProductGrid = ({ products, columns = 3, loading = false }: ProductGridProps) => {

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { addItem } = useCartStore();

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleBuyNow = async (product: any) => {
    setLoadingId(product.id);
    addItem({
      id: `${product.id}-default`,
      name: product.name,
      price: parseFloat(product.cheapest_variant_price),
      weight: 'Standard',
      quantity: 1,
      image: product.primary_image || '/images/placeholder.png'
    }, true);
    setLoadingId(null);
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[columns as 1 | 2 | 3 | 4] || 'grid-cols-2 md:grid-cols-3';

  return (
    <>
      <div className={`grid ${gridCols} gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16`}>
        {loading ? (
          Array.from({ length: columns * 2 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        ) : (
          products.map((product: any) => {
            const isBuyNow = product.button === 'buy now';
            
            return (
              <div key={product.id} className="group flex flex-col items-center text-center bg-white p-2 md:p-4 rounded-2xl border border-transparent hover:border-gray-50 transition-all">
                <div 
                  className="relative w-full aspect-square mb-4 md:mb-8 block cursor-pointer group"
                  onClick={() => isBuyNow ? handleBuyNow(product) : handleQuickView(product)}
                >
                  {/* Badges Stack */}
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10 flex flex-col items-end gap-1 md:gap-2">
                    {product.is_sold_out && (
                      <span className="bg-[#717171] text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-sm uppercase tracking-wider shadow-sm">
                        SOLD OUT
                      </span>
                    )}
                    {product.badge_text && (
                      <span className="bg-[#D34D4D] text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-sm uppercase tracking-wider shadow-sm">
                        {product.badge_text}
                      </span>
                    )}
                    {product.discount && !product.badge_text && (
                      <span className="bg-[#D34D4D] text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-sm uppercase tracking-wider shadow-sm">
                        {product.discount}
                      </span>
                    )}
                  </div>

                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image 
                      src={product.primary_image || '/images/placeholder.png'} 
                      alt={product.name} 
                      fill 
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className={`object-contain transition-transform duration-700 group-hover:scale-110 ${product.is_sold_out ? 'grayscale opacity-60' : ''}`}
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
                        onClick={() => isBuyNow ? handleBuyNow(product) : handleQuickView(product)}
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
          })
        )}
      </div>


      {selectedProduct && (
        <QuickViewModal 
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
