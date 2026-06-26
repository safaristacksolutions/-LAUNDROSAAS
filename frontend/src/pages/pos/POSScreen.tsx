import { useEffect, useState } from "react";
import { usePOSStore } from "../../stores/posStore";
import { useAuthStore } from "../../stores/authStore";
import { orders as ordersApi, payments as paymentsApi } from "../../api/endpoints";
import toast from "react-hot-toast";

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&q=60",
  "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=60",
];

export default function POSScreen() {
  const user = useAuthStore((s) => s.user);
  const store = usePOSStore();
  const [paymentStatus, setPaymentStatus] = useState<string>("idle");
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [bgIdx, setBgIdx] = useState(0);

  useEffect(() => {
    store.loadServices();
    const interval = setInterval(() => setBgIdx((i) => (i + 1) % BG_IMAGES.length), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCustomerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    store.setSearchQuery(val);
    store.searchCustomer(val);
  };

  const handleProcessOrder = async () => {
    if (!store.selectedCustomer) {
      toast.error("Select a customer first");
      return;
    }
    if (store.cart.length === 0) {
      toast.error("Add at least one service");
      return;
    }

    try {
      const orderData = {
        customer: store.selectedCustomer.id,
        payment_method: "mpesa",
        expected_ready_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        items: store.cart.map((item) => ({
          service: item.service.id,
          quantity_kg: item.quantity_kg || null,
          quantity_items: item.quantity_items || null,
          line_total_kes: item.line_total,
        })),
      };

      const { data: order } = await ordersApi.create(orderData);
      setPaymentStatus("pending");

      const { data: payment } = await paymentsApi.initiateSTK(
        order.id,
        store.selectedCustomer.phone
      );
      setCheckoutId(payment.checkout_request_id);

      toast.success("STK Push sent! Ask customer to check phone.");

      const interval = setInterval(async () => {
        try {
          const { data: status } = await paymentsApi.status(payment.checkout_request_id);
          if (status.state === "completed") {
            clearInterval(interval);
            setPaymentStatus("completed");
            toast.success("Payment received! Order created.");
            setTimeout(() => { store.reset(); setPaymentStatus("idle"); }, 2000);
          } else if (status.state === "failed") {
            clearInterval(interval);
            setPaymentStatus("failed");
            toast.error("Payment failed. You can retry.");
          }
        } catch {}
      }, 3000);

      setTimeout(() => clearInterval(interval), 120000);
    } catch {
      toast.error("Failed to create order");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img src="https://img.icons8.com/fluency/48/laundry.png" alt="logo" className="w-8 h-8" />
          <h1 className="font-bold text-lg">LaundroSaaS POS</h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">{user?.first_name || user?.username}</span>
          <span className="px-2.5 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-medium">{user?.role}</span>
          <button onClick={() => useAuthStore.getState().logout()} className="text-gray-400 hover:text-gray-600">Logout</button>
        </div>
      </header>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left: Customer + Services */}
        <div className="w-[380px] flex flex-col gap-4">
          {/* Customer Search */}
          <div className="card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <img src="https://img.icons8.com/fluency/96/search.png" alt="" className="w-full h-full object-contain" />
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2 relative">
              📱 Customer Phone
            </label>
            <input
              type="tel"
              className="input relative"
              placeholder="0712 345 678"
              value={store.searchQuery}
              onChange={handleCustomerSearch}
            />
            {store.searchResults.length > 0 && (
              <div className="mt-2 space-y-1 relative">
                {store.searchResults.map((c) => (
                  <button
                    key={c.id}
                    className="w-full text-left p-3 rounded-lg hover:bg-brand-50 transition-colors border border-gray-100 flex items-center gap-3"
                    onClick={() => store.selectCustomer(c)}
                  >
                    <img src="https://img.icons8.com/fluency/48/user.png" alt="" className="w-8 h-8" />
                    <div>
                      <span className="font-medium block">{c.first_name || c.phone}</span>
                      <span className="text-gray-400 text-xs">{c.total_orders} orders · KES {Number(c.total_spent_kes).toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {store.selectedCustomer && (
              <div className="mt-2 p-3 bg-green-50 rounded-xl flex items-center gap-3 border border-green-200 relative">
                <img src="https://img.icons8.com/fluency/48/checked-user.png" alt="" className="w-8 h-8" />
                <span className="font-medium flex-1">{store.selectedCustomer.first_name || store.selectedCustomer.phone}</span>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => store.selectCustomer(null)}>✕</button>
              </div>
            )}
          </div>

          {/* Services Grid */}
          <div className="card flex-1">
            <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <img src="https://img.icons8.com/fluency/48/services.png" alt="" className="w-5 h-5" />
              Quick Services
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {store.availableServices.map((s) => (
                <button
                  key={s.id}
                  className="p-3 rounded-xl border-2 border-gray-100 hover:border-brand-400 hover:bg-brand-50 transition-all text-center group"
                  onClick={() => store.addToCart(s)}
                >
                  <div className="text-2xl mb-1 group-hover:scale-125 transition-transform">{s.icon}</div>
                  <div className="font-semibold text-sm">{s.name}</div>
                  <div className="text-xs text-gray-400">
                    KES {Number(s.price_kes).toLocaleString()}/{s.unit === "kg" ? "kg" : "item"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Cart & Payment */}
        <div className="flex-1 flex flex-col">
          <div className="card flex-1 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.03] pointer-events-none">
              <img src={BG_IMAGES[bgIdx]} alt="" className="w-full h-full object-cover rounded-full" />
            </div>

            <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2 relative">
              <img src="https://img.icons8.com/fluency/48/shopping-cart.png" alt="" className="w-5 h-5" />
              Cart
            </h3>

            <div className="flex-1 space-y-2 overflow-y-auto relative">
              {store.cart.length === 0 ? (
                <div className="text-center text-gray-400 py-16">
                  <img src="https://img.icons8.com/fluency/96/empty-box.png" alt="" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select customer and services to start</p>
                </div>
              ) : (
                store.cart.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="text-2xl">{item.service.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium">{item.service.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {item.service.unit === "kg" ? (
                          <div className="flex items-center gap-1">
                            <button className="w-7 h-7 rounded-lg bg-gray-200 text-sm font-medium hover:bg-gray-300" onClick={() => store.updateWeight(i, Math.max(0.5, (item.quantity_kg || 1) - 0.5))}>−</button>
                            <span className="w-14 text-center font-mono text-sm font-medium">{item.quantity_kg}kg</span>
                            <button className="w-7 h-7 rounded-lg bg-gray-200 text-sm font-medium hover:bg-gray-300" onClick={() => store.updateWeight(i, (item.quantity_kg || 1) + 0.5)}>+</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button className="w-7 h-7 rounded-lg bg-gray-200 text-sm font-medium hover:bg-gray-300" onClick={() => store.updateQuantity(i, Math.max(1, (item.quantity_items || 1) - 1))}>−</button>
                            <span className="w-8 text-center font-mono text-sm font-medium">{item.quantity_items}</span>
                            <button className="w-7 h-7 rounded-lg bg-gray-200 text-sm font-medium hover:bg-gray-300" onClick={() => store.updateQuantity(i, (item.quantity_items || 1) + 1)}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">KES {item.line_total.toLocaleString()}</div>
                    </div>
                    <button className="text-red-300 hover:text-red-500 transition-colors p-1" onClick={() => store.removeFromCart(i)}>
                      <img src="https://img.icons8.com/fluency/48/delete.png" alt="" className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 mt-4 space-y-1.5 relative">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal</span>
                <span>KES {store.cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>VAT (16%)</span>
                <span>KES {store.vatTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-1 border-t">
                <span>💰 TOTAL</span>
                <span className="text-brand-700">KES {store.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Actions */}
            <div className="flex gap-3 mt-4 relative">
              <button
                className="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                disabled={!store.selectedCustomer || store.cart.length === 0 || paymentStatus === "pending"}
                onClick={handleProcessOrder}
              >
                <img src="https://img.icons8.com/fluency/48/mpesa.png" alt="" className="w-6 h-6" />
                {paymentStatus === "pending" ? "Awaiting Payment..." : "M-PESA"}
              </button>
              <button
                className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={!store.selectedCustomer || store.cart.length === 0}
              >
                <img src="https://img.icons8.com/fluency/48/cash.png" alt="" className="w-6 h-6" />
                CASH
              </button>
              <button className="px-4 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center" disabled={store.cart.length === 0}>
                🧾
              </button>
            </div>

            {paymentStatus === "pending" && (
              <div className="mt-3 p-4 bg-yellow-50 rounded-xl text-sm text-yellow-800 flex items-center gap-3 border border-yellow-200 relative">
                <span className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center animate-pulse">📱</span>
                <span>Ask customer to check phone and enter M-Pesa PIN</span>
              </div>
            )}

            {paymentStatus === "completed" && (
              <div className="mt-3 p-4 bg-green-50 rounded-xl text-sm text-green-800 flex items-center gap-3 border border-green-200 relative">
                <span className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">✅</span>
                <span className="font-medium">Payment received! Order created successfully.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
