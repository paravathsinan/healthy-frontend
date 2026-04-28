"use client";

import { useEffect, useState } from "react";
import { getProducts, getCategories, getDashboardStats } from "@/lib/api";

import { ShoppingBag, TrendingUp, Users, MessageCircle, ArrowUpRight, Package, List, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);


  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData, stats] = await Promise.all([
        getProducts().catch(() => []),
        getCategories().catch(() => []),
        getDashboardStats().catch(() => ({ 
          product_count: 0, 
          category_count: 0, 
          whatsapp_clicks: 0, 
          active_visitors: 1 
        })),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setStatsData(stats);
    } catch (error) {
      console.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);


  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
      router.refresh();
      toast.success("Dashboard data refreshed");
    } finally {
      setIsRefreshing(false);
    }
  };

  const stats = [
    { label: "Total Products", value: statsData?.product_count ?? products.length, icon: Package, color: "text-[#006837]", bg: "bg-[#006837]/10" },
    { label: "Categories", value: statsData?.category_count ?? categories.length, icon: List, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "WhatsApp Clicks", value: statsData?.whatsapp_clicks ?? 0, icon: MessageCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Active Visitors", value: statsData?.active_visitors ?? 1, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  if (!mounted) return <div className="min-h-screen bg-gray-50/50" />;

  return (

    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight font-heading">
            Dashboard
          </h1>
          <p className="text-[13px] text-gray-500 font-medium">Overview of your store's performance.</p>
        </div>
      </div>


      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          // Loading Skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-4 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="p-2 md:p-3 rounded-xl bg-gray-50 w-10 md:w-11 h-10 md:h-11" />
                <div className="p-1.5 rounded-full bg-gray-50 w-6 md:w-7 h-6 md:h-7" />
              </div>
              <div className="space-y-2">
                <div className="h-2.5 bg-gray-50 rounded w-1/2" />
                <div className="h-7 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))
        ) : (
          stats.map((stat) => (
            <div key={stat.label} className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-4 group hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
              <div className="flex justify-between items-start">
                <div className={`p-2 md:p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div className="p-1.5 rounded-full bg-gray-50 text-gray-400 group-hover:text-black transition-all cursor-pointer">
                  <ArrowUpRight className="h-3 md:h-4 w-3 md:w-4" />
                </div>
              </div>
              <div>
                <p className="text-[9px] md:text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl md:text-3xl font-black text-gray-900 font-heading leading-tight">{stat.value}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

