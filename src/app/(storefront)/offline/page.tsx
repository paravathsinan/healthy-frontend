import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Navigation } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop Offline | Healthy Dates & Nuts",
  description: "Visit our physical store in Manjeri, Kerala. Shop premium dates, nuts, and dry fruits in person at Healthy Dates & Nuts.",
};

export default function OfflineShopPage() {
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
          <span className="text-[12px] font-semibold text-gray-400 tracking-widest uppercase">Visit Us</span>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mt-1 mb-3">Shop Offline</h1>
          <p className="text-gray-500 text-sm">Walk into our store and explore our full range in person.</p>
          <div className="h-[1px] bg-gray-100 mt-8" />
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed text-[15px] md:text-[16px]">
          <p>
            Prefer to shop in person? Visit <strong>Healthy Dates &amp; Nuts</strong> at our Manjeri location. Browse dates, nuts, dry fruits, spices, chocolates, and gift packs — and get personalised recommendations from our team.
          </p>

          <section className="space-y-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#006837] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Store Location</p>
                <p className="text-gray-600 mt-1">
                  34W9+RVR, Muttipalam Upper, Muttippalam, Manjeri, Kerala 676121
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-[#006837] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Store Hours</p>
                <p className="text-gray-600 mt-1">Open daily — call ahead to confirm timings: +91 8157858977</p>
              </div>
            </div>
          </section>

          <a
            href="https://maps.app.goo.gl/vBpFSy4xLAaytbqV7?g_st=aw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#006837] text-white font-semibold hover:bg-black transition-colors"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </a>

          <p className="text-gray-500 text-sm pt-4">
            Can&apos;t visit?{" "}
            <Link href="/products" className="text-[#006837] font-medium hover:underline">
              Shop online
            </Link>{" "}
            with dispatch in 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
