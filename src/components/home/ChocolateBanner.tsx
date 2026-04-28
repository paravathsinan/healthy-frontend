import Image from 'next/image';
import Link from 'next/link';

export function ChocolateBanner() {
  return (
    <section className="relative overflow-hidden bg-[#E9E1D7] w-full">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row min-h-[300px] md:min-h-[450px]">
        {/* Image Container: Top on mobile, Background/Right on desktop */}
        <div className="relative w-full h-[300px] md:h-auto md:absolute md:inset-0 md:z-0">
          {/* Mobile Image */}
          <div className="md:hidden w-full h-full relative">
            <Image 
              src="/images/banners/premium_chocolate_mobile.png" 
              alt="Premium Chocolate Delight" 
              fill 
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover object-center"
              priority
            />
          </div>
          {/* Desktop Image */}
          <div className="hidden md:block w-full h-full relative">
            <Image 
              src="/images/banners/ChatGPT Image Apr 27, 2026, 08_48_01 PM.png" 
              alt="Chocolate Delight" 
              fill 
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover object-right"
              priority
            />
          </div>
        </div>

        {/* Content Area: Below image on mobile, Over image on desktop */}
        <div className="relative z-10 px-6 md:px-12 py-12 md:py-8 flex flex-col items-start text-left justify-center w-full md:w-1/2">
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-gray-900 font-medium text-base md:text-lg uppercase tracking-widest block">Sweet Cravings</span>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] md:leading-[0.9] tracking-tighter">
                Chocolate <br className="hidden md:block" /> Delight
              </h2>
              <p className="text-gray-800 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
                Sourced globally, our premium-quality chocolates bring a taste of luxury to your moments.
              </p>
            </div>
            
            <Link 
              href="/category/chocolates" 
              className="inline-block bg-[#1A1A1A] text-white px-12 md:px-16 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:bg-black transition-all shadow-2xl active:scale-95"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
