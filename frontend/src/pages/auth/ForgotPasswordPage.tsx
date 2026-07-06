import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth as authApi } from "../../api/endpoints";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await authApi.forgotPassword(phone);
      toast.success("Reset code sent!");
      navigate(`/reset-password?phone=${encodeURIComponent(phone)}`);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Failed to send reset code";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
    >
      <div className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=1920&q=80)",
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      />
      <div className="relative flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img src="https://img.icons8.com/fluency/96/laundry.png" alt="" className="w-16 h-16 mx-auto mb-3" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
            <p className="text-gray-400 mt-1">Enter your phone number to receive a reset code</p>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
      <footer className="relative py-4 text-center">
        <p className="text-xs text-gray-500">LaundroSaaS &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
