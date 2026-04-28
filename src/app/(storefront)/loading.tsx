import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="space-y-0 bg-white animate-in fade-in duration-500">
      {/* Hero Skeleton */}
      <div className="w-full h-[70vh] bg-gray-50 animate-pulse" />

      {/* Categories Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="h-10 bg-gray-100 rounded-lg w-1/4 mb-16 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-gray-50 rounded-2xl animate-pulse" />
              <div className="h-6 bg-gray-100 rounded w-1/2 mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Section Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="h-10 bg-gray-100 rounded-lg w-1/4 mb-16 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
