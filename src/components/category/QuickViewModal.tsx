'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [quantity, setQuantity] = useState(1);
  
  // Sort variants by price descending (largest weight first like reference: 1000G, 500G, 250G)
  const sortedVariants = [...(product.variants || [])].sort((a, b) => b.price - a.price);
  
  const [selectedVariant, setSelectedVariant] = useState(sortedVariants[0] || null);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCartStore();

  const productImages = product.images?.length > 0 
    ? product.images.map((img: any) => img.image_url)
    : [product.primary_image || '/images/placeholder.png'];

  // Update selected variant if product changes or variants load
  useEffect(() => {
    if (sortedVariants.length > 0 && !selectedVariant) {
      setSelectedVariant(sortedVariants[0]);
    }
  }, [product, sortedVariants]);

  const unitPrice = parseFloat(selectedVariant?.price || product.cheapest_variant_price || 0);
  const originalPrice = selectedVariant?.discount_price ? parseFloat(selectedVariant.discount_price) : null;
  const totalPrice = unitPrice * quantity;
  const totalOriginalPrice = originalPrice ? originalPrice * quantity : null;
  const savings = totalOriginalPrice ? totalOriginalPrice - totalPrice : null;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  const handleAddToCart = async () => {
    if (isAdding || isBuyingNow || !selectedVariant) return;
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: unitPrice,
      weight: selectedVariant.weight,
      quantity: quantity,
      image: productImages[0]
    });
    setIsAdding(false);
    onClose();
  };

  const handleBuyNow = async () => {
    if (isAdding || isBuyingNow || !selectedVariant) return;
    setIsBuyingNow(true);
    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: unitPrice,
      weight: selectedVariant.weight,
      quantity: quantity,
      image: productImages[0]
    }, true);
    setIsBuyingNow(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0);
      setQuantity(1);
      if (product && product.variants && product.variants.length > 0) {
        const sorted = [...product.variants].sort((a, b) => b.price - a.price);
        setSelectedVariant(sorted[0]);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, product?.id]); // Only reset when modal opens or product changes


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-[900px] overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[85vh] shadow-2xl"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-1.5 hover:bg-gray-100 rounded-sm transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Left: Image Gallery */}
          <div className="w-full md:w-[45%] bg-white flex flex-col items-center justify-start relative shrink-0 pt-6">
            <div className="relative w-full aspect-square overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image 
                    src={productImages[currentImageIndex]} 
                    alt={product.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-contain p-6 md:p-10"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Gallery Navigation */}
            {productImages.length > 1 && (
              <div className="flex items-center gap-4 pb-4">
                <button 
                  onClick={prevImage}
                  className="p-1 hover:bg-white/80 rounded-full transition-colors text-gray-400 hover:text-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1.5">
                  {productImages.map((_: string, i: number) => (
                    <div 
                      key={i} 
                      onClick={() => setCurrentImageIndex(i)}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${
                        currentImageIndex === i ? 'w-5 h-2.5 bg-gray-800' : 'w-2.5 h-2.5 bg-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <button 
                  onClick={nextImage}
                  className="p-1 hover:bg-white/80 rounded-full transition-colors text-gray-400 hover:text-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="w-full md:w-[55%] p-6 md:p-8 overflow-y-auto">
            <div className="space-y-5">
              
              {/* Brand Name */}
              <p className="text-[14px] text-[#006837] font-medium tracking-wide">
                HEALTHY
              </p>

              {/* Product Name */}
              <h2 className="text-[26px] md:text-[32px] font-bold text-gray-900 leading-tight tracking-tight">
                {product.name}
              </h2>

              {/* Price Row */}
              <div className="flex items-center gap-3">
                <span className="text-[18px] md:text-[20px] font-semibold text-gray-900">
                  Rs. {unitPrice.toFixed(2)} INR
                </span>
                {originalPrice && (
                  <span className="text-[15px] text-gray-400 line-through">
                    Rs. {originalPrice.toFixed(2)} INR
                  </span>
                )}
              </div>

              {/* Available in */}
              <div className="space-y-2.5">
                <p className="text-[14px] text-gray-600">Available in</p>
                <div className="flex flex-wrap gap-2.5">
                  {sortedVariants.length > 0 ? (
                    sortedVariants.map((v: any, vIdx: number) => (
                      <button
                        type="button"
                        key={v.id || `v-${vIdx}`}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-8 py-2.5 rounded-full text-[15px] font-medium transition-all ${
                          selectedVariant?.id === v.id 
                            ? 'border-[1.5px] border-black text-black' 
                            : 'border border-gray-200 text-black hover:border-gray-400'
                        }`}
                      >
                        {v.weight}
                      </button>
                    ))
                  ) : (
                    ['1000 G', '500 G', '250 G'].map((size: string) => (
                      <button key={`fallback-${size}`} className="px-8 py-2.5 rounded-full text-[15px] font-medium border border-gray-100 text-gray-300 cursor-not-allowed">
                        {size}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Large Total Price Section */}
              <div className="border-t border-gray-100 pt-4 space-y-1">
                <p className="text-[28px] md:text-[34px] font-bold text-gray-900 tracking-tight leading-tight">
                  Rs. {totalPrice.toFixed(2)} INR
                </p>
                {totalOriginalPrice && (
                  <div className="space-y-0.5">
                    <p className="text-[13px] text-gray-400 line-through">
                      Rs. {totalOriginalPrice.toFixed(2)} INR
                    </p>
                    {savings && savings > 0 && (
                      <p className="text-[12px] text-gray-400">
                        you save Rs. {savings.toFixed(2)} INR
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-1 border-t border-gray-100">
                {product.is_sold_out ? (
                  <Button 
                    disabled
                    className="w-full bg-gray-100 text-gray-400 py-4 rounded-full font-bold h-auto cursor-not-allowed border-none"
                  >
                    Sold Out
                  </Button>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2.5 hover:bg-gray-50 transition-colors text-gray-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-[15px] font-semibold w-10 text-center text-gray-900">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2.5 hover:bg-gray-50 transition-colors text-gray-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {/* Add to Cart */}
                      <Button 
                        onClick={handleAddToCart}
                        loading={isAdding}
                        disabled={isBuyingNow}
                        className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-full font-semibold hover:bg-black transition-all text-[14px] h-auto"
                      >
                        Add to cart
                      </Button>
                    </div>
                    {/* Buy it now */}
                    <Button 
                      onClick={handleBuyNow}
                      loading={isBuyingNow}
                      disabled={isAdding}
                      className="w-full border border-gray-900 py-3 rounded-full font-semibold text-gray-900 hover:bg-gray-50 transition-all text-[14px] h-auto bg-transparent"
                    >
                      Buy it now
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
