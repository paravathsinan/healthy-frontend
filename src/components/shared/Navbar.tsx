"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Heart, Menu, Truck, ChevronDown, X } from "lucide-react";
import { Facebook, Instagram, Linkedin, Youtube } from "@/components/shared/Icons";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawer, GlobalMobileCart } from "@/components/cart/CartDrawer";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetDescription 
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories } from "@/lib/api";


const STATIC_NAV_LINKS = [
  { name: "Home", href: "/" },
  { 
    name: "Products", 
    href: "/products",
    isDynamic: true
  },
  { name: "About Us", href: "/about" },
  { name: "Gifting", href: "#" },
  { name: "Contact", href: "/contact" },
  { name: "Shop Offline", href: "/offline" },
];


export const Navbar = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isCartOpen = useCartStore((state) => state.isCartOpen);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories in navbar:", error);
      }
    };
    fetchCategories();
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Sticky reveal logic: Show only when scrolling UP and past the initial header (200px)
      if (currentScrollY > 200 && currentScrollY < lastScrollY) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Shared Mobile Menu Content to avoid duplication
  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 -ml-2 text-gray-700">
          <Menu className="h-8 w-8" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 border-none bg-white flex flex-col">
        <SheetHeader className="p-6 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-2xl font-bold text-gray-900">Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Navigation menu to browse product categories and pages.
          </SheetDescription>
          <SheetClose className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6 text-gray-900" />
          </SheetClose>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col py-2">
            {STATIC_NAV_LINKS.map((link) => (
              <div key={link.name}>
                <div 
                  className="flex items-center justify-between px-6 py-4 border-b border-gray-50"
                  onClick={() => link.isDynamic && setActiveMobileCategory(activeMobileCategory === link.name ? null : link.name)}
                >
                  {link.isDynamic ? (
                    <span className="text-[18px] font-medium text-gray-900">{link.name}</span>
                  ) : (
                    <SheetClose asChild>
                      <Link href={link.href} className="text-[18px] font-medium text-gray-900">{link.name}</Link>
                    </SheetClose>
                  )}
                  {link.isDynamic && <ChevronDown className={`w-5 h-5 transition-transform ${activeMobileCategory === link.name ? 'rotate-180' : ''}`} />}
                </div>
                {link.isDynamic && activeMobileCategory === link.name && (
                  <div className="bg-gray-50 py-2">
                    {categories.map((cat) => (
                      <SheetClose asChild key={cat.id}>
                        <Link href={`/category/${cat.slug}`} className="block px-10 py-3 text-[16px] text-gray-700 font-medium">{cat.name}</Link>
                      </SheetClose>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="p-6">
              <SheetClose asChild>
                <Link href="/track-order" className="flex items-center gap-3 text-gray-900 font-medium py-2">
                  <Truck className="h-5 w-5" />
                  <span className="text-[18px]">Track Order</span>
                </Link>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <header className="relative bg-white z-[100]">
        {/* 1. Announcement Bar */}
        <div className="bg-[#006837] text-white py-2.5 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-[13px] tracking-wide">
            {/* Social Links - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="#" className="hover:opacity-70 transition-opacity">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="hover:opacity-70 transition-opacity">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="hover:opacity-70 transition-opacity">
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="#" className="hover:opacity-70 transition-opacity">
                <Youtube className="w-4 h-4" />
              </Link>
            </div>

            <span className="flex-1 text-[11px] md:text-[13px] text-center">
              Dispatch In 24 Hours | Free Shipping On Orders Above ₹4999
            </span>

            {/* Empty div for symmetry on desktop */}
            <div className="hidden md:block w-[112px]" />
          </div>
        </div>

        {/* 2. Main Mobile Header (Always at the top) */}
        <div className="md:hidden px-6 pt-4 pb-2 flex items-center justify-between border-b border-gray-100 bg-white">
          <MobileMenu />
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <div className="relative w-12 h-12">
              <Image src="/logo/logo.png" alt="Logo" fill sizes="48px" className="object-contain" priority />
            </div>
          </Link>
          <CartDrawer showOnlyIcon hideBadge={true} />
        </div>

        {/* 3. Main Desktop Header */}
        <div className="hidden md:block border-b border-gray-100 py-6 bg-white">
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center gap-12">
            <Link href="/" className="shrink-0">
              <div className="relative w-20 h-20">
                <Image src="/logo/logo.png" alt="Logo" fill sizes="80px" className="object-contain" priority />
              </div>
            </Link>
            <div className="flex-1 flex items-center justify-end gap-4">
              <div className="flex-1 max-w-xl relative group">
                <input type="text" placeholder="Search for..." className="w-full bg-[#F9F9F9] border border-gray-300 rounded-full py-3.5 pl-14 pr-6 text-gray-900 placeholder:text-gray-500 outline-none focus:ring-4 focus:ring-[#006837]/5 focus:border-[#006837] shadow-sm" />
                <Search className="absolute left-5 top-4 h-6 w-6 text-gray-400 group-focus-within:text-[#006837]" />
              </div>
              <Link href="/track-order" className="flex items-center gap-3 px-8 py-3.5 border border-gray-300 rounded-full text-gray-900 hover:bg-gray-50 transition-all">
                <Truck className="h-5 w-5" />
                <span>Track Order</span>
              </Link>
              <CartDrawer hideBadge={true} />
            </div>
          </div>
        </div>

        {/* 4. Mobile Search Row (Relative) */}
        <div className="md:hidden px-6 py-3 border-b border-gray-50">
          <div className="relative group w-full">
            <input type="text" placeholder="Search for..." className="w-full bg-[#F9F9F9] border border-gray-300 rounded-full py-2.5 pl-12 pr-6 text-sm text-gray-900 placeholder:text-gray-500 outline-none" />
            <Search className="absolute left-4 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* 5. Desktop Navigation Row */}
        <div className="hidden lg:block border-b border-gray-50 h-14 bg-white">
          <div className="max-w-7xl mx-auto px-8 h-full flex items-center">
            <ul className="flex items-center gap-10">
              {STATIC_NAV_LINKS.map((link) => (
                <li key={link.name} className="group relative">
                  <Link href={link.href} className="text-[15px] text-gray-800 hover:text-black flex items-center gap-1 py-4">
                    {link.name} 
                    {link.isDynamic && <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />}
                  </Link>
                  {link.isDynamic && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-40 bg-white shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-100">
                      {categories.map((cat) => (
                        <Link key={cat.id} href={`/category/${cat.slug}`} className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">{cat.name}</Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <GlobalMobileCart />
      </header>

      {/* 6. SMART STICKY REVEAL BAR (Desktop & Mobile) */}
      <AnimatePresence>
        {isSticky && (
          <motion.div 
            initial={{ y: -100 }} 
            animate={{ y: 0 }} 
            exit={{ y: -100 }} 
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
          >
            {/* Desktop Sticky View */}
            <div className="hidden lg:flex max-w-7xl mx-auto px-8 h-16 justify-between items-center">
              <ul className="flex items-center gap-8">
                {STATIC_NAV_LINKS.map((link) => (
                  <li key={link.name}><Link href={link.href} className="text-[14px] font-medium text-gray-800">{link.name}</Link></li>
                ))}
              </ul>
              <div className="flex items-center gap-6">
                <Search className="h-5 w-5 text-gray-700" />
                <CartDrawer showOnlyIcon />
              </div>
            </div>

            {/* Mobile Sticky View - EXACTLY AS REQUESTED */}
            <div className="lg:hidden px-6 pt-4 pb-2 flex items-center justify-between relative">
              <MobileMenu />
              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <div className="relative w-10 h-10">
                  <Image src="/logo/logo.png" alt="Logo" fill sizes="40px" className="object-contain" />
                </div>
              </Link>
              <CartDrawer showOnlyIcon />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
