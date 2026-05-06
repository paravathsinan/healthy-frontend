import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Return Policy | Healthy Dates & Nuts",
  description: "Review our clear and formal Return Policy. Learn about return eligible conditions, non-returnable categories, and proof submission requirements.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-12 md:py-20 font-sans border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back link */}
        <div className="mb-10">
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-[#006837] flex items-center gap-2 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        {/* Minimal Formal Header */}
        <div className="mb-12">
          <span className="text-[12px] font-semibold text-gray-400 tracking-widest uppercase">Customer Service</span>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mt-1 mb-3">Return Policy</h1>
          <p className="text-gray-500 text-sm">Last Updated: May 2026</p>
          <div className="h-[1px] bg-gray-100 mt-8" />
        </div>

        {/* Formal Content Body */}
        <div className="space-y-10 text-gray-700 leading-relaxed text-[15px] md:text-[16px]">
          
          <p>
            At <strong>Healthy Dates & Nuts</strong>, customer satisfaction is important to us. We strive to provide high-quality products, fresh agricultural stock, and robust packaging to ensure safe delivery.
          </p>
          
          <p className="font-semibold text-gray-900">
            Please read our return policies carefully before placing your order.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">1. Eligible Return Conditions</h2>
            <p>
              We accept return requests under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>Wrong product or variant was delivered.</li>
              <li>Product was physically damaged during transit.</li>
              <li>Inner product packaging was severely compromised upon receipt.</li>
              <li>A product quality discrepancy is verified.</li>
              <li>An incorrect or expired item was dispatched in error.</li>
            </ul>
            <p className="text-gray-900 font-semibold pt-2 text-[14px]">
              Return requests must be initiated within 24 hours of receiving the shipment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">2. Non-Returnable Products</h2>
            <p>
              Due to hygiene, health, and perishable food safety regulations, we do not accept returns for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>Opened, unsealed, or unlocked food packages.</li>
              <li>Products that have been used or handled.</li>
              <li>Items partially or fully consumed.</li>
              <li>Products damaged due to customer mishandling or improper storage.</li>
              <li>Orders pre-approved and confirmed by the customer prior to delivery dispatch.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">3. Proof Submission Requirements</h2>
            <p>
              To process your request quickly and fairly, customers are required to provide:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>Official Order Reference ID.</li>
              <li>Clear photograph of the product focusing on the reported issue.</li>
              <li>Clear photograph of the delivery package container and shipping labels.</li>
              <li>Contextual WhatsApp communication logs where applicable.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">4. Return Approvals</h2>
            <p>
              Once our customer service team verifies the submitted details, eligible orders may qualify for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li><strong>Replacement:</strong> A new package containing the correct item is dispatched.</li>
              <li><strong>Refund:</strong> Payment is returned to the original source bank/account.</li>
              <li><strong>Store Credit:</strong> Store credit is issued to apply towards future orders.</li>
            </ul>
            <p className="text-gray-500 text-sm italic">
              Discretion regarding the final return method resides with the store management team.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">5. Delivery Charges</h2>
            <p>
              Logistics and delivery fees are non-refundable, except in cases where the return request was triggered by a shipping error on our part (e.g., dispatching the wrong product) or transit damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">6. Fresh Agricultural and Food Products</h2>
            <p>
              Since our catalogue contains organic commodities, including raw dates, nuts, dry fruits, and spices, natural variations in flavor, texture, scale, and color are expected. These organic variations are natural attributes of pure food goods and are not classified as flaws.
            </p>
          </section>

          <section className="space-y-4 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">7. Customer Support Coordination</h2>
            <p>
              To coordinate a return process, contact us directly:
            </p>
            <div className="text-[14px] text-gray-600 space-y-2 pl-4 border-l-2 border-[#006837] font-medium">
              <p className="text-gray-900 font-semibold text-base">Healthy Dates & Nuts Support Desk</p>
              <p>WhatsApp Live Chat: <a href="https://wa.me/918157858977" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-[#006837] underline transition-colors">Open Support Chat</a></p>
              <p>Phone Line: <a href="tel:+918157858977" className="text-gray-900 hover:text-[#006837] underline transition-colors">+91 8157858977</a></p>
              <p>Email support: <a href="mailto:shoponline@healthydates.in" className="text-gray-900 hover:text-[#006837] underline transition-colors">shoponline@healthydates.in</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
