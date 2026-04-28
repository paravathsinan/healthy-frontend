"use client";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden animate-pulse flex flex-col h-full shadow-sm">
      {/* Image Area */}
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-8">
        <div className="w-2/3 h-2/3 bg-gray-100 rounded-2xl" />
        
        {/* Floating elements placeholders */}
        <div className="absolute top-4 left-4 w-12 h-5 bg-gray-100 rounded-full" />
        <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full" />
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-4 flex flex-col flex-1">
        <div className="space-y-2">
          <div className="h-3 bg-gray-50 rounded w-1/4" />
          <div className="h-6 bg-gray-100 rounded w-3/4" />
        </div>
        
        <div className="h-4 bg-gray-50 rounded w-full" />
        
        <div className="pt-4 mt-auto flex items-center justify-between">
          <div className="h-8 bg-gray-100 rounded-lg w-1/3" />
          <div className="h-10 bg-[#006837]/5 rounded-full w-10" />
        </div>
      </div>
    </div>
  );
}
