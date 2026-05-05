import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createOrder as apiCreateOrder } from '@/lib/api';

export interface CartItem {
  id: string; // unique string for variant
  productId?: number;
  variantId?: number;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  customerDetails: CustomerDetails;
  preferredSnapPoint: number;
  cartType: 'drawer' | 'sheet';
  addItem: (item: CartItem, openFull?: boolean) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  openCart: (snap?: number, type?: 'drawer' | 'sheet') => void;
  closeCart: () => void;
  setPreferredSnapPoint: (snap: number) => void;
  setCustomerDetails: (details: Partial<CustomerDetails>) => void;
  createOrder: (orderData: any) => Promise<any>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      preferredSnapPoint: 0.6,
      cartType: 'drawer',
      customerDetails: {
        name: '',
        phone: '',
        address: '',
      },
      openCart: (snap = 0.6, type = 'drawer') => set({ 
        isCartOpen: true, 
        preferredSnapPoint: snap,
        cartType: type 
      }),
      closeCart: () => set({ isCartOpen: false }),
      setPreferredSnapPoint: (snap) => set({ preferredSnapPoint: snap }),
      setCustomerDetails: (details) => set({ 
        customerDetails: { ...get().customerDetails, ...details } 
      }),
      addItem: (item, openFull = false) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          // Move existing item to top and update quantity
          set({
            items: [
              { ...existing, quantity: existing.quantity + item.quantity },
              ...get().items.filter((i) => i.id !== item.id)
            ],
          });
        } else {
          // Prepend new item
          set({ items: [item, ...get().items] });
        }
        set({ 
          isCartOpen: true, 
          preferredSnapPoint: openFull ? 1 : 0.6,
          cartType: 'drawer' // Adding items always uses the drawer
        });
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ 
        items: [],
        customerDetails: {
          name: '',
          phone: '',
          address: '',
        }
      }),
      totalPrice: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
      createOrder: async (orderData) => {
        const response = await apiCreateOrder(orderData);
        // Clear cart after successful order creation
        get().clearCart();
        return response;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        customerDetails: state.customerDetails 
      }),
    }
  )
);
