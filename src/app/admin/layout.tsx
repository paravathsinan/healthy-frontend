"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Box, Layers, ClipboardList, LogOut, ExternalLink, RefreshCw, Monitor, Menu, X } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";
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
    // 1. Quick local check for token
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (pathname === '/admin/login') {
      setIsAuthLoading(false);
      return;
    }

    if (!token) {
      router.push('/admin/login');
      setIsAuthLoading(false);
      return;
    }

    // 2. Perform background verification
    const verifyToken = async () => {
      try {
        await api.get('/verify-token/');
        setIsAuthLoading(false);
      } catch (error: any) {
        console.error("Token verification failed:", error);
        // On failure, redirect to login
        router.push('/admin/login');
        setIsAuthLoading(false);
      }
    };

    verifyToken();
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

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  if (isAuthLoading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-[#006837]/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-[#006837] rounded-full animate-spin shadow-[0_0_15px_rgba(0,104,55,0.2)]" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#006837]/40 animate-pulse">
          Authenticating
        </p>
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[40] w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between gap-4">
          <div onClick={handleLogoClick} className="flex items-center gap-2.5 group cursor-pointer min-w-0">
            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110 shrink-0">
              <Image 
                src="/logo/logo.png" 
                alt="Logo" 
                fill 
                sizes="32px"
                className="object-contain"
              />
            </div>
            <span className="text-lg font-black tracking-tighter text-gray-900 font-heading whitespace-nowrap truncate">
              Healthy Manager
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-black transition-colors shrink-0"
          >
            <X size={22} />
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
            target="_blank"
            rel="noopener noreferrer"
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
      <main className="flex-1 min-h-screen lg:ml-72 transition-all duration-300 w-full max-w-full overflow-x-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
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
              className="flex items-center gap-2 text-[10px] font-medium text-gray-800 hover:text-[#006837] transition-all bg-gray-50 px-3 sm:px-4 py-2 rounded-full border border-gray-100"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'REFRESHING...' : 'REFRESH'}
            </button>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-right hidden xs:block">
                <p className="text-[13px] font-bold text-gray-900 leading-tight">Admin</p>
                <p className="text-[10px] font-medium text-gray-400 hidden md:block">admin@datesandnuts.com</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#006837] flex items-center justify-center text-white font-black text-xs border border-[#006837]">
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
