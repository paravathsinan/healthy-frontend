import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts } from "@/lib/api";
import { ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";

import HeroCarousel from "@/components/home/HeroCarousel";
import { ProductGrid } from "@/components/category/ProductGrid";
import { ChocolateBanner } from "@/components/home/ChocolateBanner";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const categoriesApi = await getCategories().catch(() => []);
  const featuredProducts = await getProducts({ is_featured: true }).catch(() => []);
  const newArrivals = await getProducts({ is_new_arrival: true }).catch(() => []);
  const chocolateProducts = await getProducts({ category__slug: 'chocolates' }).catch(() => []);

  const categories = categoriesApi;


  const topPicks = featuredProducts.slice(0, 4);


  return (
    <div className="space-y-0 bg-white">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Shop by Category */}
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
                />

              </div>
              <p className="font-extrabold text-[20px] md:text-2xl text-gray-900 group-hover:text-black transition-colors leading-tight px-2">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* What's New Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl text-gray-900 tracking-tight font-heading">What&apos;s New</h2>
        </div>
        
        <FeaturedCarousel 
          products={newArrivals}
        />

      </section>
      
      {/* Trending Now Section */}
      <section className="bg-white py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-4xl text-gray-900 tracking-tight mb-12 font-heading">Trending Now</h2>
          <ProductGrid 
            columns={4}
            products={topPicks}
          />
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
          <ProductGrid 
            columns={4}
            products={chocolateProducts}
          />
        </div>
      </section>
    </div>
  );
}

