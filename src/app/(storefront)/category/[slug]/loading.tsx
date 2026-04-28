import { ProductCardSkeleton } from "@/components/ui/ProductCardSkeleton";

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white animate-in fade-in duration-500">
      {/* Category Heading Skeleton */}
      <div className="mb-10 md:mb-16">
        <div className="h-10 bg-gray-100 rounded-lg w-1/4 animate-pulse" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-4 mb-12">
        <div className="h-10 bg-gray-50 rounded-full w-32 animate-pulse" />
        <div className="h-10 bg-gray-50 rounded-full w-32 animate-pulse" />
      </div>

      {/* Product Count Skeleton */}
      <div className="mb-12">
        <div className="h-4 bg-gray-50 rounded w-24 animate-pulse" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
