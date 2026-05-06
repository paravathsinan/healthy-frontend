'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  // Per-variant quantity map: variantId -> qty (0 means not selected)
  const [variantQtys, setVariantQtys] = useState<Record<string, number>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCartStore();

  // Sort variants by price descending (1000G first, then 500G, 250G)
  const sortedVariants = [...(product.variants || [])].sort((a, b) => b.price - a.price);

  const productImages = product.images?.length > 0
    ? product.images.map((img: any) => img.image_url)
    : [product.primary_image || '/images/placeholder.png'];

  // Reset state when modal opens or product changes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0);
      setVariantQtys({});
      setIsAdding(false);
      setIsBuyingNow(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, product?.id]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);

  const setVariantQty = (variantId: string, qty: number) => {
    setVariantQtys(prev => ({ ...prev, [variantId]: Math.max(0, qty) }));
  };

  // All variants with qty > 0
  const selectedItems = sortedVariants.filter(v => (variantQtys[String(v.id)] || 0) > 0);

  // Total price across all selected variants
  const totalPrice = sortedVariants.reduce((sum, v) => {
    const qty = variantQtys[String(v.id)] || 0;
    return sum + parseFloat(v.price) * qty;
  }, 0);

  // Total original price (for savings display)
  const totalOriginalPrice = sortedVariants.reduce((sum, v) => {
    const qty = variantQtys[String(v.id)] || 0;
    const orig = v.discount_price ? parseFloat(v.discount_price) : parseFloat(v.price);
    return sum + orig * qty;
  }, 0);

  const totalSavings = totalOriginalPrice - totalPrice;
  const hasSelection = selectedItems.length > 0;
  const totalQty = selectedItems.reduce((s, v) => s + (variantQtys[String(v.id)] || 0), 0);

  const handleAddToCart = async () => {
    if (isAdding || isBuyingNow || !hasSelection) return;
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    // Add each selected variant as a separate cart line item
    selectedItems.forEach(v => {
      addItem({
        id: `${product.id}-${v.id}`,
        productId: product.id,
        variantId: v.id,
        name: product.name,
        price: parseFloat(v.price),
        weight: v.weight,
        quantity: variantQtys[String(v.id)],
        image: productImages[0],
      });
    });
    setIsAdding(false);
    onClose();
  };

  const handleBuyNow = async () => {
    if (isAdding || isBuyingNow || !hasSelection) return;
    setIsBuyingNow(true);
    selectedItems.forEach(v => {
      addItem({
        id: `${product.id}-${v.id}`,
        productId: product.id,
        variantId: v.id,
        name: product.name,
        price: parseFloat(v.price),
        weight: v.weight,
        quantity: variantQtys[String(v.id)],
        image: productImages[0],
      }, true);
    });
    setIsBuyingNow(false);
    onClose();
  };

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
          className="relative bg-white w-full max-w-[850px] overflow-hidden flex flex-col md:flex-row h-[80vh] shadow-2xl rounded-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-100 bg-white/80 backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Left: Image Gallery */}
          <div className="w-full h-[38%] md:h-full md:w-[44%] bg-white flex flex-col items-center justify-center relative shrink-0 border-b md:border-b-0 md:border-r border-gray-100 py-6">
            <div className="relative w-full h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={productImages[currentImageIndex]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 44vw"
                    className="object-contain p-6 md:p-10"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Gallery Navigation */}
            {productImages.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
                <button onClick={prevImage} className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-700 border border-gray-100 bg-white shadow-sm">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-gray-100/50 shadow-sm">
                  {productImages.map((_: string, i: number) => (
                    <div
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`rounded-full transition-all duration-300 cursor-pointer ${currentImageIndex === i ? 'w-5 h-2 bg-gray-800' : 'w-2 h-2 bg-gray-300'}`}
                    />
                  ))}
                </div>
                <button onClick={nextImage} className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-700 border border-gray-100 bg-white shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="w-full h-[62%] md:h-full md:w-[56%] p-5 md:p-7 overflow-y-auto flex flex-col gap-4">

            {/* Brand + Name */}
            <div>
              <p className="text-[11px] text-[#006837] font-black tracking-widest uppercase mb-1">HEALTHY</p>
              <h2 className="text-[22px] md:text-[28px] font-black text-gray-900 leading-tight tracking-tight font-heading">
                {product.name}
              </h2>
            </div>

            {/* Variants — per-variant qty rows */}
            <div className="space-y-2">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Select Weight & Quantity</p>

              {product.is_sold_out ? (
                <div className="py-3 text-center text-sm font-bold text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
                  This product is currently sold out
                </div>
              ) : sortedVariants.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {sortedVariants.map((v: any) => {
                    const qty = variantQtys[String(v.id)] || 0;
                    const unitPrice = parseFloat(v.price);
                    const origPrice = v.discount_price ? parseFloat(v.discount_price) : null;
                    const isActive = qty > 0;

                    return (
                      <div
                        key={v.id}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 border transition-all duration-200 ${
                          isActive
                            ? 'border-black bg-black/[0.02] shadow-sm'
                            : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                        }`}
                      >
                        {/* Weight + Price */}
                        <div className="flex flex-col min-w-0 mr-3">
                          <span className={`text-[13px] font-black ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                            {v.weight}
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[12px] font-bold text-gray-900">₹{unitPrice.toFixed(0)}</span>
                            {origPrice && (
                              <span className="text-[10px] text-gray-400 line-through">₹{origPrice.toFixed(0)}</span>
                            )}
                            {origPrice && origPrice > unitPrice && (
                              <span className="text-[10px] font-black text-[#006837] bg-[#006837]/10 px-1.5 py-0.5 rounded">
                                Save ₹{(origPrice - unitPrice).toFixed(0)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Qty controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {qty === 0 ? (
                            // "Add" button when qty is 0
                            <button
                              onClick={() => setVariantQty(String(v.id), 1)}
                              className="px-4 py-1.5 rounded-full text-[12px] font-black border border-gray-200 bg-white hover:border-black hover:bg-black hover:text-white transition-all"
                            >
                              Add
                            </button>
                          ) : (
                            // Qty stepper when qty > 0
                            <div className="flex items-center gap-1.5 bg-white border border-black rounded-full px-1 py-0.5">
                              <button
                                onClick={() => setVariantQty(String(v.id), qty - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-700"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-[13px] font-black w-5 text-center text-gray-900">{qty}</span>
                              <button
                                onClick={() => setVariantQty(String(v.id), qty + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-700"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[13px] text-gray-400 italic">No variants available</p>
              )}
            </div>

            {/* Order Summary — only when items selected */}
            <AnimatePresence>
              {hasSelection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border border-gray-100 rounded-xl p-3.5 bg-gray-50/50 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Summary</p>
                    {selectedItems.map(v => (
                      <div key={v.id} className="flex items-center justify-between text-[12px]">
                        <span className="text-gray-700 font-bold">
                          {v.weight} × {variantQtys[String(v.id)]}
                        </span>
                        <span className="font-black text-gray-900">
                          ₹{(parseFloat(v.price) * variantQtys[String(v.id)]).toFixed(0)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[13px] font-black text-gray-900">
                          Total ({totalQty} {totalQty === 1 ? 'pack' : 'packs'})
                        </span>
                        {totalSavings > 0 && (
                          <span className="ml-2 text-[10px] font-black text-[#006837] bg-[#006837]/10 px-1.5 py-0.5 rounded">
                            Save ₹{totalSavings.toFixed(0)}
                          </span>
                        )}
                      </div>
                      <span className="text-[16px] font-black text-gray-900">₹{totalPrice.toFixed(0)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            {!product.is_sold_out && (
              <div className="flex flex-col gap-2 mt-auto pt-2">
                <Button
                  onClick={handleAddToCart}
                  loading={isAdding}
                  disabled={!hasSelection || isBuyingNow}
                  className={`w-full py-3 rounded-full font-black text-[14px] h-auto border-none transition-all flex items-center justify-center gap-2 ${
                    hasSelection
                      ? 'bg-black text-white hover:bg-gray-900 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {hasSelection ? `Add to Cart` : 'Select a variant'}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  loading={isBuyingNow}
                  disabled={!hasSelection || isAdding}
                  className={`w-full border-[1.5px] py-3 rounded-full font-black text-[14px] h-auto bg-transparent transition-all ${
                    hasSelection
                      ? 'border-black text-black hover:bg-gray-50'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  Buy it now
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
