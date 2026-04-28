"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProductTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const tabs = [
    { name: "All Products", href: "/admin/products" },
    { name: "Chocolates", href: "/admin/products/chocolates" },
    { name: "Trending Now", href: "/admin/products/trending" },
    { name: "What's New", href: "/admin/products/new" },
  ];

  return (
    <div className="w-full border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex items-center gap-2 min-w-max pb-0.5">
        {tabs.map((tab) => {
          // Active if exact match OR if it's "All Products" and there's no category param and pathname is /admin/products
          const isActive = pathname === tab.href && (tab.href !== "/admin/products" || !category);
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`px-4 md:px-6 py-3 text-[12px] md:text-[13px] font-bold transition-all relative shrink-0 ${
                isActive 
                  ? "text-[#006837]" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.name}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006837]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
