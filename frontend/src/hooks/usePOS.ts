import { usePOSStore } from "../stores/posStore";

export function usePOS() {
  const store = usePOSStore();
  return {
    searchQuery: store.searchQuery,
    setSearchQuery: store.setSearchQuery,
    searchResults: store.searchResults,
    searchCustomer: store.searchCustomer,
    selectedCustomer: store.selectedCustomer,
    selectCustomer: store.selectCustomer,
    services: store.availableServices,
    loadServices: store.loadServices,
    cart: store.cart,
    addToCart: store.addToCart,
    removeFromCart: store.removeFromCart,
    updateQuantity: store.updateQuantity,
    updateWeight: store.updateWeight,
    clearCart: store.clearCart,
    subtotal: store.cartTotal,
    vat: store.vatTotal,
    grandTotal: store.grandTotal,
    isProcessing: false,
    reset: store.reset,
  };
}
