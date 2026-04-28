import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="relative w-64 h-64 mb-8">
          <div className="absolute inset-0 bg-[#006837]/5 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center text-[120px] font-black text-[#006837]/20 tracking-tighter">
            404
          </div>
        </div>
        
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            The page you are looking for might have been moved, deleted, or never existed. Don&apos;t worry, you can still find our premium dates and nuts.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="px-12 py-4 bg-[#006837] text-white rounded-full font-black hover:bg-[#004d29] transition-all shadow-xl active:scale-95 text-center"
            >
              Back to Home
            </Link>
            <Link 
              href="/products"
              className="px-12 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-black hover:bg-gray-900 hover:text-white transition-all text-center"
            >
              All Products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
