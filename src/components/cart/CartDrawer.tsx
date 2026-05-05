"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { 
  Sheet, SheetContent, SheetHeader, SheetTrigger, SheetClose, SheetDescription, SheetTitle
} from "@/components/ui/sheet";
import { Drawer } from "vaul";
import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import { sendWhatsAppCartOrder } from "@/lib/whatsapp";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/api";
import { toast } from "sonner";

/**
 * Shared Content for both Desktop and Mobile drawers
 */
function CartDrawerContent({ isSheet = false, activeSnap = 1, setActiveSnap = (val: any) => {} }: { isSheet?: boolean, activeSnap?: any, setActiveSnap?: any }) {
  const { items, removeItem, updateQuantity, totalPrice, customerDetails, setCustomerDetails, closeCart, clearCart } = useCartStore();
  const total = typeof totalPrice === 'function' ? totalPrice() : 0;
  const [isOrdering, setIsOrdering] = useState(false);
  const [snapBeforeKeyboard, setSnapBeforeKeyboard] = useState<any>(null);

  // When cart becomes empty (e.g. last item deleted), snap drawer to 60% height
  useEffect(() => {
    if (!isSheet && items.length === 0) {
      setActiveSnap(0.6);
    }
  }, [items.length, isSheet]);

  // Lock drawer at full height when mobile keyboard appears
  const handleInputFocus = () => {
    if (!isSheet) {
      setSnapBeforeKeyboard(activeSnap);
      setActiveSnap(1);
    }
  };

  const handleInputBlur = () => {
    if (!isSheet && snapBeforeKeyboard !== null) {
      setActiveSnap(snapBeforeKeyboard);
      setSnapBeforeKeyboard(null);
    }
  };

  return (
    <div className={`flex flex-col ${isSheet ? "h-full" : (items.length === 0 ? "min-h-[58vh]" : "h-full")} bg-white overflow-hidden w-full`}>
      <div className="px-6 md:px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
        <h3 className="text-[20px] font-black text-gray-900 leading-none">
          Shopping Cart ({items.length})
        </h3>
        {isSheet && (
          <SheetClose className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <X className="h-6 w-6 text-gray-900" />
          </SheetClose>
        )}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {items.length === 0 ? (
          <div className="px-6 md:px-8 pt-12 space-y-8 flex-1">
            <p className="text-[17px] text-gray-900 font-medium">Your cart is currently empty.</p>
            <Link href="/products" className="w-full max-w-[320px]" onClick={closeCart}>
              <button className="w-full bg-[#1A1A1A] text-white py-4 rounded-full font-bold text-[17px]">
                Continue browsing
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-12 touch-pan-y">
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 md:gap-6 items-start">
                    <div className="relative h-20 w-20 md:h-24 md:w-24 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill sizes="96px" className="object-contain p-2" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 text-[16px]">{item.name}</h4>
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-[14px] text-gray-600 font-medium">{item.weight}</p>
                      <div className="flex items-center justify-between pt-3 gap-2">
                        <div className="flex items-center border border-gray-300 rounded-full p-0.5 md:p-1 min-w-[90px] md:min-w-[110px] justify-between">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full">
                            <Minus className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-900" />
                          </button>
                          <span className="text-[14px] md:text-[15px] font-black text-gray-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full">
                            <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-900" />
                          </button>
                        </div>
                        <span className="text-[16px] md:text-[17px] font-black text-gray-900 whitespace-nowrap text-right">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-gray-100 space-y-6 pb-10">
                <h3 className="text-[18px] font-bold text-gray-900">Delivery Details</h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-700 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      value={customerDetails.name} 
                      onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})} 
                      placeholder="Enter your name" 
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-normal focus:bg-white focus:border-[#006837] outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-700 uppercase">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      value={customerDetails.phone} 
                      onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} 
                      placeholder="Enter your WhatsApp number" 
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-normal focus:bg-white focus:border-[#006837] outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-700 uppercase">Location</label>
                    <textarea 
                      value={customerDetails.address} 
                      onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})} 
                      placeholder="Enter your location" 
                      rows={3} 
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-normal focus:bg-white focus:border-[#006837] outline-none transition-all resize-none" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 md:px-6 py-6 pb-12 bg-white border-t border-gray-100 space-y-5 shadow-[0_-20px_30px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center px-1">
                <span className="text-[15px] text-gray-500 font-bold">Subtotal</span>
                <span className="text-[20px] font-black text-gray-900">Rs. {total.toFixed(2)} INR</span>
              </div>
              <Button 
                loading={isOrdering} 
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-4 rounded-2xl font-bold h-auto text-[16px]"
                onClick={async () => {
                  if (!customerDetails.name || !customerDetails.address || !customerDetails.phone) {
                    alert("Please fill in your details.");
                    return;
                  }
                  setIsOrdering(true);
                  try {
                    const response = await createOrder({
                      customer_name: customerDetails.name,
                      customer_phone: customerDetails.phone,
                      customer_address: customerDetails.address,
                      total_amount: parseFloat(total.toFixed(2)),
                      items: items.map(item => ({
                        product: item.productId,
                        variant: item.variantId,
                        product_name: item.name,
                        variant_name: item.weight,
                        quantity: item.quantity,
                        price: item.price
                      }))
                    });
                    sendWhatsAppCartOrder(items, total, customerDetails, response.order_number);
                    clearCart();
                  } catch (e: any) { 
                    console.error("Checkout Error:", e);
                    const errorData = e.response?.data;
                    let errorMessage = "Failed to place order. Please try again.";
                    
                    if (errorData) {
                      if (typeof errorData === 'object') {
                        errorMessage = Object.values(errorData).flat().join(", ");
                      } else {
                        errorMessage = String(errorData);
                      }
                    } else if (e.message) {
                      errorMessage = e.message;
                    }
                    
                    toast.error(errorMessage, {
                      duration: 5000,
                      className: "rounded-2xl font-bold border-red-100 bg-red-50 text-red-600"
                    });
                  }
                  finally { setIsOrdering(false); }
                }}
              >
                Place Order Via WhatsApp
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * CartTrigger - Lightweight button to open the cart
 */
export function CartDrawer({ showOnlyIcon = false, hideBadge = false }: { showOnlyIcon?: boolean, hideBadge?: boolean }) {
  const { items, totalPrice, openCart } = useCartStore();
  const total = typeof totalPrice === 'function' ? totalPrice() : 0;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button 
      type="button"
      onClick={() => openCart(1, 'sheet')}
      className={`rounded-full flex items-center justify-center transition-all shrink-0 relative ${showOnlyIcon ? "w-12 h-12 p-0 text-[#006837]" : "bg-[#006837] text-white px-8 py-3.5 gap-4 shadow-lg"}`}
    >
      <div className="relative">
        <ShoppingBag className={showOnlyIcon ? "h-8 w-8" : "h-5 w-5"} />
        {items.length > 0 && !hideBadge && (
          <span className="absolute -top-2.5 -right-2.5 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {items.length}
          </span>
        )}
      </div>
      {!showOnlyIcon && (
        <span className="text-base font-bold">
          Rs. {total.toFixed(2)} INR ({items.length})
        </span>
      )}
    </button>
  );
}

