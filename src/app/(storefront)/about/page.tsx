import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Healthy Dates & Nuts",
  description: "Learn about Healthy Dates & Nuts — premium dates, nuts, dry fruits, and wholesome snacks sourced with care from Manjeri, Kerala.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-12 md:py-20 font-sans border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-[#006837] flex items-center gap-2 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        <div className="mb-12">
          <span className="text-[12px] font-semibold text-gray-400 tracking-widest uppercase">Our Story</span>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mt-1 mb-3">About Us</h1>
          <p className="text-gray-500 text-sm">Healthy Dates &amp; Nuts — Manjeri, Kerala</p>
          <div className="h-[1px] bg-gray-100 mt-8" />
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px] md:text-[16px]">
          <p>
            <strong>Healthy Dates &amp; Nuts</strong> is a family-run store dedicated to bringing you the finest dates, nuts, dry fruits, spices, chocolates, and wholesome snacks — carefully sourced and packed for freshness.
          </p>
          <p>
            Based in Muttipalam, Manjeri, we have built our reputation on quality products, honest pricing, and fast dispatch. Every order is handled with care so you receive farm-fresh goodness at your doorstep.
          </p>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">What We Stand For</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Premium, handpicked dates and nuts</li>
              <li>Transparent product information and fair pricing</li>
              <li>Dispatch within 24 hours on most orders</li>
              <li>Free shipping on orders above ₹4,999</li>
            </ul>
          </section>
          <section className="space-y-3 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">Visit Us</h2>
            <div className="text-[14px] text-gray-600 space-y-2 pl-4 border-l-2 border-[#006837] font-medium">
              <p className="text-gray-900 font-semibold">Healthy Dates &amp; Nuts</p>
              <p>34W9+RVR, Muttipalam Upper, Muttippalam, Manjeri, Kerala 676121</p>
              <p>
                Phone:{" "}
                <a href="tel:+918157858977" className="text-gray-900 hover:text-[#006837] underline transition-colors">
                  +91 8157858977
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
