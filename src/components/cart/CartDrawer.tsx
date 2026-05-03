"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { 
  Sheet, SheetContent, SheetTrigger, SheetClose, SheetDescription 
} from "@/components/ui/sheet";
import { Drawer } from "vaul";
import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import { sendWhatsAppCartOrder } from "@/lib/whatsapp";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/api";

export function CartDrawer({ showOnlyIcon = false }: { showOnlyIcon?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSnap, setActiveSnap] = useState<number | string | null>(0.6);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    phone: ""
  });
  
  const { items, removeItem, updateQuantity, totalPrice, isCartOpen, openCart, closeCart } = useCartStore();
  const total = typeof totalPrice === 'function' ? totalPrice() : 0;

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) {
    return (
      <button className={`rounded-full flex items-center justify-center transition-all shrink-0 ${showOnlyIcon ? "w-12 h-12 text-[#006837]" : "bg-[#006837] text-white px-8 py-3.5 gap-4"}`}>
        <ShoppingBag className={showOnlyIcon ? "h-6 w-6" : "h-5 w-5"} />
        {!showOnlyIcon && <span className="text-base font-bold">Rs. 0.00</span>}
      </button>
    );
  }

  const CartContent = ({ heightClass }: { heightClass: string }) => (
    <div className={`flex flex-col ${heightClass} bg-white overflow-hidden`}>
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
        <h3 className="text-[20px] font-medium text-gray-900 leading-none">
          Shopping Cart ({items.length})
        </h3>
        {!isMobile && (
          <SheetClose className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <X className="h-6 w-6 text-gray-900" />
          </SheetClose>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {items.length === 0 ? (
          <div className="px-8 pt-12 space-y-8 flex-1">
            <p className="text-[17px] text-gray-900">Your cart is currently empty.</p>
            <Link href="/products" className="w-full max-w-[320px]" onClick={closeCart}>
              <button className="w-full bg-[#1A1A1A] text-white py-4 rounded-full font-bold text-[17px]">
                Continue browsing
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-12 pb-20">
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 items-start">
                    <div className="relative h-24 w-24 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                      {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          sizes="96px" 
                          className="object-contain p-2 transition-transform hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                          <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 text-[16px] leading-tight">{item.name}</h4>
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-[14px] text-gray-600 font-medium">{item.weight}</p>
                      <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center border border-gray-300 rounded-full p-1 min-w-[110px] justify-between">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Minus className="h-4 w-4 text-gray-900" />
                          </button>
                          <span className="text-[15px] font-black text-gray-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Plus className="h-4 w-4 text-gray-900" />
                          </button>
                        </div>
                        <span className="text-[17px] font-black text-gray-900">Rs. {(item.price * item.quantity).toFixed(2)}</span>
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
                    <input type="text" value={customerDetails.name} onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})} placeholder="Enter your name" className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-700 uppercase">WhatsApp Number</label>
                    <input type="tel" value={customerDetails.phone} onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})} placeholder="Enter your WhatsApp number" className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-gray-700 uppercase">Delivery Address</label>
                    <textarea value={customerDetails.address} onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})} placeholder="Enter your full address" rows={3} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl resize-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 pb-10 bg-white border-t border-gray-100 space-y-5 shadow-[0_-20px_30px_rgba(0,0,0,0.02)] shrink-0">
              <div className="flex justify-between items-center px-1">
                <span className="text-[15px] text-gray-500 font-medium">Subtotal</span>
                <span className="text-[20px] font-bold text-gray-900">Rs. {total.toFixed(2)} INR</span>
              </div>
              <Button 
                loading={isOrdering} 
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-4 rounded-2xl font-bold h-auto text-[16px] shadow-lg active:scale-[0.98] transition-all"
                onClick={async () => {
                  if (!customerDetails.name || !customerDetails.address || !customerDetails.phone) {
                    alert("Please fill in your details.");
                    return;
                  }
                  setIsOrdering(true);
                  try {
                    await createOrder({
                      customer_name: customerDetails.name,
                      customer_phone: customerDetails.phone,
                      customer_address: customerDetails.address,
                      total_amount: total,
                      items: items.map(item => ({
                        product: item.productId,
                        variant: item.variantId,
                        product_name: item.name,
                        variant_name: item.weight,
                        quantity: item.quantity,
                        price: item.price
                      }))
                    });
                    sendWhatsAppCartOrder(items, total, customerDetails);
                  } catch (e) { alert("Failed to place order."); }
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

  const Trigger = (
    <button 
      onClick={openCart}
      className={`rounded-full flex items-center justify-center transition-all shrink-0 relative ${showOnlyIcon ? "w-12 h-12 p-0 text-[#006837]" : "bg-[#006837] text-white px-8 py-3.5 gap-4 shadow-lg hover:bg-[#004d29]"}`}
    >
      <div className="relative">
        <ShoppingBag className={showOnlyIcon ? "h-6 w-6" : "h-5 w-5"} />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {items.length}
          </span>
        )}
      </div>
      {!showOnlyIcon && <span className="text-base font-bold">Rs. {total.toFixed(2)} INR ({items.length})</span>}
    </button>
  );

  if (isMobile) {
    const DrawerRoot = Drawer.Root as any;
    return (
      <DrawerRoot 
        open={isCartOpen} 
        onOpenChange={(open: boolean) => open ? openCart() : closeCart()}
        shouldScaleBackground
        snapPoints={[0.6, 1]}
        activeSnapPoint={activeSnap}
        onSnapPointChange={setActiveSnap}
      >
        <Drawer.Trigger asChild>{Trigger}</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] fixed bottom-0 left-0 right-0 z-[101] outline-none shadow-2xl h-full">
            <Drawer.Title className="sr-only">Shopping Cart</Drawer.Title>
            <Drawer.Description className="sr-only">Review your items and complete your order.</Drawer.Description>
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-200 my-4" />
            <div className="flex-1 overflow-hidden">
              <CartContent heightClass={activeSnap === 0.6 ? "h-[58vh]" : "h-[calc(100vh-40px)]"} />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </DrawerRoot>
    );
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
      <SheetTrigger asChild>{Trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md border-none p-0 bg-white flex flex-col h-full shadow-2xl overflow-hidden">
        <SheetDescription className="sr-only">Manage your cart</SheetDescription>
        <CartContent heightClass="h-full" />
      </SheetContent>
    </Sheet>
  );
}
