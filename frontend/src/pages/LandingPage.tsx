import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=1200&q=80",
  "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&q=80",
  "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=1200&q=80",
];

const FEATURES = [
  {
    icon: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&q=80",
    title: "Rent Health Dashboard",
    desc: "Know exactly if you can pay rent this month. Auto-reserve from every payment.",
  },
  {
    icon: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=100&q=80",
    title: "Auto-Notifications",
    desc: "Customers get SMS at every step. Zero phone calls. Zero interruptions.",
  },
  {
    icon: "https://images.unsplash.com/photo-1553729459-afe8f2e2a27e?w=100&q=80",
    title: "Smart M-Pesa Payments",
    desc: "Auto-retry on timeout. Payment links for later. Never lose a payment again.",
  },
  {
    icon: "https://images.unsplash.com/photo-1532635241-17aa820d3f83?w=100&q=80",
    title: "Item Tracking",
    desc: "Count every shirt with photos. End 'you lost my clothes' disputes forever.",
  },
];

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧺</span>
            <span className="font-bold text-xl">LaundroSaaS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
            <Link to="/register" className="bg-brand-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-brand-700 transition-all hover:scale-105">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGES[0]}
            alt="Laundry"
            className="w-full h-full object-cover"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Trusted by 142+ laundry shops in Kenya
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Stop Worrying<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">About Rent</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              The only laundry POS that automatically sets aside rent money from every payment.
              Know if you can pay rent before it's due. No more sleepless nights.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/register" className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all hover:scale-105 shadow-xl shadow-brand-600/30">
                Start Free Trial →
              </Link>
              <a href="#features" className="text-white/80 hover:text-white px-6 py-4 font-medium">
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Two Problems. One Solution.</h2>
            <p className="text-xl text-gray-500">Every laundry shop owner in Kenya faces the same two anxieties</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100 hover:shadow-xl transition-shadow group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📞</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">"Is my order ready?"</h3>
              <p className="text-gray-500 leading-relaxed">
                Customers call 3-5 times per order. Each call interrupts your cashier and wastes time.
                With LaundroSaaS, they get auto-SMS at every status change. Zero calls.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100 hover:shadow-xl transition-shadow group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">"Can I pay rent?"</h3>
              <p className="text-gray-500 leading-relaxed">
                Rent day is the most stressful day of the month. LaundroSaaS auto-reserves a percentage
                of every payment. You see your rent health at a glance. Safe or critical — you know before it's due.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Kenyan Laundry Shops</h2>
            <p className="text-xl text-gray-500">M-Pesa integrated. Rent-focused. Employee-friendly.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                <img src={f.icon} alt={f.title} className="w-16 h-16 rounded-xl object-cover mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gradient-to-br from-brand-900 to-brand-700 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">It Takes 2 Minutes to Start</h2>
            <p className="text-xl text-white/70">No training needed. No installation. Just a phone.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Sign Up", desc: "Enter your shop name and phone. We create your tenant in 5 seconds." },
              { step: "2", title: "Add Your First Order", desc: "Type customer phone, tap services, tap M-Pesa. Done in 45 seconds." },
              { step: "3", title: "Watch Rent Grow", desc: "Every payment auto-reserves rent. Check your dashboard anytime." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-2 border-white/30">
                  {s.step}
                </div>
                <h3 className="font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-500">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Starter", price: "1,999", feat: ["1 cashier", "300 orders/mo", "Basic POS", "Cash & M-Pesa", "WhatsApp support"], popular: false },
              { name: "Pro", price: "4,999", feat: ["3 users", "Unlimited orders", "Advanced POS", "Rent Health dashboard", "500 SMS/mo", "Revenue forecast"], popular: true },
              { name: "Enterprise", price: "Custom", feat: ["Unlimited users", "Multi-branch", "Custom reports", "ML analytics", "Dedicated manager", "API access"], popular: false },
            ].map((plan, i) => (
              <div key={i} className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${plan.popular ? "border-brand-500 relative scale-105" : "border-gray-100"} hover:shadow-xl transition-shadow`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">KES {plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-400">/mo</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.feat.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-600">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`block text-center py-3 rounded-xl font-semibold transition-all ${plan.popular ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&q=80"
            alt="Shop owner"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-6 shadow-lg"
          />
          <blockquote className="text-2xl font-medium text-gray-700 leading-relaxed mb-6">
            "Before LaundroSaaS, I was always worried about rent. Now I open my phone and see 'SAFE' in green.
            That peace of mind is worth every shilling."
          </blockquote>
          <p className="font-semibold text-gray-900">Mama Njoro</p>
          <p className="text-gray-400 text-sm">FreshWash Laundry, Kilimani</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-brand-600 to-brand-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Start Sleeping Better Tonight</h2>
          <p className="text-xl text-white/80 mb-8">Join 142+ Kenyan laundry shops already using LaundroSaaS. Free trial. No card required.</p>
          <Link to="/register" className="inline-block bg-white text-brand-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
            Start Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="text-3xl mb-4">🧺</div>
          <p className="font-bold text-white text-lg mb-2">LaundroSaaS</p>
          <p className="text-sm">Multi-tenant laundry management for Kenya</p>
          <div className="mt-8 text-xs">© 2026 LaundroSaaS. Built in Nairobi, Kenya.</div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
