import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories } from "@/lib/api";
import { ShoppingBag } from "lucide-react";
import { CategoryFilters } from "@/components/category/CategoryFilters";
import { ProductGrid } from "@/components/category/ProductGrid";

export const metadata = {
  title: "All Products | Healthy Dates & Nuts",
  description: "Browse our entire collection of premium dates, nuts, and gourmet treats.",
};

export default async function AllProductsPage() {
  let products = await getProducts().catch(() => []);

  // Sanitize products data to reduce page size
  const sanitizedProducts = products.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    cheapest_variant_price: p.cheapest_variant_price,
    primary_image: p.primary_image,
    is_sold_out: p.is_sold_out,
    badge_text: p.badge_text,
    tags: p.tags,
    on_sale: p.on_sale,
    // Only include necessary variants data
    variants: p.variants?.map((v: any) => ({
      id: v.id,
      weight: v.weight,
      price: v.price,
      discount_price: v.discount_price
    })) || [],
    // Only include necessary images data
    images: p.images?.map((img: any) => ({
      image_url: img.image_url,
      is_primary: img.is_primary
    })) || []
  }));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      {/* Category Heading */}
      <div className="mb-10 md:mb-16">
        <h1 className="text-2xl md:text-4xl text-gray-900 tracking-tight">
          All Products
        </h1>
      </div>

      <CategoryFilters />

      {/* Product Count */}
      <div className="mb-12">
        <span className="text-[14px] text-gray-400 font-medium">{sanitizedProducts.length} products</span>
      </div>

      {/* Product Grid */}
      <ProductGrid products={sanitizedProducts} />

      {sanitizedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 border-t border-gray-100 mt-12">
           <ShoppingBag className="h-16 w-16 text-gray-200 mb-6" />
           <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
           <p className="text-gray-500 font-medium mb-8">We are currently restocking our collection.</p>
           <Link href="/" className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all">
             Back to Home
           </Link>
        </div>
      )}
    </main>
  );
}
