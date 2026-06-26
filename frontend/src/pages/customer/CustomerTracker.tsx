import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orders as ordersApi } from "../../api/endpoints";
import type { Order } from "../../types";
import toast from "react-hot-toast";

const statusSteps = [
  { key: "received", label: "Received", icon: "📥" },
  { key: "washing", label: "Washing", icon: "🧺" },
  { key: "drying", label: "Drying", icon: "🔥" },
  { key: "ironing", label: "Ironing", icon: "✨" },
  { key: "ready", label: "Ready", icon: "✅" },
];

const statusIdx: Record<string, number> = { received: 0, washing: 1, drying: 2, ironing: 3, ready: 4 };

export default function CustomerTracker() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);

  const trackOrder = async () => {
    if (!phone && !orderId) return;
    try {
      const { data } = await ordersApi.list({ search: phone || orderId });
      if (data.length > 0) { setOrder(data[0]); setSearched(true); }
      else toast.error("Order not found");
    } catch { toast.error("Failed"); }
  };

  useEffect(() => {
    if (orderId) {
      ordersApi.list().then(({ data }) => {
        const found = data.find((o) => o.order_number === orderId);
        if (found) { setOrder(found); setSearched(true); }
      });
    }
  }, [orderId]);

  const currentIdx = order ? (statusIdx[order.status] ?? -1) : -1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center gap-3">
          <Link to="/">
            <img src="https://img.icons8.com/fluency/48/laundry.png" alt="" className="w-8 h-8" />
          </Link>
          <h1 className="font-bold text-lg">Laundry Tracker</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        {!searched ? (
          <div className="space-y-6 pt-8">
            <div className="text-center">
              <img src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400&q=60" alt="" className="w-32 h-32 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
              <h2 className="text-xl font-bold">Track Your Order</h2>
              <p className="text-gray-500 text-sm mt-1">No login required. Enter your phone number.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" className="input" placeholder="0712 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={(e) => e.key === "Enter" && trackOrder()} />
            </div>
            <button className="btn-primary w-full" onClick={trackOrder}>
              🔍 Track Order
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
              <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-400">OR</span></div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl border-2 border-dashed">
              <p className="text-sm text-gray-500 mb-2">Scan QR code on your receipt</p>
              <div className="w-24 h-24 mx-auto bg-white rounded-xl shadow-sm flex items-center justify-center border">
                <img src="https://img.icons8.com/fluency/96/qr-code.png" alt="" className="w-12 h-12 opacity-50" />
              </div>
            </div>
          </div>
        ) : order ? (
          <div className="space-y-4 pt-4">
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-lg">{order.customer_name || "Customer"}</h2>
                  <p className="text-sm text-gray-500">Order #{order.order_number}</p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <div>📅 {new Date(order.created_at).toLocaleDateString()}</div>
                  <div>⏰ {new Date(order.expected_ready_at).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="space-y-0">
                {statusSteps.map((step, i) => (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                        i <= currentIdx ? "bg-green-500 text-white shadow-md" : "bg-gray-100 text-gray-400"
                      }`}>
                        {i <= currentIdx ? "✓" : i + 1}
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-8 transition-all duration-500 ${i < currentIdx ? "bg-green-400" : "bg-gray-200"}`} />
                      )}
                    </div>
                    <div className={`py-1.5 ${i <= currentIdx ? "text-gray-900" : "text-gray-400"}`}>
                      <span className="text-lg mr-2">{step.icon}</span>
                      <span className="font-medium">{step.label}</span>
                      {i === currentIdx && order.status !== "delivered" && (
                        <div className="text-sm text-green-600 font-medium mt-0.5 animate-pulse">
                          {order.status === "ready" ? "Ready for pickup! 🎉" : "In progress..."}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <img src="https://img.icons8.com/fluency/48/receipt.png" alt="" className="w-5 h-5" />
                Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{item.service_icon} {item.service_name} {item.quantity_kg ? `(${item.quantity_kg}kg)` : item.quantity_items ? `(x${item.quantity_items})` : ""}</span>
                    <span className="font-medium">KES {Number(item.line_total_kes).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-brand-600">KES {Number(order.total_kes).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            {order.status === "ready" && !order.is_paid && (
              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                <img src="https://img.icons8.com/fluency/48/mpesa.png" alt="" className="w-6 h-6" />
                Pay KES {Number(order.total_kes).toLocaleString()} via M-Pesa
              </button>
            )}

            <button className="w-full text-gray-400 text-sm py-2 hover:text-gray-600" onClick={() => { setOrder(null); setSearched(false); }}>
              ← Track another order
            </button>
          </div>
        ) : (
          <div className="text-center py-16">
            <img src="https://img.icons8.com/fluency/96/search.png" alt="" className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="text-gray-400">Order not found. Check your phone number.</p>
          </div>
        )}

        {order && (
          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200 text-sm text-center">
            <p className="text-green-700 font-medium">💬 Get updates on WhatsApp?</p>
            <button className="text-green-600 underline text-xs mt-1">Enable WhatsApp notifications</button>
          </div>
        )}
      </div>
    </div>
  );
}
