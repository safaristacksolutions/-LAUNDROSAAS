import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    phone: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    role: "cashier",
  });
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      await register(form);
      toast.success("Account created! Welcome to LaundroSaaS");
      navigate("/pos");
    } catch (err: any) {
      const msg = err?.response?.data?.phone?.[0] || err?.response?.data?.password?.[0] || "Registration failed";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="text-4xl inline-block mb-2">🧺</Link>
          <h1 className="text-2xl font-bold text-gray-900">Join LaundroSaaS</h1>
          <p className="text-gray-500 text-sm">Start your free trial today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input name="first_name" className="input" placeholder="Mama" value={form.first_name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input name="last_name" className="input" placeholder="Njoro" value={form.last_name} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input name="phone" type="tel" className="input" placeholder="0712 345 678" value={form.phone} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select name="role" className="input" value={form.role} onChange={handleChange}>
              <option value="cashier">Cashier</option>
              <option value="admin">Admin (Owner)</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type="password" className="input" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input name="confirm_password" type="password" className="input" placeholder="Repeat password" value={form.confirm_password} onChange={handleChange} required minLength={6} />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Free Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
