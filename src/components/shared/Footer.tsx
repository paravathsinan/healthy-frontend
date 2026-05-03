import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Facebook, Instagram, Linkedin, Youtube } from "./Icons";

export const Footer = () => {
  return (
    <footer className="bg-white text-black pt-12 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-[20px] font-bold tracking-tight mb-4 uppercase">HEALTHYDATES.IN</h2>
              <div className="space-y-3 text-[14px] text-gray-800">
                <a href="mailto:shoponline@healthydates.in" className="block hover:underline transition-all">shoponline@healthydates.in</a>
                <a href="tel:+918157858977" className="block hover:underline transition-all">+91 8157858977</a>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=34W9%2BRVR%2C%2BMuttipalam%2BUpper%2C%2BMuttippalam%2BManjeri%2BKerala%2B676121" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block pt-2 hover:underline transition-all group"
                >
                  <p>34W9+RVR, Muttipalam Upper,</p>
                  <p>Muttippalam, Manjeri,</p>
                  <p>Kerala 676121</p>
                </a>
              </div>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-900 hover:text-[#006837] transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-900 hover:text-[#006837] transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-900 hover:text-[#006837] transition-colors">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-900 hover:text-[#006837] transition-colors">
                <Youtube className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-[14px] font-bold mb-6 tracking-wider uppercase">POPULAR CATEGORIES</h3>
            <ul className="space-y-3 text-[14px] text-gray-800">
              <li><Link href="/category/dates" className="hover:underline decoration-1 underline-offset-4">Dates</Link></li>
              <li><Link href="/category/nuts" className="hover:underline decoration-1 underline-offset-4">Nuts</Link></li>
              <li><Link href="/category/dry-fruits" className="hover:underline decoration-1 underline-offset-4">Dry Fruits</Link></li>
              <li><Link href="/category/spices" className="hover:underline decoration-1 underline-offset-4">Spices</Link></li>
              <li><Link href="/category/chocolates" className="hover:underline decoration-1 underline-offset-4">Chocolates</Link></li>
              <li><Link href="/category/seeds" className="hover:underline decoration-1 underline-offset-4">Seeds</Link></li>
            </ul>
          </div>

          {/* Know Us */}
          <div>
            <h3 className="text-[14px] font-bold mb-6 tracking-wider uppercase">KNOW US</h3>
            <ul className="space-y-3 text-[14px] text-gray-800">
              <li><Link href="/about" className="hover:underline decoration-1 underline-offset-4">About Us</Link></li>
              <li><Link href="/events" className="hover:underline decoration-1 underline-offset-4">Events</Link></li>
              <li><Link href="/recipes" className="hover:underline decoration-1 underline-offset-4">Recipes</Link></li>
              <li><Link href="/contact" className="hover:underline decoration-1 underline-offset-4">Contact Us</Link></li>
              <li><Link href="/blog" className="hover:underline decoration-1 underline-offset-4">Blog</Link></li>
              <li><Link href="/track-order" className="hover:underline decoration-1 underline-offset-4">Track Order</Link></li>
              <li><Link href="/corporate" className="hover:underline decoration-1 underline-offset-4">Corporate orders</Link></li>
              <li><Link href="/wholesale" className="hover:underline decoration-1 underline-offset-4">Wholesale Enquiry</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-[14px] font-bold mb-6 tracking-wider uppercase">POLICIES</h3>
            <ul className="space-y-3 text-[14px] text-gray-800">
              <li><Link href="/privacy" className="hover:underline decoration-1 underline-offset-4">Privacy Policy</Link></li>
              <li><Link href="/return" className="hover:underline decoration-1 underline-offset-4">Return Policy</Link></li>
              <li><Link href="/refund" className="hover:underline decoration-1 underline-offset-4">Refund Policy</Link></li>
              <li><Link href="/shipping" className="hover:underline decoration-1 underline-offset-4">Shipping Policy</Link></li>
              <li><Link href="/terms" className="hover:underline decoration-1 underline-offset-4">Terms and Condition</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[14px] text-gray-800">
          <p>
            Copyright © 2026 <Link href="/" className="hover:underline decoration-1 underline-offset-4">healthydates.in</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};
