"use client";

import { useEffect, useState, useCallback } from "react";
import { getProducts, getCategories, getDashboardStats, getVisitors } from "@/lib/api";
import api from "@/lib/api";
import {
  Users, MessageCircle, ArrowUpRight, Package, List,
  RefreshCw, ChevronDown, ChevronUp, Globe, Clock, Hash, Loader2, Trash2, Timer
} from "lucide-react";
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

  // Visitor list state
  const [showVisitors, setShowVisitors] = useState(false);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [visitorsLoading, setVisitorsLoading] = useState(false);
  const [visitorsMeta, setVisitorsMeta] = useState<{ count: number; total_pages: number; page: number } | null>(null);
  const [visitorsPage, setVisitorsPage] = useState(1);
  const [clearingVisitors, setClearingVisitors] = useState(false);

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

  const fetchVisitors = useCallback(async (page = 1) => {
    setVisitorsLoading(true);
    try {
      const data = await getVisitors(page, 20);
      setVisitors(data.results);
      setVisitorsMeta({ count: data.count, total_pages: data.total_pages, page: data.page });
      setVisitorsPage(page);
    } catch {
      toast.error("Failed to load visitor list");
    } finally {
      setVisitorsLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
      if (showVisitors) await fetchVisitors(visitorsPage);
      router.refresh();
      toast.success("Dashboard data refreshed");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleVisitorsToggle = () => {
    if (!showVisitors) {
      setShowVisitors(true);
      fetchVisitors(1);
    } else {
      setShowVisitors(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  /** Converts total seconds into a human-readable string e.g. "2h 14m" or "45s" */
  const formatDuration = (seconds: number): string => {
    if (!seconds || seconds < 1) return "< 1s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const handleClearVisitors = async () => {
    if (!window.confirm("Clear ALL visitor records? This cannot be undone.")) return;
    setClearingVisitors(true);
    try {
      await api.delete('/clear-visitors/');
      setVisitors([]);
      setVisitorsMeta(null);
      setStatsData((prev: any) => prev ? { ...prev, total_visitors: 0 } : prev);
      toast.success("All visitor records cleared");
    } catch {
      toast.error("Failed to clear visitors");
    } finally {
      setClearingVisitors(false);
    }
  };

  const stats = [
    { label: "Total Products", value: statsData?.product_count ?? products.length, icon: Package, color: "text-[#006837]", bg: "bg-[#006837]/10", clickable: false },
    { label: "Categories", value: statsData?.category_count ?? categories.length, icon: List, color: "text-blue-600", bg: "bg-blue-50", clickable: false },
    { label: "WhatsApp Clicks", value: statsData?.whatsapp_clicks ?? 0, icon: MessageCircle, color: "text-green-600", bg: "bg-green-50", clickable: false },
    { label: "Total Visitors", value: statsData?.total_visitors ?? 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50", clickable: true },
  ];

  if (!mounted) return <div className="min-h-screen bg-gray-50/50" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight font-heading">
            Dashboard
          </h1>
          <p className="text-[13px] text-gray-500 font-medium">Overview of your store&apos;s performance.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
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
          stats.map((stat) => {
            const isVisitors = stat.label === "Total Visitors";
            const isActive = isVisitors && showVisitors;

            return (
              <div
                key={stat.label}
                onClick={stat.clickable ? handleVisitorsToggle : undefined}
                className={`bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-300 shadow-sm flex flex-col gap-4 group ${
                  stat.clickable
                    ? "cursor-pointer hover:shadow-xl hover:shadow-black/5 select-none"
                    : "hover:shadow-xl hover:shadow-black/5"
                } ${isActive ? "border-purple-300 ring-2 ring-purple-100 shadow-lg shadow-purple-100" : "border-gray-100"}`}
              >
                <div className="flex justify-between items-start">
                  <div className={`p-2 md:p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <div className={`p-1.5 rounded-full transition-all ${isActive ? "bg-purple-50 text-purple-500" : "bg-gray-50 text-gray-400 group-hover:text-black"}`}>
                    {isVisitors
                      ? isActive
                        ? <ChevronUp className="h-3 md:h-4 w-3 md:w-4" />
                        : <ChevronDown className="h-3 md:h-4 w-3 md:w-4" />
                      : <ArrowUpRight className="h-3 md:h-4 w-3 md:w-4" />
                    }
                  </div>
                </div>
                <div>
                  <p className="text-[9px] md:text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-xl md:text-3xl font-black text-gray-900 font-heading leading-tight">{stat.value}</p>
                  {isVisitors && (
                    <p className="text-[10px] text-purple-400 font-medium mt-1">
                      {isActive ? "Click to collapse" : "Click to see details"}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Visitor List — slides in below cards when toggled */}
      <div className={`grid transition-all duration-500 ease-in-out ${showVisitors ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-500">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-[14px] font-black text-gray-900 tracking-tight">Unique Visitors</h2>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {visitorsMeta ? `${visitorsMeta.count} total unique browsers` : "Loading…"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClearVisitors}
                  disabled={clearingVisitors || !visitorsMeta?.count}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {clearingVisitors
                    ? <Loader2 className="h-3 w-3 animate-spin" />
                    : <Trash2 className="h-3 w-3" />}
                  Clear All
                </button>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-50 px-3 py-1 rounded-full">
                  Newest First
                </span>
              </div>
            </div>

            {/* Table Content */}
            {visitorsLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
              </div>
            ) : visitors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center space-y-2">
                <div className="p-5 rounded-full bg-gray-50 text-gray-200">
                  <Users size={32} />
                </div>
                <p className="text-sm font-bold text-gray-500">No visitors yet</p>
                <p className="text-xs text-gray-400">Share your store link to get your first visitor.</p>
              </div>
            ) : (
              <>
                {/* Column headers — desktop */}
                <div className="hidden md:grid grid-cols-[2rem_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-gray-50/50 border-b border-gray-50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">#</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visitor ID</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">First Seen</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last Seen</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Time Spent</span>
                </div>

                {/* Rows */}
                {visitors.map((v, idx) => (
                  <div
                    key={v.visitor_id}
                    className="flex flex-col md:grid md:grid-cols-[2rem_1fr_1fr_1fr_1fr] gap-2 md:gap-4 px-6 py-4 border-b border-gray-50/70 last:border-0 hover:bg-gray-50/40 transition-colors group"
                  >
                    {/* Row number */}
                    <div className="hidden md:flex items-center">
                      <span className="text-[11px] font-bold text-gray-300">
                        {(visitorsPage - 1) * 20 + idx + 1}
                      </span>
                    </div>

                    {/* Visitor ID */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                        <Users className="h-3.5 w-3.5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-[11px] md:text-[12px] font-black text-gray-900 font-mono">
                          {v.id}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium md:hidden">
                          First: {formatDate(v.first_seen)}
                        </p>
                      </div>
                    </div>

                    {/* First Seen */}
                    <div className="hidden md:flex flex-col justify-center">
                      <p className="text-[12px] font-bold text-gray-700">{formatDate(v.first_seen)}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {formatTime(v.first_seen)}
                      </p>
                    </div>

                    {/* Last Seen */}
                    <div className="hidden md:flex flex-col justify-center">
                      <p className="text-[12px] font-bold text-gray-700">{formatDate(v.last_seen)}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {formatTime(v.last_seen)}
                      </p>
                    </div>

                    {/* Time Spent */}
                    <div className="hidden md:flex flex-col justify-center">
                      <p className="text-[12px] font-bold text-[#006837] flex items-center gap-1">
                        <Timer className="h-3.5 w-3.5" />
                        {formatDuration(v.total_time_seconds)}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">total on-site</p>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {visitorsMeta && visitorsMeta.total_pages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50 bg-gray-50/30">
                    <button
                      disabled={visitorsPage <= 1}
                      onClick={() => fetchVisitors(visitorsPage - 1)}
                      className="text-[12px] font-bold text-gray-500 disabled:opacity-30 hover:text-[#006837] transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 disabled:hover:bg-transparent"
                    >
                      ← Previous
                    </button>
                    <span className="text-[11px] font-bold text-gray-400">
                      Page {visitorsPage} of {visitorsMeta.total_pages}
                    </span>
                    <button
                      disabled={visitorsPage >= visitorsMeta.total_pages}
                      onClick={() => fetchVisitors(visitorsPage + 1)}
                      className="text-[12px] font-bold text-gray-500 disabled:opacity-30 hover:text-[#006837] transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 disabled:hover:bg-transparent"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
