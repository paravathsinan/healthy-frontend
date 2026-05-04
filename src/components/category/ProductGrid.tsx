'use client';

import { useState } from 'react';
import Image from 'next/image';
import { QuickViewModal } from './QuickViewModal';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { ProductCardSkeleton } from '@/components/ui/ProductCardSkeleton';

import { ProductCard } from '@/components/ui/ProductCard';
import { useCallback } from 'react';

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

  const handleQuickView = useCallback((product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleBuyNow = useCallback(async (product: any) => {
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
  }, [addItem]);

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
          products.map((product: any, index: number) => (
            <ProductCard 
              key={product.id}
              product={product}
              index={index}
              onQuickView={handleQuickView}
              onBuyNow={handleBuyNow}
              loadingId={loadingId}
            />
          ))
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
