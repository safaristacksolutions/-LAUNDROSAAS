import { create } from "zustand";
import type { Customer, CartItem, Service } from "../types";
import { customers as customersApi, services as servicesApi } from "../api/endpoints";

interface POSState {
  // Customer
  searchQuery: string;
  searchResults: Customer[];
  selectedCustomer: Customer | null;
  isSearching: boolean;

  // Services & Cart
  availableServices: Service[];
  cart: CartItem[];
  cartTotal: number;
  vatTotal: number;
  grandTotal: number;

  // Actions
  setSearchQuery: (q: string) => void;
  searchCustomer: (phone: string) => Promise<void>;
  selectCustomer: (c: Customer | null) => void;
  loadServices: () => Promise<void>;
  addToCart: (service: Service) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  updateWeight: (index: number, weight: number) => void;
  clearCart: () => void;
  reset: () => void;
}

const VAT_RATE = 0.16;

export const usePOSStore = create<POSState>((set, get) => ({
  searchQuery: "",
  searchResults: [],
  selectedCustomer: null,
  isSearching: false,
  availableServices: [],
  cart: [],
  cartTotal: 0,
  vatTotal: 0,
  grandTotal: 0,

  setSearchQuery: (q) => set({ searchQuery: q }),

  searchCustomer: async (phone) => {
    if (phone.length < 3) {
      set({ searchResults: [] });
      return;
    }
    set({ isSearching: true });
    try {
      const { data } = await customersApi.search(phone);
      set({ searchResults: data });
    } finally {
      set({ isSearching: false });
    }
  },

  selectCustomer: (c) => set({ selectedCustomer: c, searchResults: [], searchQuery: "" }),

  loadServices: async () => {
    const { data } = await servicesApi.list();
    set({ availableServices: data });
  },

  addToCart: (service) => {
    const cart = [...get().cart];
    const existing = cart.findIndex(
      (item) => item.service.id === service.id
    );

    if (existing >= 0) {
      if (service.unit === "kg") {
        cart[existing].quantity_kg = (cart[existing].quantity_kg || 2.5) + 0.5;
        cart[existing].line_total = cart[existing].quantity_kg * Number(service.price_kes);
      } else {
        cart[existing].quantity_items = (cart[existing].quantity_items || 1) + 1;
        cart[existing].line_total = cart[existing].quantity_items * Number(service.price_kes);
      }
    } else {
      const qty = service.unit === "kg" ? 2.5 : 1;
      cart.push({
        service,
        quantity_kg: service.unit === "kg" ? qty : undefined,
        quantity_items: service.unit === "item" ? qty : undefined,
        line_total: qty * Number(service.price_kes),
      });
    }

    const sub = cart.reduce((sum, item) => sum + item.line_total, 0);
    set({
      cart,
      cartTotal: sub,
      vatTotal: sub * VAT_RATE,
      grandTotal: sub * (1 + VAT_RATE),
    });
  },

  removeFromCart: (index) => {
    const cart = get().cart.filter((_, i) => i !== index);
    const sub = cart.reduce((sum, item) => sum + item.line_total, 0);
    set({
      cart,
      cartTotal: sub,
      vatTotal: sub * VAT_RATE,
      grandTotal: sub * (1 + VAT_RATE),
    });
  },

  updateQuantity: (index, qty) => {
    const cart = [...get().cart];
    const item = cart[index];
    if (item.service.unit === "item") {
      item.quantity_items = qty;
      item.line_total = qty * Number(item.service.price_kes);
    }
    const sub = cart.reduce((sum, i) => sum + i.line_total, 0);
    set({ cart, cartTotal: sub, vatTotal: sub * VAT_RATE, grandTotal: sub * (1 + VAT_RATE) });
  },

  updateWeight: (index, weight) => {
    const cart = [...get().cart];
    const item = cart[index];
    if (item.service.unit === "kg") {
      item.quantity_kg = weight;
      item.line_total = weight * Number(item.service.price_kes);
    }
    const sub = cart.reduce((sum, i) => sum + i.line_total, 0);
    set({ cart, cartTotal: sub, vatTotal: sub * VAT_RATE, grandTotal: sub * (1 + VAT_RATE) });
  },

  clearCart: () =>
    set({ cart: [], cartTotal: 0, vatTotal: 0, grandTotal: 0 }),

  reset: () =>
    set({
      searchQuery: "",
      searchResults: [],
      selectedCustomer: null,
      cart: [],
      cartTotal: 0,
      vatTotal: 0,
      grandTotal: 0,
    }),
}));
