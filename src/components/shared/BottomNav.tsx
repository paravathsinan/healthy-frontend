"use client";

import Link from "next/link";
import { Home, Grid, Heart, User, PackageSearch } from "lucide-react";
import { usePathname } from "next/navigation";

export const BottomNav = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Shop", icon: PackageSearch },
    { href: "/category/exclusive", label: "Excl", icon: Heart },
    { href: "/account", label: "Me", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-100 md:hidden pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? "text-[#006837]" : "text-gray-400"
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-[#006837]/5" : ""}`}>
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-60"}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
