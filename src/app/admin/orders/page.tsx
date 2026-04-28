"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ClipboardList, Search, Filter, MessageCircle, ArrowRight, User, MapPin, Calendar, Loader2 } from "lucide-react";

import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal";

export default function AdminWhatsAppLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/');
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.customer_phone.includes(searchQuery) ||
    `ORD-${log.id}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {

    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'CONTACTED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'AWAITING_PAY': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'PAID': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'SHIPPED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'COMPLETED': return 'bg-green-50 text-green-600 border-green-100';
      case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getTimeLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
        <div className="space-y-0.5">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight font-heading">
            WhatsApp Logs
          </h1>
          <p className="text-[13px] md:text-[14px] text-gray-500 font-medium max-w-md">Track customer intent from website to WhatsApp.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#006837] transition-colors" />
            <input 
              type="text" 
              placeholder="Search customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-[13px] font-bold text-gray-900 focus:outline-none focus:border-[#006837] focus:ring-4 focus:ring-[#006837]/5 w-full sm:w-64 shadow-sm transition-all placeholder:text-gray-400"
            />
          </div>
          <button className="hidden sm:flex bg-white p-3 rounded-2xl border border-gray-100 text-gray-400 hover:text-black shadow-sm transition-all">
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          // Detailed Loading Skeletons
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-100 rounded-full" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-4 bg-gray-100 rounded" />
                      <div className="w-20 h-3 bg-gray-50 rounded" />
                    </div>
                    <div className="h-6 bg-gray-100 rounded w-40" />
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-3 bg-gray-50 rounded" />
                      <div className="w-16 h-3 bg-gray-50 rounded" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right space-y-2">
                    <div className="w-20 h-2 bg-gray-50 rounded ml-auto" />
                    <div className="w-24 h-7 bg-gray-100 rounded ml-auto" />
                  </div>
                  
                  <div className="flex flex-col items-end gap-2.5">
                    <div className="w-20 h-5 rounded-full bg-gray-50" />
                    <div className="w-16 h-3 bg-gray-50 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredLogs.length > 0 ? (

          filteredLogs.map((log) => (

            <div key={log.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-[#006837] shrink-0 border border-green-100/50">
                  <MessageCircle size={24} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#006837] bg-[#006837]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">ORD-{log.id}</span>
                    <span className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">• {getTimeLabel(log.created_at)}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 font-heading">{log.customer_name}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-gray-300" />
                      <span className="text-[10px] font-bold uppercase tracking-wide">{log.customer_phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ClipboardList size={12} className="text-gray-300" />
                      <span className="text-[10px] font-bold uppercase tracking-wide">{log.items?.length || 0} Items</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-10 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Value</p>
                  <p className="text-2xl font-black text-gray-900 font-heading">₹{log.total_amount}</p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span 
                    onClick={() => handleShowDetails(log)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border cursor-pointer hover:shadow-md transition-all shadow-sm ${getStatusColor(log.status)}`}
                  >
                    {log.status}
                  </span>

                  <button 
                    onClick={() => handleShowDetails(log)}
                    className="flex items-center gap-1.5 text-[#006837] font-black text-[10px] uppercase tracking-widest hover:text-black transition-colors group/btn"
                  >
                    Details <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>

          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <ClipboardList className="h-12 w-12 text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No WhatsApp orders found yet.</p>
          </div>
        )}
      </div>

      <OrderDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdate={fetchOrders}
      />
    </div>
  );
}
