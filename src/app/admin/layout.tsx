"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Box, Layers, ClipboardList, LogOut, ExternalLink, RefreshCw, Monitor, Menu, X } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Box },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Hero Slides', href: '/admin/hero', icon: Monitor },
  { name: 'WhatsApp Logs', href: '/admin/orders', icon: ClipboardList },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (pathname === '/admin/login') {
      setIsAuthLoading(false);
      return;
    }

    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthLoading(false);
    }
  }, [pathname, router]);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/admin/login');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate a brief spin before reloading for better UX
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  if (isAuthLoading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006837]" />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans overflow-x-hidden max-w-[100vw]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-56 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
              <Image 
                src="/logo/logo.png" 
                alt="Logo" 
                fill 
                sizes="32px"
                className="object-contain"
              />
            </div>
            <span className="text-lg font-black tracking-tighter text-gray-900 font-heading whitespace-nowrap">
              Healthy Manager
            </span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 px-4">Main Menu</p>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.name === 'Products' && pathname.startsWith('/admin/products'));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-2.5 text-[14px] font-bold rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-[#006837] text-white shadow-md shadow-[#006837]/20" 
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                } group`}
              >
                <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-white' : 'group-hover:text-[#006837]'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50 space-y-1">
          <Link 
            href="/"
            className="flex items-center gap-3.5 px-4 py-2.5 text-[14px] font-bold rounded-xl text-gray-500 hover:text-black hover:bg-gray-50 transition-all w-full"
          >
            <ExternalLink className="h-4 w-4" />
            View Storefront
          </Link>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3.5 px-4 py-2.5 text-[14px] font-bold rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 w-full transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen lg:ml-56 transition-all duration-300 w-full max-w-full overflow-x-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-gray-900 tracking-tight hidden xs:block uppercase">Administrator Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-[#006837] transition-all bg-gray-50 px-4 py-2 rounded-full border border-gray-100 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'REFRESHING...' : 'REFRESH'}
            </button>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-right hidden xs:block">
                <p className="text-[13px] font-bold text-gray-900 leading-tight">Admin</p>
                <p className="text-[10px] font-medium text-gray-400 hidden md:block">admin@datesandnuts.com</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-black text-xs border border-gray-100">
                AD
              </div>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
