import { create } from "zustand";
import type { Service, Customer } from "../../../types";

export interface CartItem {
  id: string;
  serviceId: number;
  serviceName: string;
  unit: "kg" | "item" | "flat";
  quantity: number | null;
  weight_kg: number | null;
  unit_price: number;
  line_total: number;
}

interface TransactionState {
  customer: Customer | null;
  cart: CartItem[];
  discount: number;
  taxRate: number;
  pickupDate: string | null;
  deliveryDate: string | null;
  setCustomer: (c: Customer | null) => void;
  addItem: (service: Service) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  setDiscount: (amount: number) => void;
  setTaxRate: (rate: number) => void;
  setPickupDate: (date: string | null) => void;
  setDeliveryDate: (date: string | null) => void;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
  clearTransaction: () => void;
}

export const useTransactionEngine = create<TransactionState>((set, get) => ({
  customer: null,
  cart: [],
  discount: 0,
  taxRate: 0.16,
  pickupDate: null,
  deliveryDate: null,

  setCustomer: (customer) => set({ customer }),

  addItem: (service) =>
    set((state) => {
      const existingIndex = state.cart.findIndex((i) => i.serviceId === service.id);
      if (existingIndex > -1) {
        const updated = [...state.cart];
        const item = updated[existingIndex];
        const increment = service.unit === "kg" ? 0.5 : 1;
        if (service.unit === "kg") {
          item.weight_kg = (item.weight_kg || 0) + increment;
        } else {
          item.quantity = (item.quantity || 0) + increment;
        }
        item.line_total = ((item.weight_kg || 0) + (item.quantity || 0)) * item.unit_price;
        return { cart: updated };
      }
      const initialValue = service.unit === "kg" ? 2.5 : 1;
      return {
        cart: [
          ...state.cart,
          {
            id: `cart-${Date.now()}-${service.id}`,
            serviceId: service.id,
            serviceName: service.name,
            unit: service.unit,
            quantity: service.unit === "item" || service.unit === "flat" ? initialValue : null,
            weight_kg: service.unit === "kg" ? initialValue : null,
            unit_price: service.price,
            line_total: initialValue * service.price,
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
          ? {
              ...item,
              quantity: item.unit !== "kg" ? qty : item.quantity,
              weight_kg: item.unit === "kg" ? qty : item.weight_kg,
              line_total: qty * item.unit_price,
            }
          : item
      ),
    })),

  setDiscount: (amount) => set({ discount: amount }),
  setTaxRate: (rate) => set({ taxRate: rate }),
  setPickupDate: (date) => set({ pickupDate: date }),
  setDeliveryDate: (date) => set({ deliveryDate: date }),

  calculateSubtotal: () =>
    get().cart.reduce((sum, i) => sum + i.line_total, 0),

  calculateTotal: () => {
    const subtotal = get().calculateSubtotal();
    const withDiscount = subtotal - get().discount;
    const tax = withDiscount * get().taxRate;
    return Math.max(0, withDiscount + tax);
  },

  clearTransaction: () => set({ customer: null, cart: [], discount: 0, pickupDate: null, deliveryDate: null }),
}));
