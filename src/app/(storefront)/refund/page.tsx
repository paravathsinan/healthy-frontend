import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy | Healthy Dates & Nuts",
  description: "Read our clear, transparent, and formal Refund Policy. Learn about eligibility conditions, payment methods, cancellation rules, and processing speeds.",
};

export default function RefundPolicyPage() {
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
          <span className="text-[12px] font-semibold text-gray-400 tracking-widest uppercase">Transactions & Billing</span>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mt-1 mb-3">Refund Policy</h1>
          <p className="text-gray-500 text-sm">Last Updated: May 2026</p>
          <div className="h-[1px] bg-gray-100 mt-8" />
        </div>

        {/* Formal Content Body */}
        <div className="space-y-10 text-gray-700 leading-relaxed text-[15px] md:text-[16px]">
          
          <p>
            At <strong>Healthy Dates & Nuts</strong>, we aim to ensure fair, prompt, and transparent refund handling for all customers. Please review the following refund terms carefully.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">1. Refund Eligibility</h2>
            <p>
              Refund requests are evaluated on a case-by-case basis and may be approved under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>The order cannot be fulfilled due to stock shortages or delivery restrictions.</li>
              <li>A product is unavailable after order confirmation has been shared.</li>
              <li>An incorrect or wrong product variant was delivered.</li>
              <li>A product arrives with verified package tampering or transit damage.</li>
              <li>A technical error resulted in duplicate card or UPI charges.</li>
              <li>An approved return claim meets refund conditions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">2. Non-Refundable Situations</h2>
            <p>
              Refunds will not be approved under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>A change of mind or preference occurs after the order has been dispatched.</li>
              <li>Incorrect or incomplete shipping addresses, PIN codes, or contact numbers were submitted.</li>
              <li>Delivery fails due to customer unavailability at the provided shipping address.</li>
              <li>The inner seals of the food packages are broken or items have been partially consumed.</li>
              <li>Minor variations in packing box labels exist without any dynamic damage to the inner goods.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">3. Refund Processing Time</h2>
            <p>
              Once a refund claim is officially reviewed and approved by our financial administration team, the processing schedule is as follows:
            </p>
            <p className="text-gray-900 font-medium">
              Funds are typically settled within 3 to 7 business days for standard UPI transfers, wallet balances, or direct bank accounts.
            </p>
            <p className="text-gray-500 text-sm italic">
              Please note that additional clearing delays can occur depending on credit networks, intermediary banking systems, or local gateway operators.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">4. Refund Methods</h2>
            <p>
              Approved refunds are disbursed through:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>UPI Transfer (GPay, PhonePe, Paytm, BHIM, etc.).</li>
              <li>Direct Bank Transfer (IMPS/NEFT/RTGS).</li>
              <li>Reversal to the original online transaction payment source.</li>
              <li>Store credit (disbursed as a custom coupon code for store purchases).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">5. Partial Refunds</h2>
            <p>
              Under multi-item order circumstances, we may issue a partial refund corresponding precisely to the affected item’s value, calculated minus logistics overheads and packaging conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">6. Order Cancellation</h2>
            <p>
              Customers can cancel an order without any penalty <strong>prior to delivery dispatch</strong>. Once the logistics dispatch notice is issued, cancellation can no longer be processed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">7. Abuse Prevention</h2>
            <p>
              We reserve the right to decline return or refund clearances in events involving fraudulent purchase histories, multiple duplicate customer accounts, or repeated misuse of promotional coupons or discounts.
            </p>
          </section>

          <section className="space-y-4 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">8. Billing and Support Desk</h2>
            <p>
              For transaction histories or billing questions, contact our support team directly:
            </p>
            <div className="text-[14px] text-gray-600 space-y-2 pl-4 border-l-2 border-[#006837] font-medium">
              <p className="text-gray-900 font-semibold text-base">Healthy Dates & Nuts Support Desk</p>
              <p>WhatsApp Support: <a href="https://wa.me/918157858977" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-[#006837] underline transition-colors">Chat directly</a></p>
              <p>Phone support: <a href="tel:+918157858977" className="text-gray-900 hover:text-[#006837] underline transition-colors">+91 8157858977</a></p>
              <p>Email support: <a href="mailto:shoponline@healthydates.in" className="text-gray-900 hover:text-[#006837] underline transition-colors">shoponline@healthydates.in</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
