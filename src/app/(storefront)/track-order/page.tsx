"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Search, MapPin, Truck, CheckCircle2, Clock, Calendar, MessageSquare, Package, ChevronRight, User, Phone, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

// Status Mapping for Customer UI
const getStatusDisplay = (status: string) => {
  const mapping: any = {
    'PENDING': { label: 'Order Placed', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', step: 1 },
    'CONTACTED': { label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50', step: 2 },
    'AWAITING_PAY': { label: 'Processing', icon: Loader2, color: 'text-indigo-500', bg: 'bg-indigo-50', step: 3 },
    'PAID': { label: 'Processing', icon: Loader2, color: 'text-indigo-500', bg: 'bg-indigo-50', step: 3 },
    'SHIPPED': { label: 'Shipped', icon: Truck, color: 'text-[#006837]', bg: 'bg-green-50', step: 4 },
    'COMPLETED': { label: 'Delivered', icon: Package, color: 'text-[#006837]', bg: 'bg-green-50', step: 5 },
    'CANCELLED': { label: 'Cancelled', icon: CheckCircle2, color: 'text-red-500', bg: 'bg-red-50', step: 0 },
  };
  return mapping[status] || { label: status, icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50', step: 1 };
};

const STEPS = [
  { label: 'Order Placed', icon: Clock },
  { label: 'Confirmed', icon: CheckCircle2 },
  { label: 'Processing', icon: Loader2 },
  { label: 'Shipped', icon: Truck },
  { label: 'Delivered', icon: Package },
];

const TrackOrderSkeleton = () => (
  <div className="space-y-8 animate-pulse mt-8">
    {/* Main Status Skeleton */}
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-black/5 border border-gray-100">
      <div className="flex flex-col items-center text-center space-y-6 mb-12">
        <div className="w-20 h-20 rounded-full bg-gray-100" />
        <div className="space-y-3">
          <div className="h-3 w-24 bg-gray-100 rounded-full mx-auto" />
          <div className="h-8 w-48 bg-gray-100 rounded-full mx-auto" />
        </div>
      </div>
      
      <div className="hidden md:block h-1 w-full bg-gray-50 rounded-full mb-16" />
      
      <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-4 px-4 md:px-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex md:flex-col items-center gap-4 md:gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
            <div className="flex flex-col md:items-center gap-2">
              <div className="h-2 w-20 bg-gray-100 rounded-full" />
              <div className="h-2 w-12 bg-gray-50 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Grid Skeletons */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-gray-100 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-gray-100" />
          <div className="h-4 w-32 bg-gray-100 rounded-full" />
        </div>
        <div className="space-y-4 pt-2">
          <div className="h-16 w-full bg-gray-50 rounded-2xl" />
          <div className="h-16 w-full bg-gray-50 rounded-2xl" />
          <div className="h-16 w-full bg-gray-50 rounded-2xl" />
        </div>
      </div>
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-gray-100 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-gray-100" />
          <div className="h-4 w-32 bg-gray-100 rounded-full" />
        </div>
        <div className="space-y-4 pt-2">
          <div className="h-12 w-full bg-gray-50 rounded-xl" />
          <div className="h-12 w-full bg-gray-50 rounded-xl" />
          <div className="h-12 w-full bg-gray-50 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");


  const handleTrack = async (e?: React.FormEvent, initialOrderId?: string, initialPhone?: string) => {
    if (e) e.preventDefault();
    
    const idToTrack = initialOrderId || orderId;
    const phoneToTrack = initialPhone || phone;
    
    if (!idToTrack || !phoneToTrack) return;

    setLoading(true);
    setError("");
    
    try {
      const { data } = await api.get(`/orders/track/?order_id=${idToTrack}&phone=${phoneToTrack}`);
      setOrder(data);
      
      // Update URL without refreshing
      const params = new URLSearchParams();
      params.set("id", idToTrack);
      params.set("phone", phoneToTrack);
      router.replace(`/track-order?${params.toString()}`, { scroll: false });

    } catch (err: any) {
      setOrder(null);
      setError(err.response?.data?.error || "Order not found. Please check your Order ID or phone number.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-track if params are present
  useEffect(() => {
    const urlId = searchParams.get("id");
    const urlPhone = searchParams.get("phone");
    if (urlId && urlPhone && !order) {
      handleTrack(undefined, urlId, urlPhone);
    }
  }, [searchParams]);

  // Smooth scroll to results once loaded
  useEffect(() => {
    if (order && !loading) {
      const scrollTimer = setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
      return () => clearTimeout(scrollTimer);
    }
  }, [order, loading]);

  // Format timestamp for display
  const formatTime = (isoString: string | null) => {
    if (!isoString) return null;
    return new Date(isoString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStepTime = (stepNum: number) => {
    if (!order) return null;
    const statusInfo = getStatusDisplay(order.status);
    const isCompleted = statusInfo.step > stepNum;
    const isCurrent = statusInfo.step === stepNum;
    
    // Only show time if the step is reached or completed
    if (stepNum > statusInfo.step) return null;

    let time = null;
    switch (stepNum) {
      case 1: time = order.created_at; break;
      case 2: time = order.confirmed_at; break;
      case 3: time = order.processed_at; break;
      case 4: time = order.shipped_at; break;
      case 5: time = order.delivered_at; break;
    }
    
    // Fallback: If completed but no specific timestamp, use created_at or updated_at
    if (!time && isCompleted) {
      return formatTime(order.created_at);
    }
    
    return formatTime(time);
  };

  const statusInfo = order ? getStatusDisplay(order.status) : null;

  return (
    <div className="min-h-fit bg-[#F9F9F9] pt-2 pb-6 sm:pt-4 sm:pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back to Home */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-[14px] font-medium">Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center space-y-3 mb-4 sm:mb-8 scroll-mt-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight font-heading italic">
            Track Your Order
          </h1>
          <p className="text-[15px] text-gray-500 font-medium">
            Enter your details below to see the current status of your delivery.
          </p>
        </div>

        {/* Search Box */}
        <div ref={titleRef} className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-black/5 border border-gray-100 mb-4 sm:mb-8">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest px-1">Order ID</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006837] transition-colors">
                    <Search size={20} />
                  </div>
                  <input 
                    type="text" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                    placeholder="e.g. ORD-2 or HDN-..."
                    className="w-full bg-gray-50 border border-[#006837]/30 rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-[#006837]/5 focus:bg-white focus:border-[#006837] transition-all text-gray-900 font-bold placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006837] transition-colors">
                    <Phone size={20} />
                  </div>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full bg-gray-50 border border-[#006837]/30 rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-[#006837]/5 focus:bg-white focus:border-[#006837] transition-all text-gray-900 font-bold placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !orderId || !phone}
              className="w-full bg-[#006837] text-white py-5 rounded-2xl font-black text-[16px] hover:bg-black transition-all shadow-xl shadow-[#006837]/10 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <span>Track Order Now</span>
                  <Truck size={20} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-[14px] font-bold"
              >
                <CheckCircle2 size={18} className="rotate-180" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading Skeleton */}
        {loading && <TrackOrderSkeleton />}

        {/* Static Scroll Anchor */}
        <div ref={resultsRef} className="scroll-mt-24" />

        {/* Order Results */}
        <AnimatePresence>
          {!loading && order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Status Tracker */}
              <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
                <div className="flex flex-col items-center text-center space-y-6 mb-12">
                  <div className={`p-5 rounded-full ${statusInfo?.bg} ${statusInfo?.color}`}>
                    <statusInfo.icon size={40} className={order.status === 'AWAITING_PAY' || order.status === 'PAID' ? 'animate-pulse' : ''} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">Current Status</p>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{statusInfo?.label}</h2>
                  </div>
                </div>

                {/* Progress Visual - Desktop: Horizontal, Mobile: Vertical */}
                <div className="relative mt-12 mb-16 px-4 md:px-12">
                  {/* Desktop Horizontal Line */}
                  <div className="hidden md:block absolute top-1/2 left-24 right-24 h-1 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((statusInfo?.step - 1) / 4) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full bg-[#006837]"
                    />
                  </div>

                  {/* Desktop Steps */}
                  <div className="hidden md:flex justify-between relative">
                    {STEPS.map((step, i) => {
                      const stepNum = i + 1;
                      const isCompleted = statusInfo!.step > stepNum;
                      const isCurrent = statusInfo!.step === stepNum;
                      const time = getStepTime(stepNum);
                      
                      return (
                        <div key={i} className="flex flex-col items-center relative z-10 w-24">
                          <div className="relative">
                            {/* Ripple Animation for Current Step */}
                            {isCurrent && (
                              <div className="absolute inset-0 pointer-events-none">
                                {[0, 1, 2].map((i) => (
                                  <motion.div 
                                    key={i}
                                    animate={{ 
                                      scale: [1, 2], 
                                      opacity: [0.15, 0] 
                                    }}
                                    transition={{ 
                                      duration: 4.5, 
                                      repeat: Infinity, 
                                      delay: i * 1.5,
                                      ease: "easeOut" 
                                    }}
                                    className="absolute inset-0 bg-[#006837] rounded-full"
                                  />
                                ))}
                              </div>
                            )}
                            
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 ${
                              isCompleted ? 'bg-[#006837] text-white' : 
                              isCurrent ? 'bg-[#006837] ring-4 ring-[#006837]/10 text-white' : 
                              'bg-white border-4 border-gray-100 text-gray-300'
                            }`}>
                              {isCompleted ? <CheckCircle2 size={18} /> : <step.icon size={18} />}
                            </div>
                          </div>
                          
                          <div className="absolute top-14 flex flex-col items-center gap-1">
                            <span className={`whitespace-nowrap text-[10px] font-black uppercase tracking-wider transition-colors duration-500 ${
                              isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-300'
                            }`}>
                              {step.label}
                            </span>
                            {time && (
                              <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap">
                                {time}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Vertical Layout */}
                  <div className="md:hidden flex flex-col gap-12 relative">
                    {STEPS.map((step, i) => {
                      const stepNum = i + 1;
                      const isCompleted = statusInfo!.step > stepNum;
                      const isCurrent = statusInfo!.step === stepNum;
                      const time = getStepTime(stepNum);
                      const Icon = step.icon;

                      return (
                        <div key={i} className="flex gap-6 items-start relative">
                          {/* Vertical Line Segment - ONLY if not last step */}
                          {i < STEPS.length - 1 && (
                            <div className={`absolute left-[19px] top-10 w-1 h-12 -mb-2 ${isCompleted ? 'bg-[#006837]' : 'bg-gray-100'} transition-colors duration-500`} />
                          )}

                          <div className="relative shrink-0 z-10">
                            {/* Ripple Animation for Current Step */}
                            {isCurrent && (
                              <div className="absolute inset-0 pointer-events-none">
                                {[0, 1, 2].map((i) => (
                                  <motion.div 
                                    key={i}
                                    animate={{ 
                                      scale: [1, 2], 
                                      opacity: [0.15, 0] 
                                    }}
                                    transition={{ 
                                      duration: 4.5, 
                                      repeat: Infinity, 
                                      delay: i * 1.5,
                                      ease: "easeOut" 
                                    }}
                                    className="absolute inset-0 bg-[#006837] rounded-full"
                                  />
                                ))}
                              </div>
                            )}
                            
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 ${
                              isCompleted || isCurrent ? 'bg-[#006837] text-white shadow-lg shadow-[#006837]/20 scale-110' : 
                              'bg-white border-4 border-gray-100 text-gray-300'
                            }`}>
                              {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                            </div>
                          </div>

                          <div className={`flex flex-col pt-1 transition-all duration-500 ${isCompleted || isCurrent ? 'opacity-100' : 'opacity-40'}`}>
                            <span className="text-[12px] font-black uppercase tracking-widest text-gray-900">
                              {step.label}
                            </span>
                            {time ? (
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400">
                                  {time}
                                </span>
                                {isCurrent && step.label !== 'Delivered' && (
                                  <span className="text-[9px] font-bold text-[#006837] flex items-center gap-1 mt-0.5">
                                    <span className="w-1 h-1 rounded-full bg-[#006837] animate-pulse" />
                                    In Progress
                                  </span>
                                )}
                              </div>
                            ) : isCurrent && step.label !== 'Delivered' ? (
                              <span className="text-[10px] font-bold text-[#006837] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#006837] animate-pulse" />
                                Processing...
                              </span>
                            ) : (
                                <span className="text-[10px] font-bold text-gray-300">
                                  {stepNum <= (statusInfo?.step || 0) ? 'Completed' : 'Pending'}
                                </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Summary */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-gray-100 space-y-6">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <Calendar className="text-[#006837]" size={20} />
                    Order Summary
                  </h3>
                  
                  <div className="space-y-5">
                    {/* ID and Date Row */}
                    <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                        <p className="font-black text-gray-900">#{order.order_number}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Placed On</p>
                        <p className="font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="flex flex-wrap gap-x-6 gap-y-6 pt-1 border-b border-gray-50 pb-8">
                      <div className="flex items-start gap-3 min-w-[140px] flex-1">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400 shrink-0">
                          <User size={14} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</p>
                          <p className="text-[14px] font-bold text-gray-900">{order.customer_name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 min-w-[140px] flex-1 border-gray-50 sm:border-x sm:px-6">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400 shrink-0">
                          <Phone size={14} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</p>
                          <p className="text-[14px] font-bold text-gray-900">{order.customer_phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 min-w-[200px] flex-[2]">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400 shrink-0">
                          <MapPin size={14} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                          <p className="text-[13px] font-medium text-gray-600 leading-relaxed">{order.customer_address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                      <p className="text-[15px] font-bold text-gray-500">Total Amount</p>
                      <p className="text-2xl font-black text-gray-900">Rs. {parseFloat(order.total_amount).toFixed(2)}</p>
                    </div>

                    <a 
                      href={`https://wa.me/918157858977?text=${encodeURIComponent(`Hi, I want to check my order #${order.order_number}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-[14px] hover:bg-black transition-all flex items-center justify-center gap-2 group"
                    >
                      <MessageSquare size={18} />
                      Contact on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Right: Items */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/5 border border-gray-100 space-y-6">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <Package className="text-[#006837]" size={20} />
                    Items Ordered
                  </h3>
                  
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="flex-1">
                          <p className="text-[14px] font-black text-gray-900 line-clamp-1">{item.product_name}</p>
                          <p className="text-[12px] font-bold text-gray-500">{item.variant_name} × {item.quantity}</p>
                        </div>
                        <p className="text-[14px] font-black text-gray-900">Rs. {parseFloat(item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center"><Loader2 className="animate-spin text-[#006837]" /></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
