import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Healthy Dates & Nuts",
  description: "Get in touch with Healthy Dates & Nuts. Call, WhatsApp, or email us for orders, product queries, and support.",
};

export default function ContactPage() {
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
          <span className="text-[12px] font-semibold text-gray-400 tracking-widest uppercase">Support</span>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mt-1 mb-3">Contact Us</h1>
          <p className="text-gray-500 text-sm">We&apos;re happy to help with orders, products, and delivery questions.</p>
          <div className="h-[1px] bg-gray-100 mt-8" />
        </div>

        <div className="space-y-6">
          <a
            href="tel:+918157858977"
            className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-[#006837]/30 hover:bg-gray-50/50 transition-colors"
          >
            <Phone className="h-5 w-5 text-[#006837] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Phone</p>
              <p className="text-gray-600 text-[15px]">+91 8157858977</p>
            </div>
          </a>

          <a
            href="https://wa.me/918157858977"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-[#006837]/30 hover:bg-gray-50/50 transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-[#006837] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">WhatsApp</p>
              <p className="text-gray-600 text-[15px]">Chat with us for quick support</p>
            </div>
          </a>

          <a
            href="mailto:shoponline@healthydates.in"
            className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-[#006837]/30 hover:bg-gray-50/50 transition-colors"
          >
            <Mail className="h-5 w-5 text-[#006837] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Email</p>
              <p className="text-gray-600 text-[15px]">shoponline@healthydates.in</p>
            </div>
          </a>

          <a
            href="https://maps.app.goo.gl/vBpFSy4xLAaytbqV7?g_st=aw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-[#006837]/30 hover:bg-gray-50/50 transition-colors"
          >
            <MapPin className="h-5 w-5 text-[#006837] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">Store Address</p>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                34W9+RVR, Muttipalam Upper, Muttippalam, Manjeri, Kerala 676121
              </p>
            </div>
          </a>
        </div>

        <p className="mt-10 text-gray-500 text-sm">
          Need order status?{" "}
          <Link href="/track-order" className="text-[#006837] font-medium hover:underline">
            Track your order here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
