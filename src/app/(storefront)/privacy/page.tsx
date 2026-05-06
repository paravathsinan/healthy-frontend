import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Healthy Dates & Nuts",
  description: "Learn how Healthy Dates & Nuts collects, uses, stores, and protects your personal information when you use our storefront, products, and services.",
};

export default function PrivacyPolicyPage() {
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
          <span className="text-[12px] font-semibold text-gray-400 tracking-widest uppercase">Legal Document</span>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight mt-1 mb-3">Privacy Policy</h1>
          <p className="text-gray-500 text-sm">Last Updated: May 2026</p>
          <div className="h-[1px] bg-gray-100 mt-8" />
        </div>

        {/* Formal Content Body */}
        <div className="space-y-10 text-gray-700 leading-relaxed text-[15px] md:text-[16px]">
          
          <p>
            Welcome to <strong>Healthy Dates & Nuts</strong>. Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website, place orders, contact us, or interact with our services.
          </p>
          
          <p>
            By using our website, you agree to the practices described in this Privacy Policy.
          </p>

          <section className="space-y-4 pt-4">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">1. Information We Collect</h2>
            <p>
              When you use our website, we may collect the following categories of information:
            </p>
            
            <div className="space-y-4 pl-4 border-l border-gray-100 mt-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-[15px]">Personal Information</h3>
                <p className="text-gray-600 text-[14px] mt-1">
                  Full name, phone number, delivery address, WhatsApp number, order details, and any communications sent through WhatsApp or our official contact forms.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 text-[15px]">Technical Information</h3>
                <p className="text-gray-600 text-[14px] mt-1">
                  Device type, browser configuration, IP address, pages visited on our website, duration of visits, products viewed, and general analytics/visitor statistics.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-[15px]">Order Information</h3>
                <p className="text-gray-600 text-[14px] mt-1">
                  Products ordered, selected variations or weight metrics, quantities, delivery preferences, and order fulfillment details.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">2. How We Use Your Information</h2>
            <p>
              We utilize collected information strictly for business operations, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>Processing and managing orders.</li>
              <li>Contacting you regarding deliveries, order tracking, or product inquiries.</li>
              <li>Providing responsive customer support.</li>
              <li>Improving website performance, load times, and overall usability.</li>
              <li>Analyzing website traffic patterns and product popularity.</li>
              <li>Preventing fraudulent, unauthorized, or suspicious transactions.</li>
              <li>Maintaining standard internal business and accounting records.</li>
            </ul>
            <p className="text-gray-800 font-medium pt-2">
              We do not sell, lease, or share your personal information with external third parties for marketing purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">3. WhatsApp Communication</h2>
            <p>
              Our website links directly with WhatsApp to facilitate seamless order coordination and customer communications.
            </p>
            <p>
              By using our services, you understand and agree that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>Order placement and customer support interactions may occur through WhatsApp.</li>
              <li>Delivery tracking or scheduling coordination may happen directly via WhatsApp or phone.</li>
              <li>Necessary order logs are preserved to maintain standard service records.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">4. Cookies and Analytics</h2>
            <p>
              We utilize minimal cookies and web analytics platforms to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 text-[15px]">
              <li>Remember user-defined interface preferences.</li>
              <li>Enhance search box efficiency and autocomplete features.</li>
              <li>Measure visitor frequency and dynamic page usage.</li>
              <li>Optimize page speed and graphic asset delivery.</li>
            </ul>
            <p>
              These trackers do not access private files or personal device data. You can configure your browser to block cookies, though some features of the store may operate with limitations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">5. Data Protection</h2>
            <p>
              We implement industry-standard administrative and technical security measures to protect your database records. This includes limited staff access privileges, secure cloud hosting infrastructure, and encrypted communications where applicable.
            </p>
            <p className="text-gray-500 text-sm italic">
              While we take maximum precaution to secure transaction data, please note that no internet-based transmission is completely secure, and we cannot guarantee absolute database invulnerability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">6. Third-Party Services</h2>
            <p>
              We may utilize trusted third-party providers to handle web hosting, image rendering, traffic analytics, and communication interfaces. These service partners maintain independent operations and are governed by their respective privacy terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">7. Children&apos;s Privacy</h2>
            <p>
              Our services are directed to general adult audiences and are not structured to collect information from individuals under 13 years of age.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">8. Your Rights</h2>
            <p>
              You maintain the right to request the correction, updates, or complete deletion of your stored records, where allowed by operational accounting requirements. To make a inquiry, please contact our support desk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">9. Policy Updates</h2>
            <p>
              We reserve the right to modify this policy periodically to align with legal or technical changes. Any revisions become active immediately upon publication to this URL.
            </p>
          </section>

          <section className="space-y-4 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-950 tracking-tight">10. Contact Information</h2>
            <p>
              For legal queries or data deletion requests, contact us through the following formal channels:
            </p>
            <div className="text-[14px] text-gray-600 space-y-2 pl-4 border-l-2 border-[#006837] font-medium">
              <p className="text-gray-900 font-semibold text-base">Healthy Dates & Nuts</p>
              <p>Address: Muttipalam, Manjeri, Kerala, India</p>
              <p>Phone: <a href="tel:+918157858977" className="text-gray-900 hover:text-[#006837] underline transition-colors">+91 8157858977</a></p>
              <p>Email: <a href="mailto:shoponline@healthydates.in" className="text-gray-900 hover:text-[#006837] underline transition-colors">shoponline@healthydates.in</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
