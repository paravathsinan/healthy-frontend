"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  ClipboardList, Search, Filter, MessageCircle, ArrowRight, User, 
  MapPin, Calendar, Loader2, ChevronLeft, ChevronRight, Eye,
  Clock, Phone, CreditCard, CheckCircle2, Truck, AlertCircle, CheckCircle, X
} from "lucide-react";

import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminWhatsAppLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 50;

  // New Filter States
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [minAmountFilter, setMinAmountFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchOrders = async (page: number, search: string, status: string, dateRange: string, minAmount: string) => {
    setLoading(true);
    try {
      const params: any = {
        page: page,
        search: search,
        page_size: itemsPerPage
      };

      if (status !== "all") params.status = status;
      if (minAmount !== "all") params.min_amount = minAmount;
      
      // Date Range Logic
      if (dateRange !== "all") {
        const now = new Date();
        let startDate = new Date();
        if (dateRange === "today") {
          startDate.setHours(0, 0, 0, 0);
        } else if (dateRange === "yesterday") {
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date();
          endDate.setDate(endDate.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);
          params.end_date = endDate.toISOString();
        } else if (dateRange === "7days") {
          startDate.setDate(startDate.getDate() - 7);
        } else if (dateRange === "30days") {
          startDate.setDate(startDate.getDate() - 30);
        }
        params.start_date = startDate.toISOString();
      }

      const response = await api.get('/orders/', { params });
      setLogs(response.data.results);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchOrders(currentPage, debouncedSearch, statusFilter, dateFilter, minAmountFilter);
  }, [currentPage, debouncedSearch, statusFilter, dateFilter, minAmountFilter]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const clearFilters = () => {
    setStatusFilter("all");
    setDateFilter("all");
    setMinAmountFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
    setIsCustomAmount(false);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight font-heading">
              WhatsApp Logs
            </h1>
            {!loading && (
              <Badge className="bg-[#006837]/10 text-[#006837] hover:bg-[#006837]/20 border-none px-3 py-1 rounded-full text-[12px] font-black">
                Total Orders: {totalCount}
              </Badge>
            )}
          </div>
          <p className="text-[13px] text-gray-500 font-medium">Track customer intent from website to WhatsApp.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-[13px] font-medium text-gray-900 focus:outline-none focus:border-[#006837] w-full sm:w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-full h-9 text-[13px] font-black gap-2 transition-all duration-200 pl-6 pr-6 relative ${
                showFilters 
                  ? "bg-transparent text-[#006837] border-[#006837] hover:bg-[#006837]/5" 
                  : "bg-[#006837] text-white border-[#006837] hover:bg-[#005a2f]"
              } ${
                (statusFilter !== "all" || dateFilter !== "all" || minAmountFilter !== "all" || searchQuery !== "")
                  ? "pr-10"
                  : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Filter className={`h-4 w-4 ${showFilters ? "text-[#006837]" : "text-white"}`} />
                <span>Filters</span>
              </div>
              
              {(statusFilter !== "all" || dateFilter !== "all" || minAmountFilter !== "all" || searchQuery !== "") && (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFilters();
                  }}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 transition-colors ${
                    showFilters ? "text-black" : "text-white/80 hover:text-white"
                  }`}
                >
                  <X className="h-3 w-3" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Smooth Filter Toolbar Animation */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          showFilters ? "grid-rows-[1fr] opacity-100 mb-6" : "grid-rows-[0fr] opacity-0 mb-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-8 px-2 py-4 bg-gray-50/30 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Status</span>
              <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className={`w-[180px] h-10 rounded-xl text-[12px] font-bold bg-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200 text-gray-600 ${
                  statusFilter !== "all" 
                    ? "border-[#006837]" 
                    : "border-gray-200"
                } data-[state=open]:border-[#006837]`}>
                  <div className="flex items-center gap-2">
                    <SelectValue placeholder="All Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 bg-white shadow-xl z-[100] min-w-[200px]">
                  <SelectItem value="all" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-3.5 w-3.5 text-gray-400" />
                      <span>All Status</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="PENDING" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span>Pending</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CONTACTED" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      <span>Contacted</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="AWAITING_PAY" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                      <span>Awaiting Pay</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="PAID" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />
                      <span>Paid</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="SHIPPED" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-gray-400" />
                      <span>Shipped</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="COMPLETED" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-gray-400" />
                      <span>Completed</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CANCELLED" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                      <span>Cancelled</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Date</span>
              <Select value={dateFilter} onValueChange={(val) => { setDateFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className={`w-[160px] h-10 rounded-xl text-[12px] font-bold bg-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200 text-gray-600 ${
                  dateFilter !== "all" 
                    ? "border-[#006837]" 
                    : "border-gray-200"
                } data-[state=open]:border-[#006837]`}>
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 bg-white shadow-xl z-[100]">
                  <SelectItem value="all" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">All Time</SelectItem>
                  <SelectItem value="today" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">Today</SelectItem>
                  <SelectItem value="yesterday" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">Yesterday</SelectItem>
                  <SelectItem value="7days" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">Last 7 Days</SelectItem>
                  <SelectItem value="30days" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Value</span>
              {!isCustomAmount ? (
                <Select 
                  value={minAmountFilter} 
                  onValueChange={(val) => { 
                    if (val === "custom") {
                      setIsCustomAmount(true);
                    } else {
                      setMinAmountFilter(val); 
                      setCurrentPage(1); 
                    }
                  }}
                >
                  <SelectTrigger 
                    className={`w-[160px] h-10 rounded-xl text-[12px] font-bold bg-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-200 text-gray-600 ${
                      minAmountFilter !== "all" 
                        ? "border-[#006837]" 
                        : "border-gray-200"
                    } data-[state=open]:border-[#006837]`}
                  >
                    <SelectValue placeholder="Any Value" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 bg-white shadow-xl z-[100]">
                    <SelectItem value="all" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">Any Value</SelectItem>
                    <SelectItem value="500" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">₹500+</SelectItem>
                    <SelectItem value="1000" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">₹1000+</SelectItem>
                    <SelectItem value="5000" className="text-[12px] font-bold text-gray-600 focus:bg-gray-50">₹5000+</SelectItem>
                    <SelectItem value="custom" className="text-[12px] font-bold text-[#006837] border-t mt-1 focus:bg-green-50">Custom Amount...</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    autoFocus
                    placeholder="Price"
                    value={minAmountFilter === "all" ? "" : minAmountFilter}
                    onChange={(e) => {
                      setMinAmountFilter(e.target.value || "all");
                      setCurrentPage(1);
                    }}
                    onBlur={() => {
                      if (minAmountFilter === "all" || minAmountFilter === "") {
                        setIsCustomAmount(false);
                      }
                    }}
                    className="w-[160px] h-10 rounded-xl pl-8 pr-4 text-[12px] font-bold border-[#006837] bg-white text-gray-600 focus:outline-none focus:ring-0"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400">Rs.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 text-[#006837] animate-spin" />
            <p className="text-sm text-gray-500 font-medium tracking-wide">Loading logs...</p>
          </div>
        ) : logs.length > 0 ? (
          <>
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400">Order ID</TableHead>
                  <TableHead className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400">Customer</TableHead>
                  <TableHead className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400">Contact</TableHead>
                  <TableHead className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400">Items</TableHead>
                  <TableHead className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400">Date</TableHead>
                  <TableHead className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400">Value</TableHead>
                  <TableHead className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow 
                    key={log.id} 
                    className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => handleShowDetails(log)}
                  >
                    <TableCell className="text-center py-4">
                      <div className="flex flex-col items-center">
                        <span className="text-[13px] font-bold text-[#006837] group-hover:underline">ORD-{log.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <span className="text-[13px] font-black text-gray-900">{log.customer_name}</span>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <span className="text-[12px] font-medium text-gray-500">{log.customer_phone}</span>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-gray-200 text-gray-500 px-1.5 py-0">
                        {log.items?.length || 0} Items
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <span className="text-[12px] font-medium text-gray-500">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <span className="text-[13px] font-black text-gray-900">₹{log.total_amount}</span>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Badge className={`${getStatusColor(log.status)} text-[10px] font-black px-2 py-0.5 rounded-md border shadow-none`}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-50 bg-white">
              <p className="text-[12px] text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of <span className="font-bold text-gray-900">{totalCount}</span> orders
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="rounded-xl h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 rounded-xl text-[12px] p-0 ${
                      currentPage === pageNum ? "bg-[#006837] hover:bg-[#005a2f]" : ""
                    }`}
                  >
                    {pageNum}
                  </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="rounded-xl h-8 px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <ClipboardList className="h-12 w-12 text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium">No orders found matching your filters.</p>
            {(statusFilter !== "all" || dateFilter !== "all" || minAmountFilter !== "all" || searchQuery !== "") && (
              <Button 
                variant="link" 
                onClick={clearFilters}
                className="text-[#006837] font-bold text-sm mt-2"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      <OrderDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdate={() => fetchOrders(currentPage, debouncedSearch, statusFilter, dateFilter, minAmountFilter)}
      />
    </div>
  );
}
