"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Facebook, Instagram, Youtube } from "./Icons";
import useSWR from "swr";
import { getPopularCategories } from "@/lib/api";

export const Footer = () => {
  const { data: popularCategories } = useSWR('api/categories/popular', getPopularCategories, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const categoriesToRender = popularCategories || [
    { name: "Dates", slug: "dates" },
    { name: "Nuts", slug: "nuts" },
    { name: "Dry Fruits", slug: "dry-fruits" },
    { name: "Spices", slug: "spices" },
    { name: "Chocolates", slug: "chocolates" },
    { name: "Seeds", slug: "seeds" },
  ];

  return (
    <footer className="bg-white text-black pt-12 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-[26px] font-semibold tracking-tight mb-4 uppercase text-gray-900">HEALTHYDATES.IN</h2>
              <div className="space-y-3 text-[16px] text-gray-800">
                <a href="mailto:shoponline@healthydates.in" className="block hover:text-[#006837] hover:underline transition-colors duration-200 font-medium">shoponline@healthydates.in</a>
                <a href="tel:+918157858977" className="block hover:text-[#006837] hover:underline transition-colors duration-200 font-medium">+91 8157858977</a>
                <a 
                  href="https://maps.app.goo.gl/vBpFSy4xLAaytbqV7?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block pt-2 hover:text-[#006837] transition-colors duration-200 group leading-relaxed font-medium"
                >
                  <p className="group-hover:underline">34W9+RVR, Muttipalam Upper,</p>
                  <p className="group-hover:underline">Muttippalam, Manjeri,</p>
                  <p className="group-hover:underline">Kerala 676121</p>
                </a>
              </div>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-900 hover:text-[#006837] transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
              <a 
                href="https://www.instagram.com/healthy_dates_and_nuts/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-900 hover:text-[#006837] transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <Link href="#" className="text-gray-900 hover:text-[#006837] transition-colors">
                <Youtube className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-[18px] font-semibold mb-6 tracking-wider uppercase text-gray-950">POPULAR CATEGORIES</h3>
            <ul className="space-y-3.5 text-[16px] text-gray-800 font-medium">
              {categoriesToRender.map((cat: any) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-[#006837] hover:underline decoration-1 underline-offset-4 transition-colors duration-200">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Know Us */}
          <div>
            <h3 className="text-[18px] font-semibold mb-6 tracking-wider uppercase text-gray-950">KNOW US</h3>
            <ul className="space-y-3.5 text-[16px] text-gray-800 font-medium">
              <li><Link href="/about" prefetch={false} className="hover:text-[#006837] hover:underline decoration-1 underline-offset-4 transition-colors duration-200">About Us</Link></li>
              <li><Link href="/recipes" prefetch={false} className="hover:text-[#006837] hover:underline decoration-1 underline-offset-4 transition-colors duration-200">Recipes</Link></li>
              <li><Link href="/contact" prefetch={false} className="hover:text-[#006837] hover:underline decoration-1 underline-offset-4 transition-colors duration-200">Contact Us</Link></li>
              <li><Link href="/blog" prefetch={false} className="hover:text-[#006837] hover:underline decoration-1 underline-offset-4 transition-colors duration-200">Blog</Link></li>
              <li><Link href="/track-order" className="hover:text-[#006837] hover:underline decoration-1 underline-offset-4 transition-colors duration-200">Track Order</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-[18px] font-semibold mb-6 tracking-wider uppercase text-gray-950">POLICIES</h3>
            <ul className="space-y-3.5 text-[16px] text-gray-800 font-medium">
              <li><Link href="/privacy" prefetch={false} className="hover:text-[#006837] hover:underline decoration-1 underline-offset-4 transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link href="/return" prefetch={false} className="hover:text-[#006837] hover:underline decoration-1 underline-offset-4 transition-colors duration-200">Return Policy</Link></li>
              <li><Link href="/refund" prefetch={false} className="hover:text-[#006837] hover:underline decoration-1 underline-offset-4 transition-colors duration-200">Refund Policy</Link></li>
              <li><Link href="/terms" prefetch={false} className="hover:text-[#006837] hover:underline decoration-1 underline-offset-4 transition-colors duration-200">Terms and Condition</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[16px] text-gray-800 font-medium">
          <p>
            Copyright © 2026 <Link href="/" className="hover:text-[#006837] hover:underline decoration-1 underline-offset-4 font-semibold transition-colors duration-200">healthydates.in</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
