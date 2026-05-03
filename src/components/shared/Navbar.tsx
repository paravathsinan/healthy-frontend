"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Heart, Menu, Truck, ChevronDown } from "lucide-react";
import { Facebook, Instagram, Linkedin, Youtube } from "@/components/shared/Icons";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
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
      
      // Show sticky bar only when scrolling UP and scrolled past 400px
      if (currentScrollY > 400 && currentScrollY < lastScrollY) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header className="relative bg-white z-40">
        {/* Announcement Bar */}
        <div className="bg-[#006837] text-white py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-[13px] tracking-wide">
            <div className="hidden md:flex items-center gap-4">
              <Facebook className="h-4 w-4 cursor-pointer hover:text-gray-700 transition-colors" />
              <Instagram className="h-4 w-4 cursor-pointer hover:text-gray-700 transition-colors" />
              <Linkedin className="h-4 w-4 cursor-pointer hover:text-gray-700 transition-colors" />
              <Youtube className="h-4 w-4 cursor-pointer hover:text-gray-700 transition-colors" />
            </div>
            <div className="flex-1 text-center py-1">
              <span className="block text-[11px] md:text-[13px] leading-tight md:leading-normal">
                Dispatch In 24 Hours | Free Shipping On Orders Above ₹4999
              </span>
            </div>
            <div className="hidden md:block w-20" /> {/* Spacer to balance social icons */}
          </div>
        </div>

        {/* Main Header Row */}
        <div className="border-b border-gray-100 py-4 md:py-6 relative bg-white z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Header Content */}
            <div className="hidden md:flex justify-between items-center gap-12">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="relative w-20 h-20">
                  <Image
                    src="/logo/logo.png"
                    alt="Healthy Dates & Nuts Logo"
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
              </Link>

              {/* Search + Actions Group */}
              <div className="flex-1 flex items-center justify-end gap-4">
                {/* Search Bar */}
                <div className="flex-1 max-w-xl">
                  <div className="relative group w-full">
                    <input
                      type="text"
                      placeholder="Search for..."
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full bg-[#F9F9F9] border border-gray-300 rounded-full py-3.5 pl-14 pr-6 focus:ring-4 focus:ring-[#006837]/5 focus:bg-white focus:border-[#006837] hover:border-black transition-all text-base outline-none text-gray-900 placeholder:text-gray-500 shadow-sm"
                    />
                    <Search className={`absolute left-5 top-4 h-6 w-6 transition-colors duration-300 ${isSearchFocused ? "text-[#006837]" : "text-gray-400 group-hover:text-black"
                      }`} />
                  </div>
                </div>

                {/* Track Order Button */}
                <Link
                  href="/track-order"
                  className="flex items-center gap-3 px-8 py-3.5 border border-gray-300 rounded-full text-base text-gray-900 hover:border-black hover:bg-gray-50 transition-all shrink-0"
                >
                  <Truck className="h-5 w-5" />
                  <span>Track Order</span>
                </Link>

                {/* Cart Drawer */}
                <CartDrawer />
              </div>
            </div>

            {/* Mobile Header Content */}
            <div className="md:hidden flex flex-col gap-4">
              <div className="flex items-center justify-between">
                {/* Mobile Menu Icon (Left) */}
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="p-2 text-gray-700">
                      <Menu className="h-6 w-6" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 border-none bg-white flex flex-col">
                    <SheetHeader className="p-6 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
                      <SheetDescription className="sr-only">
                        Navigation menu for mobile users.
                      </SheetDescription>
                      <SheetTitle className="text-2xl font-bold text-gray-900">Menu</SheetTitle>
                      <SheetClose className="rounded-full p-2 hover:bg-gray-100 transition-colors">
                        <span className="sr-only">Close</span>
                        <div className="w-6 h-6 flex items-center justify-center">
                          <div className="absolute w-6 h-0.5 bg-gray-900 rotate-45"></div>
                          <div className="absolute w-6 h-0.5 bg-gray-900 -rotate-45"></div>
                        </div>
                      </SheetClose>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto">
                      <div className="flex flex-col py-2">
                        {STATIC_NAV_LINKS.map((link) => (
                          <div key={link.name}>
                            <div 
                              className="flex items-center justify-between px-6 py-4 border-b border-gray-50 active:bg-gray-50"
                              onClick={() => link.isDynamic && setActiveMobileCategory(activeMobileCategory === link.name ? null : link.name)}
                            >
                              {link.isDynamic ? (
                                <Link 
                                  href={link.href} 
                                  className="text-[18px] font-medium text-gray-900"
                                  onClick={(e) => {
                                    if (link.isDynamic) e.preventDefault();
                                  }}
                                >
                                  {link.name}
                                </Link>
                              ) : (
                                <SheetClose asChild>
                                  <Link 
                                    href={link.href} 
                                    className="text-[18px] font-medium text-gray-900"
                                  >
                                    {link.name}
                                  </Link>
                                </SheetClose>
                              )}
                              {link.isDynamic && (
                                <ChevronDown className={`w-5 h-5 text-gray-900 transition-transform ${activeMobileCategory === link.name ? 'rotate-180' : ''}`} />
                              )}
                            </div>
                            
                            {link.isDynamic && activeMobileCategory === link.name && (
                              <div className="bg-gray-50 py-2">
                                {categories.map((cat) => (
                                  <SheetClose asChild key={cat.id}>
                                    <Link
                                      href={`/category/${cat.slug}`}
                                      className="block px-10 py-3 text-[16px] text-gray-700 active:text-black font-medium"
                                    >
                                      {cat.name}
                                    </Link>
                                  </SheetClose>
                                ))}
                              </div>
                            )}

                          </div>
                        ))}
                        
                        <div className="p-6 space-y-4">
                          <SheetClose asChild>
                            <Link href="/track-order" className="flex items-center gap-3 text-gray-900 font-medium py-2">
                              <Truck className="h-5 w-5" />
                              <span className="text-[18px]">Track Order</span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link href="/favorites" className="flex items-center gap-3 text-gray-900 font-medium py-2">
                              <Heart className="h-5 w-5" />
                              <span className="text-[18px]">Wishlist</span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <button className="w-full mt-4 border border-gray-200 text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all">
                              Close Menu
                            </button>
                          </SheetClose>
                        </div>
                      </div>
                    </div>

                    {/* Social Media Footer in Mobile Menu */}
                    <div className="p-8 border-t border-gray-100 bg-white">
                      <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-6">Follow Us</p>
                      <div className="flex items-center gap-6">
                        <Facebook className="h-6 w-6 text-gray-900 cursor-pointer hover:text-[#006837] transition-colors" />
                        <Instagram className="h-6 w-6 text-gray-900 cursor-pointer hover:text-[#006837] transition-colors" />
                        <Linkedin className="h-6 w-6 text-gray-900 cursor-pointer hover:text-[#006837] transition-colors" />
                        <Youtube className="h-6 w-6 text-gray-900 cursor-pointer hover:text-[#006837] transition-colors" />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Mobile Logo (Center) */}
                <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                  <div className="relative w-12 h-12">
                    <Image
                      src="/logo/logo.png"
                      alt="Healthy Dates Logo"
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
                </Link>

                {/* Mobile Cart Icon (Right) */}
                <CartDrawer showOnlyIcon />
              </div>

              {/* Mobile Search Bar */}
              <div className="relative group w-full">
                <input
                  type="text"
                  placeholder="Search for..."
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full bg-[#F9F9F9] border border-gray-300 rounded-full py-2.5 pl-12 pr-6 focus:ring-4 focus:ring-[#006837]/5 focus:bg-white focus:border-[#006837] hover:border-black transition-all text-sm outline-none text-gray-900 placeholder:text-gray-500 shadow-sm"
                />
                <Search className={`absolute left-4 top-2.5 h-5 w-5 transition-colors duration-300 ${isSearchFocused ? "text-[#006837]" : "text-gray-400 group-hover:text-black"
                  }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Row */}
        <div className="hidden lg:block border-b border-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-start items-center h-14">
              <ul className="flex items-center gap-10">
                {STATIC_NAV_LINKS.map((link) => (
                  <li key={link.name} className="group relative">
                    <Link 
                      href={link.href} 
                      className="text-[15px] text-gray-800 hover:text-black transition-colors flex items-center gap-1 py-4"
                    >
                      {link.name} 
                      {link.isDynamic && <ChevronDown className={`w-3.5 h-3.5 transition-transform group-hover:rotate-180`} />}
                    </Link>
                    
                    {link.isDynamic && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-40 bg-white shadow-2xl rounded-none py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="block px-4 py-2 text-[13px] text-gray-700 hover:text-black hover:bg-gray-50 transition-all whitespace-nowrap"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}

                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Navigation Bar */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-[45] bg-white shadow-md border-b border-gray-100 hidden lg:block"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Left: Navigation Links */}
                <ul className="flex items-center gap-8">
                  {STATIC_NAV_LINKS.map((link) => (
                    <li key={link.name} className="group relative">
                      <Link 
                        href={link.href} 
                        className="text-[14px] font-medium text-gray-800 hover:text-black transition-colors flex items-center gap-1 py-4"
                      >
                        {link.name} 
                        {link.isDynamic && <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />}
                      </Link>
                      
                      {link.isDynamic && (
                        <div className="absolute top-full left-0 w-40 bg-white shadow-2xl rounded-none py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/category/${cat.slug}`}
                              className="block px-4 py-2 text-[13px] text-gray-700 hover:text-black hover:bg-gray-50 transition-all whitespace-nowrap"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      )}

                    </li>
                  ))}
                </ul>

                {/* Right: Actions Only */}
                <div className="flex items-center gap-6">
                  <Search className="h-5 w-5 text-gray-700 cursor-pointer hover:text-black transition-colors" />
                  <CartDrawer showOnlyIcon />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
