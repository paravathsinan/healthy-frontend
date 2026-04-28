import { useState } from "react";
import { X, Package, MapPin, Phone, User, Calendar, MessageCircle, CheckCircle2, Clock, AlertCircle, Truck, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const statuses = [
  { id: 'PENDING', label: 'Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { id: 'CONTACTED', label: 'Contacted', icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { id: 'AWAITING_PAY', label: 'Awaiting Payment', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  { id: 'PAID', label: 'Paid', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { id: 'SHIPPED', label: 'Shipped', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { id: 'COMPLETED', label: 'Completed', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
  { id: 'CANCELLED', label: 'Cancelled', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
];

export function OrderDetailsModal({ order, isOpen, onClose, onUpdate }: OrderDetailsModalProps) {
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const handleUpdateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      await api.patch(`/orders/${order.id}/`, { status: newStatus });
      toast.success(`Order marked as ${newStatus.toLowerCase()}`);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-gray-900 font-heading">Order Details</h2>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statuses.find(s => s.id === order.status)?.bg} ${statuses.find(s => s.id === order.status)?.color} ${statuses.find(s => s.id === order.status)?.border}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">ORD-{order.id} • {new Date(order.created_at).toLocaleString()}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                <X size={24} className="text-gray-900" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Status Update Strip */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Update Order Status</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => {
                    const Icon = status.icon;
                    const isActive = order.status === status.id;
                    return (
                      <button
                        key={status.id}
                        disabled={loading || isActive}
                        onClick={() => handleUpdateStatus(status.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${
                          isActive 
                            ? `${status.bg} ${status.color} ${status.border} ring-2 ring-offset-1 ring-gray-100 shadow-sm` 
                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                        } disabled:opacity-50`}
                      >
                        <Icon size={14} />
                        {status.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-50">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <User size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Customer</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{order.customer_name}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Phone size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">WhatsApp</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{order.customer_phone}</p>
                </div>
                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center gap-3 text-gray-400">
                    <MapPin size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Delivery Address</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                    {order.customer_address}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4 pt-8 border-t border-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Package size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Items Ordered</span>
                  </div>
                  <span className="text-[10px] font-black text-[#006837] bg-[#006837]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    {order.items?.length || 0} Products
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="space-y-1">
                        <p className="font-bold text-gray-900">{item.product_name}</p>
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">{item.variant_name} • Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-black text-gray-900 tracking-tight">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer / Total */}
            <div className="p-5 md:p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#006837] shadow-sm shrink-0">
                  <MessageCircle size={24} className="md:size-[28px]" />
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Amount</p>
                  <p className="text-2xl md:text-3xl font-black text-gray-900 font-heading tracking-tighter">₹{order.total_amount}</p>
                </div>
              </div>
              <button 
                onClick={() => window.open(`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}`, '_blank')}
                className="bg-[#006837] text-white px-6 md:px-10 py-3.5 md:py-4 rounded-2xl md:rounded-full text-xs md:text-sm font-bold hover:bg-black transition-all shadow-lg shadow-[#006837]/20 flex items-center justify-center gap-3 active:scale-95"
              >
                <Phone size={16} className="md:size-[18px]" />
                Follow up via WhatsApp
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
