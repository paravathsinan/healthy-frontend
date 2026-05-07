import { Navbar } from "@/components/shared/Navbar";
import { BottomNav } from "@/components/shared/BottomNav";
import { Footer } from "@/components/shared/Footer";
import { VisitorTracker } from "@/components/shared/VisitorTracker";
import { WhatsAppFloatingButton } from "@/components/shared/WhatsAppFloatingButton";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Tracks unique storefront visitors only — never admin pages */}
      <VisitorTracker />
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
      {/* Floating WhatsApp Action Button (FAB) for Instant Customer Support */}
      <WhatsAppFloatingButton />
    </div>
  );
}

