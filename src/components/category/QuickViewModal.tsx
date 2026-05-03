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
  
  // Sort variants by price (smallest to largest)
  const sortedVariants = [...(product.variants || [])].sort((a, b) => a.price - b.price);
  
  const [selectedSize, setSelectedSize] = useState(sortedVariants[0]?.weight || '250 G');
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCartStore();

  const productImages = product.images?.length > 0 
    ? product.images.map((img: any) => img.image_url)
    : [product.primary_image || '/images/placeholder.png'];

  // Find the selected variant price
  const currentVariant = product.variants?.find((v: any) => 
    v.weight.toLowerCase().replace(' ', '') === selectedSize.toLowerCase().replace(' ', '')
  ) || { price: product.cheapest_variant_price, discount_price: null };

  const unitPrice = parseFloat(currentVariant.price || product.cheapest_variant_price);
  const originalPrice = currentVariant.discount_price ? parseFloat(currentVariant.discount_price) : null;
  const totalPrice = unitPrice * quantity;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  const handleAddToCart = async () => {
    if (isAdding || isBuyingNow) return;
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      variantId: currentVariant.id,
      name: product.name,
      price: unitPrice,
      weight: selectedSize,
      quantity: quantity,
      image: productImages[0]
    });
    setIsAdding(false);
    onClose();
  };

  const handleBuyNow = async () => {
    if (isAdding || isBuyingNow) return;
    setIsBuyingNow(true);
    addItem({
      id: `${product.id}-${selectedSize}`,
      productId: product.id,
      variantId: currentVariant.id,
      name: product.name,
      price: unitPrice,
      weight: selectedSize,
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
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-5xl rounded-2xl md:rounded-sm overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh] shadow-2xl"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 md:top-6 right-4 md:right-6 z-20 p-2 bg-white/80 backdrop-blur-sm md:bg-transparent hover:bg-gray-100 rounded-full transition-colors shadow-sm md:shadow-none"
          >
            <X className="w-5 md:w-6 h-5 md:h-6 text-gray-900" />
          </button>

          {/* Left: Image Gallery */}
          <div className="w-full md:w-1/2 bg-white p-6 md:p-8 flex flex-col items-center justify-center relative border-b md:border-r md:border-b-0 border-gray-100 shrink-0">
            <div className="relative w-full aspect-[4/3] md:aspect-square mb-4 md:mb-8 overflow-hidden">
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
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-4 md:p-8"
                  />

                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Gallery Navigation */}
            {productImages.length > 1 && (
              <div className="flex items-center gap-4 md:gap-6 mt-auto">
                <button 
                  onClick={prevImage}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-black"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {productImages.map((_: string, i: number) => (
                    <div 
                      key={i} 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentImageIndex === i ? 'w-6 bg-gray-900' : 'w-2 bg-gray-200'
                      }`} 
                    />
                  ))}
                </div>

                <button 
                  onClick={nextImage}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-black"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-2 md:space-y-4">
                <p className="text-[10px] md:text-[14px] text-gray-500 font-medium uppercase tracking-wider">HEALTHY</p>
                <h2 className="text-[28px] md:text-[42px] font-medium text-gray-900 leading-tight tracking-tight font-heading">
                  {product.name}
                </h2>
                <div className="flex items-center gap-3">
                  <p className="text-[22px] md:text-[28px] font-bold text-[#006837]">
                    Rs. {unitPrice.toFixed(2)} INR
                  </p>
                  {originalPrice && (
                    <p className="text-[16px] md:text-[18px] text-gray-400 line-through font-medium opacity-60">
                      Rs. {originalPrice.toFixed(0)}.00 INR
                    </p>
                  )}
                </div>
              </div>


              {/* Size Selection */}
              <div className="space-y-3 md:space-y-4">
                <p className="text-[14px] md:text-[15px] text-gray-900 font-medium">Available in</p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {(sortedVariants.length > 0 ? sortedVariants.map((v: any) => v.weight) : ['250 G', '500 G', '1000 G']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-[13px] md:text-[15px] font-medium transition-all ${
                        selectedSize === size 
                          ? 'border-2 border-gray-900 text-gray-900 shadow-sm' 
                          : 'border border-gray-200 text-gray-600 hover:border-gray-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className="pt-2 border-t border-gray-50 mt-4 pb-4 border-b border-gray-100">
                <div className="flex items-baseline">
                  <span className="text-[32px] md:text-[42px] font-bold text-gray-900 tracking-tighter">
                    Rs. {totalPrice.toFixed(2)} INR
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 md:gap-4 pt-2 md:pt-4">
                {product.is_sold_out ? (
                  <Button 
                    disabled
                    className="w-full bg-gray-100 text-gray-400 py-4 rounded-full font-bold h-auto cursor-not-allowed border-none"
                  >
                    Sold Out
                  </Button>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                      <div className="flex items-center border border-gray-900 rounded-full p-1 min-w-[120px] md:min-w-[140px] justify-between bg-white">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 md:p-3 hover:bg-gray-50 rounded-full transition-colors text-gray-900"
                        >
                          <Minus className="w-3.5 md:w-4 h-3.5 md:h-4" />
                        </button>
                        <span className="text-[16px] md:text-[18px] font-bold w-10 md:w-12 text-center text-gray-900">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 md:p-3 hover:bg-gray-50 rounded-full transition-colors text-gray-900"
                        >
                          <Plus className="w-3.5 md:w-4 h-3.5 md:h-4" />
                        </button>
                      </div>
                      <Button 
                        onClick={handleAddToCart}
                        loading={isAdding}
                        disabled={isBuyingNow}
                        className="flex-1 bg-black text-white py-3.5 md:py-4 px-6 md:px-8 rounded-full font-bold hover:bg-gray-800 transition-all text-[14px] md:text-[15px] h-auto"
                      >
                        Add to cart
                      </Button>
                    </div>
                    <Button 
                      onClick={handleBuyNow}
                      loading={isBuyingNow}
                      disabled={isAdding}
                      className="w-full border border-gray-900 py-3.5 md:py-4 rounded-full font-bold text-gray-900 hover:bg-gray-50 transition-all text-[14px] md:text-[15px] h-auto bg-transparent"
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
