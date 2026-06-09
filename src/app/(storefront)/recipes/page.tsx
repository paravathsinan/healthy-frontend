import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Recipes | Healthy Dates & Nuts",
  description: "Healthy recipes using dates, nuts, and dry fruits from Healthy Dates & Nuts.",
};

export default function RecipesPage() {
  return (
    <div className="bg-white min-h-screen py-12 md:py-20 font-sans border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="mb-10 text-left">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-[#006837] flex items-center gap-2 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mb-4">Recipes</h1>
        <p className="text-gray-600 text-[16px] mb-8">
          Wholesome recipe ideas with our dates, nuts, and dry fruits are coming soon.
        </p>
        <Link
          href="/products"
          className="inline-flex px-6 py-3 rounded-full bg-[#006837] text-white font-semibold hover:bg-black transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
