import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Healthy Dates & Nuts",
  description: "Read the formal Terms and Conditions of Healthy Dates & Nuts. Understand website usage rules, product descriptions, delivery estimates, and legal frameworks.",
};

export default function TermsAndConditionsPage() {
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
          <span className="text-[12px] font-semibold text-gray-400 tracking-widest uppercase">Agreement</span>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mt-1 mb-3">Terms and Conditions</h1>
          <p className="text-gray-500 text-sm">Last Updated: May 2026</p>
          <div className="h-[1px] bg-gray-100 mt-8" />
        </div>

        {/* Formal Content Body */}
        <div className="space-y-10 text-gray-700 leading-relaxed text-[15px] md:text-[16px]">
          
          <p>
            Welcome to <strong>Healthy Dates & Nuts</strong>. By accessing, browsing, or utilizing our online store platform, you agree to comply with and be formally bound by the following Terms and Conditions of service. Please review them thoroughly.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">1. Website Usage and Security</h2>
            <p>
              By accessing this store, you commit:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>To use our website exclusively for lawful purposes and individual orders.</li>
              <li>Not to attempt, assist, or coordinate unauthorized security testing, penetration testing, or breach attempts.</li>
              <li>Not to disrupt or alter transactions, database values, or frontend visual assets.</li>
              <li>Not to inject scripts, automated bots, crawling scripts, or web crawlers without explicit written permission.</li>
            </ul>
            <p>
              We maintain active monitoring and reserve the right to limit, block, or completely terminate access for users displaying anomalous patterns.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">2. Product Information and Listings</h2>
            <p>
              While we attempt to ensure that catalog attributes, labels, product imagery, names, and specifications are precise and current, please note that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>Actual packages, boxes, or labels may vary slightly due to supplier or print batch variations.</li>
              <li>Product imagery color profiles and scales may appear differently depending on browser configurations or device displays.</li>
              <li>Dynamic inventory changes can result in immediate stock shortages.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">3. Catalog Pricing</h2>
            <p>
              Pricing structures, variant metrics, and values published on the store are dynamic and subject to update without prior notification. We reserve full rights to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>Correct accidental pricing or metadata listing errors in the database.</li>
              <li>Withdraw, modify, or restrict active coupons, store credit, or discount criteria.</li>
              <li>Set or update delivery rates depending on logistics partners.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">4. Order Acceptance Rules</h2>
            <p>
              Receipt of an order transaction payload through our store does not constitute automatic binding acceptance. We reserve the right to decline, hold, or adjust orders in cases involving inventory shortages, logistical constraints, regional issues, or payment verification failures.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">5. Logistical Deliveries</h2>
            <p>
              Stated transit periods are approximate guidelines. Deliveries can encounter delays due to weather conditions, transport interruptions, public holidays, high demand periods, or third-party courier logistical failures.
            </p>
            <p className="text-gray-500 text-sm italic">
              We are not liable for delayed timelines that fall outside of our operational control.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">6. Intellectual Property Rights</h2>
            <p>
              All trademarks, logo symbols, brand structures, proprietary photographs, illustrations, and code architectures are the intellectual property of <strong>Healthy Dates & Nuts</strong>. Mirroring, reproduction, hotlinking, or commercial use without formal permission is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">7. Limitation of Liability</h2>
            <p>
              Healthy Dates & Nuts is not responsible for temporary website downtime, minor server delays, third-party integration faults (e.g. image host failures), or minor variations in taste or product size matching due to natural agricultural variations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">8. External Links</h2>
            <p>
              Our website may contain links to third-party services or platforms (like WhatsApp, Google Maps, or external payment gateways). We are not responsible for the privacy practices, content, or general actions of these external platforms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">9. User Conduct and Responsibilities</h2>
            <p>
              Users must not:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>Abuse or threaten customer support staff.</li>
              <li>Submit false orders, prank listings, or fraudulent checkout payloads.</li>
              <li>Attempt to inject malicious scripts, malware, or coordinate cyber attacks.</li>
              <li>Misuse promotional offers or duplicate coupons using multiple browsers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">10. Agreement Updates</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Continued usage of the website after published changes indicates your complete acceptance of the updated rules.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">11. Governing Law</h2>
            <p>
              These agreements are governed by applicable local rules and trade laws. Disputes will be addressed within local jurisdictional coordinates.
            </p>
          </section>

          <section className="space-y-4 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">12. Corporate Address & Coordination</h2>
            <p>
              For legal notifications or compliance concerns, reach out through formal coordinates:
            </p>
            <div className="text-[14px] text-gray-600 space-y-2 pl-4 border-l-2 border-[#006837] font-medium">
              <p className="text-gray-900 font-semibold text-base">Healthy Dates & Nuts Legal Compliance</p>
              <p>Corporate Office: Muttipalam, Manjeri, Kerala, India</p>
              <p>Phone support: <a href="tel:+918157858977" className="text-gray-900 hover:text-[#006837] underline transition-colors">+91 8157858977</a></p>
              <p>WhatsApp Line: <a href="https://wa.me/918157858977" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-[#006837] underline transition-colors">Open Chat</a></p>
              <p>Email compliance: <a href="mailto:shoponline@healthydates.in" className="text-gray-900 hover:text-[#006837] underline transition-colors">shoponline@healthydates.in</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
