'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getHeroSlides } from '@/lib/api';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0
  })
};

export default function HeroCarousel() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await getHeroSlides();
        setSlides(data.filter((s: any) => s.is_active));
      } catch (error) {
        console.error("Failed to fetch hero slides");
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  const currentIndex = slides.length > 0 ? Math.abs(page % slides.length) : 0;

  const paginate = useCallback((newDirection: number) => {
    if (slides.length <= 1) return;
    setPage([page + newDirection, newDirection]);
  }, [page, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [paginate, slides.length]);

  if (loading) {
    return <div className="w-full h-[550px] md:h-[650px] bg-gray-50 animate-pulse rounded-2xl" />;
  }

  if (slides.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* Shrunk Carousel Section */}
      <section className="relative w-full h-[550px] md:h-[650px] overflow-hidden bg-background group shadow-xl shadow-black/5">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.8, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.4 }
            }}
            className="absolute inset-0"
          >
            <Link href={slides[currentIndex].button_link || '/products'} className="block absolute inset-0 cursor-pointer">
              <div className="absolute inset-0 bg-black/20 z-10" />
              <Image
                src={slides[currentIndex].image_url}
                alt={slides[currentIndex].title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                <div className="max-w-4xl space-y-2 md:space-y-4">
                  <h1 className="text-2xl md:text-6xl font-bold text-white leading-tight tracking-tighter font-heading italic drop-shadow-2xl">
                    {slides[currentIndex].title}
                  </h1>
                  
                  <p className="text-white/90 text-sm md:text-lg font-medium tracking-wide max-w-xl mx-auto line-clamp-2 md:line-clamp-none font-sans italic drop-shadow-lg">
                    {slides[currentIndex].subtitle}
                  </p>

                  <div className="pt-2">
                    <div className="inline-flex items-center group/btn bg-black text-white px-8 py-3 rounded-full font-black text-xs md:text-sm tracking-widest gap-2 mx-auto shadow-2xl hover:bg-gray-900 hover:scale-105 active:scale-95 transition-all duration-300">
                      <span>{slides[currentIndex].button_text || 'Explore Now'}</span>
                      <ChevronRight size={22} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Premium Navigation Row Below Banner */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => paginate(-1)}
            className="text-gray-400 hover:text-black transition-colors p-2"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex items-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setPage([index, index > currentIndex ? 1 : -1])}
                className="group relative cursor-pointer outline-none"
              >
                <div className={`rounded-full transition-all duration-500 ease-out overflow-hidden relative ${
                  currentIndex === index 
                    ? 'w-8 h-1.5 bg-gray-100' 
                    : 'w-1.5 h-1.5 bg-gray-200 group-hover:bg-gray-300'
                }`}>
                  {currentIndex === index && (
                    <motion.div
                      key={currentIndex}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="absolute inset-0 bg-black"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          <button 
            onClick={() => paginate(1)}
            className="text-gray-400 hover:text-black transition-colors p-2"
          >

            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}

