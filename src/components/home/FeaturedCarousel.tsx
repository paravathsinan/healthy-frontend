'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductGrid } from '@/components/category/ProductGrid';

interface FeaturedCarouselProps {
  products: any[];
}

export const FeaturedCarousel = ({ products }: FeaturedCarouselProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const itemsPerPage = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const nextPage = useCallback(() => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setDirection(-1);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (totalPages <= 1) return;
    
    const interval = setInterval(() => {
      nextPage();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [nextPage, totalPages]);

  const displayedProducts = products.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (products.length === 0) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="relative group/carousel">
      <div className="overflow-hidden relative min-h-[400px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="w-full"
          >
            <ProductGrid 
              columns={4}
              products={displayedProducts}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Controls - Only show if more than 1 page */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <button 
            onClick={prevPage}
            className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all active:scale-90 border border-transparent hover:border-gray-200"
            aria-label="Previous page"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          
          <div className="flex gap-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentPage ? 1 : -1);
                  setCurrentPage(i);
                }}
                className={`transition-all duration-500 rounded-full ${
                  currentPage === i 
                    ? 'w-10 h-1.5 bg-[#006837]' 
                    : 'w-1.5 h-1.5 bg-gray-200 hover:bg-gray-400'
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={nextPage}
            className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all active:scale-90 border border-transparent hover:border-gray-200"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

