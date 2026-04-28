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

const allMockProducts = [
  { id: 1, name: 'Medjoul King Dates', price: '593.00', image: '/images/products/medjool-dates.png', discount: 'UPTO 6% OFF' },
  { id: 2, name: 'Ajwa Dates Premium', price: '493.00', image: '/images/products/ajwa-dates-premium.png', discount: 'UPTO 15% OFF', is_sold_out: true },
  { id: 101, name: 'Premium California Almonds', price: '850.00', image: '/images/products/almonds.png', discount: 'UPTO 12% OFF' },
  { id: 102, name: 'Roasted Cashew Nuts', price: '920.00', image: '/images/products/cashews.png', is_sold_out: true },
  { id: 201, name: 'Dried Apricots', price: '450.00', image: '/images/products/apricots.png' },
  { id: 4, name: 'Mabroom Dates Premium', price: '645.00', image: '/images/products/mabroom-dates.png', discount: 'UPTO 10% OFF' },
];

export default async function AllProductsPage() {
  let products = await getProducts().catch(() => []);

  // Use mock data if API returns nothing
  if (products.length === 0) {
    products = allMockProducts.map(d => ({
      ...d,
      slug: d.name.toLowerCase().replace(/ /g, '-'),
      cheapest_variant_price: d.price,
      primary_image: d.image,
      on_sale: !!d.discount
    }));
  }

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
        <span className="text-[14px] text-gray-400 font-medium">{products.length} products</span>
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} />

      {products.length === 0 && (
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
