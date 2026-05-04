"use client";

import { useState, useEffect } from "react";
import { FeaturedCarousel } from "./FeaturedCarousel";
import { ProductGrid } from "../category/ProductGrid";
import { ChocolateBanner } from "./ChocolateBanner";
import Image from "next/image";
import Link from "next/link";

import { getOptimizedImageUrl } from "@/lib/utils";
import { ProductCardSkeleton } from "../ui/ProductCardSkeleton";

interface DeferredSectionsProps {
  newArrivals: any[];
  topPicks: any[];
  chocolateProducts: any[];
}

export function DeferredSections({ newArrivals, topPicks, chocolateProducts }: DeferredSectionsProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Delay rendering by 100ms to prioritize above-the-fold content
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 space-y-24">
        <div className="space-y-8">
           <div className="h-10 w-48 bg-gray-100 rounded-full animate-pulse" />
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <ProductCardSkeleton key={i} />)}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* What's New Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl text-gray-900 tracking-tight font-heading">What&apos;s New</h2>
        </div>
        <FeaturedCarousel products={newArrivals} />
      </section>
      
      {/* Trending Now Section */}
      <section className="bg-white py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl text-gray-900 tracking-tight mb-12 font-heading">Trending Now</h2>
          <ProductGrid columns={4} products={topPicks} />
        </div>
      </section>

      {/* Hot Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="flex items-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl text-gray-900 tracking-tight font-heading">Hot Deals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { title: 'Premium Nuts Selection', subtitle: 'Exclusive', button: 'Explore Now', bg: 'bg-[#F9F6F0]', image: '/images/hero/hero-1.png' },
          { title: 'Thoughtful Gift Boxes', subtitle: 'Handcrafted', button: 'Shop Gift Boxes', bg: 'bg-[#FDF2F2]', image: '/images/hero/hero-2.png' },
          { title: 'Premium Dates Collections', subtitle: 'Finest', button: 'Discover More', bg: 'bg-[#F0F5F9]', image: '/images/hero/hero-3.png' },
        ].map((item, i: number) => (
          <div key={i} className={`${item.bg} rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 flex flex-col items-start text-left group border border-black/5 min-h-[400px] md:min-h-[600px]`}>
            <div className="relative w-full aspect-square mb-8 md:mb-12 transition-transform duration-700 group-hover:scale-110">
              <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain drop-shadow-2xl" />
            </div>
            <div className="space-y-3 md:space-y-4 flex-1 flex flex-col justify-end w-full">
              <p className="text-xs md:text-sm font-medium text-gray-600 tracking-wide">{item.subtitle}</p>
              <h3 className="text-xl md:text-3xl font-black mb-6 md:mb-8 leading-[1.2] text-gray-900 pr-4">{item.title}</h3>
              <Link href="/products" className="w-full py-3 md:py-4 border border-gray-900 rounded-full text-xs md:text-sm font-bold text-gray-900 hover:bg-black hover:text-white transition-all text-center tracking-wider">
                {item.button}
              </Link>
            </div>
          </div>
        ))}
        </div>
      </section>

      {/* New Chocolate Delight Section */}
      <ChocolateBanner />

      {/* Chocolate Products Selection */}
      <section className="bg-[#F5F5F5] py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid columns={4} products={chocolateProducts} />
        </div>
      </section>
    </div>
  );
}