/**
 * GlobalCartSystem - Handles both Drawer (Mobile) and Sheet (Desktop/Mobile Sheet)
 */
export function GlobalMobileCart() {
  const { isCartOpen, openCart, closeCart, preferredSnapPoint, cartType, setPreferredSnapPoint } = useCartStore();
  const [activeSnap, setActiveSnap] = useState<number | string | null>(1);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { items } = useCartStore();

  useEffect(() => {
    if (isCartOpen && cartType === 'drawer') {
      // Use 60% height for empty cart, full height when there are items
      setActiveSnap(items.length === 0 ? 0.6 : 1);
    }
  }, [isCartOpen, cartType, items.length]);

  if (!mounted) return null;

  // On Desktop OR when cartType is 'sheet', we show the Sheet
  const showSheet = !isMobile || cartType === 'sheet';

  if (showSheet) {
    return (
      <Sheet open={isCartOpen} onOpenChange={(open) => open ? openCart(1, 'sheet') : closeCart()}>
        <SheetContent side="right" hideClose className="w-full sm:max-w-[540px] p-0 border-none bg-white z-[200]">
          <SheetHeader className="sr-only">
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>Review your items and complete your order.</SheetDescription>
          </SheetHeader>
          <CartDrawerContent isSheet />
        </SheetContent>
      </Sheet>
    );
  }

  // Mobile Drawer Logic
  const DrawerRoot = Drawer.Root as any;
  return (
    <DrawerRoot 
      open={isCartOpen} 
      onOpenChange={(open: boolean) => open ? openCart(1, 'drawer') : closeCart()}
      shouldScaleBackground={false}
      snapPoints={[0.6, 1]}
      activeSnapPoint={activeSnap}
      onSnapPointChange={setActiveSnap}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
        <Drawer.Content className={`bg-white flex flex-col rounded-t-[32px] fixed bottom-0 left-0 right-0 z-[101] outline-none shadow-2xl max-h-[96vh] ${items.length === 0 ? 'min-h-[60vh]' : ''}`}>
          <Drawer.Title className="sr-only">Shopping Cart</Drawer.Title>
          <Drawer.Description className="sr-only">Review your items and complete your order.</Drawer.Description>
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-200 my-4" />
          <div className="flex-1 overflow-hidden flex flex-col">
            <CartDrawerContent activeSnap={activeSnap} setActiveSnap={setActiveSnap} />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </DrawerRoot>
  );
}
