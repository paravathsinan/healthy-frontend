import Link from "next/link";
import Image from "next/image";
import { getHomepageData } from "@/lib/api";
import { ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";

import HeroCarousel from "@/components/home/HeroCarousel";
import { ProductGrid } from "@/components/category/ProductGrid";
import { ChocolateBanner } from "@/components/home/ChocolateBanner";
import nextDynamic from 'next/dynamic';

const DeferredSections = nextDynamic(() => import("@/components/home/DeferredSections").then(mod => mod.DeferredSections), {
  loading: () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="h-96 w-full bg-gray-50 animate-pulse rounded-3xl" />
    </div>
  )
});

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  console.time("⏱️ Homepage Combined Fetch");
  const data = await getHomepageData().catch(() => ({
    hero: [],
    categories: [],
    featured: [],
    new_arrivals: [],
    chocolates: []
  }));
  console.timeEnd("⏱️ Homepage Combined Fetch");

  const { hero, categories, featured: featuredProducts, new_arrivals: newArrivals, chocolates: chocolateProducts } = data;
  
  // Helper to sanitize product objects
  const sanitizeProduct = (p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    cheapest_variant_price: p.cheapest_variant_price,
    primary_image: p.primary_image,
    is_sold_out: p.is_sold_out,
    badge_text: p.badge_text,
    tags: p.tags,
    on_sale: p.on_sale,
    variants: p.variants?.map((v: any) => ({
      id: v.id,
      weight: v.weight,
      price: v.price,
      discount_price: v.discount_price
    })) || [],
    images: p.images?.map((img: any) => ({
      image_url: img.image_url,
      is_primary: img.is_primary
    })) || []
  });

  // HARD LIMIT: 4 max for storefront sections + Sanitize
  const topPicks = featuredProducts.slice(0, 4).map(sanitizeProduct);
  const limitedNewArrivals = newArrivals.slice(0, 4).map(sanitizeProduct);
  const limitedChocolateProducts = chocolateProducts.slice(0, 4).map(sanitizeProduct);

  return (
    <div className="space-y-0 bg-white">
      {/* Hero Section */}
      <HeroCarousel initialSlides={hero} />

      {/* Shop by Category - ABOVE THE FOLD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 bg-white">
        <div className="flex items-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl text-gray-900 tracking-tight font-heading">Shop By Category</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 md:gap-y-16 gap-x-4 md:gap-x-8">
          {categories.map((category: any, i: number) => (
            <Link 
              key={i} 
              href={`/category/${category.slug || category.name.toLowerCase().replace(' ', '-')}`}
              className="group flex flex-col items-center text-center space-y-4 md:space-y-6"
            >
              <div className="relative w-full aspect-square flex items-center justify-center">
                <Image 
                  src={(category.image_url && (category.image_url.startsWith('http') || category.image_url.startsWith('/') || category.image_url.startsWith('data:'))) ? category.image_url : '/images/placeholder.png'} 
                  alt={category.name} 
                  fill 
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy"
                />
              </div>
              <p className="font-extrabold text-[20px] md:text-2xl text-gray-900 group-hover:text-black transition-colors leading-tight px-2">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* DEFERRED SECTIONS - BELOW THE FOLD */}
      <DeferredSections 
        newArrivals={limitedNewArrivals}
        topPicks={topPicks}
        chocolateProducts={limitedChocolateProducts}
      />
    </div>
  );
}

