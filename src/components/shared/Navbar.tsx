"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Heart, Menu, Truck, ChevronDown, X, ChevronRight, User } from "lucide-react";
import { Facebook, Instagram, Youtube } from "@/components/shared/Icons";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawer, GlobalMobileCart } from "@/components/cart/CartDrawer";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetDescription 
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories } from "@/lib/api";
import { SearchBox } from "./SearchBox";


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

const MobileMenu = ({ 
  isOpen, 
  setIsOpen, 
  categories, 
  loading,
  activeCategory, 
  setActiveCategory 
}: { 
  isOpen: boolean; 
  setIsOpen: (open: boolean) => void;
  categories: any[];
  loading: boolean;
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
}) => (
  <Sheet open={isOpen} onOpenChange={setIsOpen}>
    <button 
      onClick={() => setIsOpen(true)}
      className="p-2 -ml-2 text-gray-700 hover:opacity-70 transition-opacity"
    >
      <Menu className="h-8 w-8" />
    </button>
    <SheetContent side="left" className="w-[85%] sm:w-[400px] p-0 border-none bg-white flex flex-col h-full z-[150]">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
        <SheetTitle className="text-xl font-bold text-gray-900 font-heading">Menu</SheetTitle>
        <button 
          onClick={() => setIsOpen(false)}
          className="rounded-full p-2 hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm"
        >
          <X className="w-6 h-6 text-gray-900" />
          <span className="sr-only">Close menu</span>
        </button>
      </div>
      <SheetDescription className="sr-only">
        Navigation menu to browse product categories and pages.
      </SheetDescription>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {STATIC_NAV_LINKS.filter(link => link.name !== "Gifting").map((link) => (
            <div key={link.name} className="relative">
              <div className="flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {/* Main Link/Text */}
                <Link 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-[15px] font-bold text-gray-900 flex-1 px-6 py-4"
                >
                  {link.name}
                </Link>

                {/* Dropdown Toggle */}
                {link.isDynamic && (
                  <div 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveCategory(activeCategory === link.name ? null : link.name);
                    }}
                    className="px-6 py-4 text-gray-400 hover:text-black transition-all cursor-pointer border-l border-gray-50/50"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeCategory === link.name ? 'rotate-90' : ''}`} />
                  </div>
                )}
              </div>

              {/* Sub-menu (Categories) */}
              {link.isDynamic && activeCategory === link.name && (
                <div className="bg-gray-50/50 border-b border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                  {loading ? (
                    <div className="px-12 py-4 text-[13px] text-gray-400 font-medium italic">Loading categories...</div>
                  ) : categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link 
                        key={cat.id}
                        href={`/category/${cat.slug}`} 
                        onClick={() => setIsOpen(false)}
                        className="block px-12 py-3.5 text-[14px] text-gray-600 font-bold hover:text-[#006837] border-b border-gray-100/30 last:border-none transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <div className="px-12 py-4 text-[13px] text-gray-400 font-medium italic">No categories available</div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Track Order Link */}
          <div className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors relative">
            <Link 
              href="/track-order" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-gray-900 flex-1 py-1"
            >
              <span className="text-[15px] font-bold">Track Order</span>
              <Truck className="h-5 w-5 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Social Footer */}
      <div className="p-6 border-t border-gray-100 bg-white mt-auto">
        <div className="flex items-center gap-6">
          <Link href="#" className="text-gray-900 hover:text-[#006837] transition-colors">
            <Facebook className="h-5 w-5" />
          </Link>
          <a 
            href="https://www.instagram.com/healthy_dates_and_nuts/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-900 hover:text-[#006837] transition-colors"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <Link href="#" className="text-gray-900 hover:text-[#006837] transition-colors">
            <Youtube className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </SheetContent>
  </Sheet>
);


import { useCategories } from "@/context/CategoryContext";

export const Navbar = () => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isCartOpen = useCartStore((state) => state.isCartOpen);


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

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <>
      <header className="relative bg-white z-30">
        {/* 1. Announcement Bar */}
        <div className="bg-[#006837] text-white py-2.5 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-[13px] tracking-wide">
            {/* Social Links - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="#" className="hover:opacity-70 transition-opacity">
                <Facebook className="w-4 h-4" />
              </Link>
              <a 
                href="https://www.instagram.com/healthy_dates_and_nuts/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-70 transition-opacity"
              >
                <Instagram className="w-4 h-4" />
              </a>
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
          <MobileMenu 
            isOpen={isMobileMenuOpen} 
            setIsOpen={setIsMobileMenuOpen}
            categories={categories}
            loading={categoriesLoading}
            activeCategory={activeMobileCategory}
            setActiveCategory={setActiveMobileCategory}
          />
          <div onClick={handleLogoClick} className="absolute left-1/2 -translate-x-1/2 cursor-pointer">
            <div className="relative w-12 h-12">
              <Image src="/logo/logo.png" alt="Logo" fill sizes="48px" className="object-contain" />
            </div>
          </div>
          <CartDrawer showOnlyIcon />
        </div>

        {/* 3. Main Desktop Header */}
        <div className="hidden md:block border-b border-gray-100 py-6 bg-white">
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center gap-12">
            <div onClick={handleLogoClick} className="shrink-0 cursor-pointer">
              <div className="relative w-20 h-20">
                <Image src="/logo/logo.png" alt="Logo" fill sizes="80px" className="object-contain" />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-end gap-4">
              <SearchBox />
              <Link href="/track-order" className="flex items-center gap-3 px-8 py-3.5 border border-gray-300 rounded-full text-gray-900 hover:bg-gray-50 transition-all">
                <Truck className="h-5 w-5" />
                <span>Track Order</span>
              </Link>
              <CartDrawer />
            </div>
          </div>
        </div>

        {/* 4. Mobile Search Row (Relative) */}
        <div className="md:hidden px-6 py-3 border-b border-gray-50 flex items-center gap-2">
          <SearchBox isMobile />
          <Link href="/track-order" className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-300 rounded-full text-gray-900 bg-white shadow-sm shrink-0">
            <Truck className="h-4 w-4 text-[#006837]" />
            <span className="text-[12px] font-bold">Track Order</span>
          </Link>
        </div>

        {/* 5. Desktop Navigation Row */}
        <div className="hidden lg:block border-b border-gray-50 h-14 bg-white">
          <div className="max-w-7xl mx-auto px-8 h-full flex items-center">
            <ul className="flex items-center gap-10">
              {STATIC_NAV_LINKS.map((link) => (
                <li key={link.name} className="group relative">
                  <Link href={link.href} className="text-[15px] text-gray-800 hover:text-black flex items-center gap-1 py-4">
                    {link.name} 
                    {link.isDynamic && categories.length > 0 && <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />}
                  </Link>
                  {link.isDynamic && categories.length > 0 && (
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
              <MobileMenu 
                isOpen={isMobileMenuOpen} 
                setIsOpen={setIsMobileMenuOpen}
                categories={categories}
                loading={categoriesLoading}
                activeCategory={activeMobileCategory}
                setActiveCategory={setActiveMobileCategory}
              />
              <div onClick={handleLogoClick} className="absolute left-1/2 -translate-x-1/2 cursor-pointer">
                <div className="relative w-10 h-10">
                  <Image src="/logo/logo.png" alt="Logo" fill sizes="40px" className="object-contain" />
                </div>
              </div>
              <CartDrawer showOnlyIcon />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
