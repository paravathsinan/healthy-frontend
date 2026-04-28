import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/api";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Shop by Category | Dates & Nuts",
  description: "Browse our premium selection of dates, nuts, and gourmet treats by category.",
};

export default async function CategoriesPage() {
  const categories = await getCategories().catch(() => []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight mb-4">Our Collections</h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          Explore our hand-picked selection of nature&apos;s finest treasures. From succulent dates to crunchy nuts, find your perfect treat.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category: any) => (
          <Link 
            key={category.id} 
            href={`/category/${category.slug}`}
            className="group relative h-96 rounded-[2rem] overflow-hidden bg-stone-100 shadow-sm hover:shadow-2xl transition-all duration-500"
          >
            <Image 
              src={category.image || 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=2070&auto=format&fit=crop'} 
              alt={category.name} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">{category.name}</h2>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                Explore Collection <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-24 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
           <p className="text-stone-400 font-medium">Coming Soon! Our curators are selecting the best treats.</p>
        </div>
      )}
    </main>
  );
}
