import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories } from "@/lib/api";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const categories = await getCategories().catch(() => []);
  const category = categories.find((c: any) => c.slug === params.slug);
  
  return {
    title: category ? `${category.name} | Premium Collection` : "Category Collection",
    description: `Shop our premium ${category?.name || 'treats'} collection. Hand-picked and delivered fresh.`,
  };
}

import { CategoryFilters } from "@/components/category/CategoryFilters";

import { ProductGrid } from "@/components/category/ProductGrid";

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;
  const products = await getProducts({ category__slug: slug }).catch(() => []);
  const categories = await getCategories().catch(() => []);
  const category = categories.find((c: any) => c.slug === slug);

  const categoryName = category?.name || (slug ? (slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ')) : 'Collection');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      {/* Category Heading */}
      <div className="mb-10 md:mb-16">
        <h1 className="text-2xl md:text-4xl text-gray-900 tracking-tight">
          {categoryName}
        </h1>
      </div>

      <CategoryFilters />

      {/* Product Count */}
      <div className="mb-12">
        <span className="text-[14px] text-gray-400 font-medium">{products.length} products</span>
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} />

      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 border-t border-gray-100 mt-12">
           <ShoppingBag className="h-16 w-16 text-gray-200 mb-6" />
           <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
           <p className="text-gray-500 font-medium mb-8">We are currently restocking this collection.</p>
           <Link href="/" className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all">
             Explore Other Collections
           </Link>
        </div>
      )}
    </main>
  );
}
