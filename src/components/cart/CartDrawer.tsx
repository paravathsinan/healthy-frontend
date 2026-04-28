"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose 
} from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import { sendWhatsAppCartOrder } from "@/lib/whatsapp";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/api";

export function CartDrawer({ showOnlyIcon = false }: { showOnlyIcon?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    phone: ""
  });
  const { items, removeItem, updateQuantity, totalPrice, isCartOpen, openCart, closeCart } = useCartStore();
  const total = totalPrice();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="bg-[#006837] text-white px-8 py-3.5 rounded-full flex items-center gap-4 opacity-0">
        <ShoppingBag className="h-5 w-5" />
        {!showOnlyIcon && <span className="text-base font-bold">Rs. 0.00 INR (0)</span>}
      </button>
    );
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
      <SheetTrigger asChild>
        <button 
          onClick={openCart}
          className={`rounded-full flex items-center justify-center transition-all shrink-0 relative ${
            showOnlyIcon 
              ? "w-12 h-12 p-0 bg-transparent text-[#006837]" 
              : "bg-[#006837] text-white px-8 py-3.5 gap-4 shadow-lg shadow-black/5 hover:bg-[#004d29]"
          }`}
        >
          <div className="relative">
            <ShoppingBag className={showOnlyIcon ? "h-6 w-6" : "h-5 w-5"} />
            {showOnlyIcon && items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {items.length}
              </span>
            )}
          </div>
          {!showOnlyIcon && (
            <span className="text-base font-bold">Rs. {total.toFixed(2)} INR ({items.length})</span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md border-none p-0 bg-white flex flex-col h-full shadow-2xl"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="px-8 py-6 border-b border-gray-100 flex flex-row items-center justify-between flex-shrink-0">
          <SheetTitle className="text-[20px] font-medium text-gray-900">
            Shopping Cart ({items.length})
          </SheetTitle>
          <SheetClose className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <X className="h-6 w-6 text-gray-900" />
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-start px-8 pt-12 space-y-8 overflow-y-auto">
              <p className="text-[17px] text-gray-900">Your cart is currently empty.</p>
              <SheetClose asChild>
                <Link href="/products" className="w-full max-w-[320px]">
                  <button className="w-full bg-[#1A1A1A] text-white py-4 rounded-full font-bold text-[17px] hover:bg-black transition-all">
                    Continue browsing
                  </button>
                </Link>
              </SheetClose>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Scrollable Area (Items + Form) */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-12">
                {/* Product Items */}
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-6 items-start">
                      <div className="relative h-24 w-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        {item.image && (
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill 
                            sizes="96px"
                            className="object-contain p-2" 
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 text-[16px] leading-tight">{item.name}</h4>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="text-[14px] text-gray-700 font-medium">{item.weight}</p>
                        <div className="flex items-center justify-between pt-3">
                          <div className="flex items-center border border-gray-900 rounded-full p-1 min-w-[110px] justify-between">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Minus className="h-4 w-4 text-gray-900" />
                            </button>
                            <span className="text-[15px] font-bold text-gray-900 px-1">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Plus className="h-4 w-4 text-gray-900" />
                            </button>
                          </div>
                          <span className="text-[17px] font-bold text-gray-900">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Details Form */}
                <div className="pt-8 border-t border-gray-100 space-y-6 pb-4">
                  <h3 className="text-[18px] font-bold text-gray-900">Delivery Details</h3>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        value={customerDetails.name}
                        onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">WhatsApp Number</label>
                      <input 
                        type="tel" 
                        value={customerDetails.phone}
                        onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                        placeholder="Enter your WhatsApp number"
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Delivery Address</label>
                      <textarea 
                        value={customerDetails.address}
                        onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                        placeholder="Enter your full delivery address"
                        rows={3}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900 placeholder:text-gray-400 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Bottom Section */}
              <div className="p-8 bg-white border-t border-gray-100 space-y-6 shadow-[0_-20px_30px_rgba(0,0,0,0.03)] flex-shrink-0">
                <div className="flex justify-between items-center">
                  <span className="text-[17px] text-gray-600">Subtotal</span>
                  <span className="text-[22px] font-bold text-gray-900">Rs. {total.toFixed(2)} INR</span>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    loading={isOrdering}
                    className="w-full bg-black text-white py-4 rounded-full font-bold text-[16px] hover:bg-gray-800 transition-all shadow-xl active:scale-95 h-auto"
                    onClick={async () => {
                      if (!customerDetails.name || !customerDetails.address || !customerDetails.phone) {
                        alert("Please fill in your Name, WhatsApp number, and Delivery Address before placing the order.");
                        return;
                      }
                      setIsOrdering(true);
                      try {
                        // 1. Save to Database
                        const orderData = {
                          customer_name: customerDetails.name,
                          customer_phone: customerDetails.phone,
                          customer_address: customerDetails.address,
                          total_amount: total,
                          items: items.map(item => ({
                            product: item.productId || null,
                            variant: item.variantId || null,
                            product_name: item.name,
                            variant_name: item.weight,
                            quantity: item.quantity,
                            price: item.price
                          }))
                        };
                        
                        await createOrder(orderData);
                        
                        // 2. Redirect to WhatsApp
                        sendWhatsAppCartOrder(items, total, customerDetails);
                      } catch (error) {
                        console.error("Order creation failed:", error);
                        alert("Something went wrong while placing your order. Please try again.");
                      } finally {
                        setIsOrdering(false);
                      }
                    }}
                  >
                    Place Order Via WhatsApp
                  </Button>
                  <p className="text-[11px] text-center text-gray-400">
                    You will be redirected to WhatsApp to confirm your details.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
