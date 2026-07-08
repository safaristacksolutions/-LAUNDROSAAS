import { create } from "zustand";
import type { Service, Customer } from "../../../types";

export interface CartItem {
  id: string;
  serviceId: number;
  serviceName: string;
  serviceIcon: string;
  unit: "kg" | "item";
  weightOrQty: number;
  ratePerUnit: number;
  lineTotal: number;
}

interface TransactionState {
  customer: Customer | null;
  cart: CartItem[];
  discount: number;
  taxRate: number;
  setCustomer: (c: Customer | null) => void;
  addItem: (service: Service) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  setDiscount: (amount: number) => void;
  setTaxRate: (rate: number) => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
  clearTransaction: () => void;
}

export const useTransactionEngine = create<TransactionState>((set, get) => ({
  customer: null,
  cart: [],
  discount: 0,
  taxRate: 0.16,

  setCustomer: (customer) => set({ customer }),

  addItem: (service) =>
    set((state) => {
      const existingIndex = state.cart.findIndex((i) => i.serviceId === service.id);
      if (existingIndex > -1) {
        const updated = [...state.cart];
        const item = updated[existingIndex];
        const increment = service.unit === "kg" ? 0.5 : 1;
        item.weightOrQty += increment;
        item.lineTotal = item.weightOrQty * item.ratePerUnit;
        return { cart: updated };
      }
      const initialQty = service.unit === "kg" ? 2.5 : 1;
      return {
        cart: [
          ...state.cart,
          {
            id: `cart-${Date.now()}-${service.id}`,
            serviceId: service.id,
            serviceName: service.name,
            serviceIcon: service.icon,
            unit: service.unit,
            weightOrQty: initialQty,
            ratePerUnit: Number(service.price_kes),
            lineTotal: initialQty * Number(service.price_kes),
          },
        ],
      };
    }),

  removeItem: (id) =>
    set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),

  updateQty: (id, qty) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id
          ? { ...item, weightOrQty: qty, lineTotal: qty * item.ratePerUnit }
          : item
      ),
    })),

  setDiscount: (amount) => set({ discount: amount }),
  setTaxRate: (rate) => set({ taxRate: rate }),

  calculateSubtotal: () =>
    get().cart.reduce((sum, i) => sum + i.lineTotal, 0),

  calculateTotal: () => {
    const subtotal = get().calculateSubtotal();
    const withDiscount = subtotal - get().discount;
    const tax = withDiscount * get().taxRate;
    return Math.max(0, withDiscount + tax);
  },

  clearTransaction: () => set({ customer: null, cart: [], discount: 0 }),
}));
