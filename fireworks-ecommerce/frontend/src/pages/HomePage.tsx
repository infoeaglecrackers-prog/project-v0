import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchFeatured, fetchBestSellers } from "../store/slices/productSlice";
import ProductGrid from "../components/product/ProductGrid";
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones, Zap } from "lucide-react";
import FireworksCanvas, { type FireworksHandle } from "../components/common/FireworksCanvas";

const features = [
  { icon: ShieldCheck, label: "Certified Safe",  desc: "All products are PESO approved",   color: "from-green-500 to-emerald-400" },
  { icon: Truck,       label: "Fast Delivery",   desc: "2-3 day delivery across India",     color: "from-primary to-primary-400"  },
  { icon: RefreshCw,   label: "Easy Returns",    desc: "7-day hassle-free returns",         color: "from-secondary to-yellow-400" },
  { icon: Headphones,  label: "24/7 Support",    desc: "Always here to help you",           color: "from-purple-500 to-pink-400"  },
];

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { featured, bestSellers, loading } = useAppSelector((s) => s.products);
  const fireworksRef = useRef<FireworksHandle>(null);

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchBestSellers());
  }, [dispatch]);

  const handleHeroBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    fireworksRef.current?.burstAt(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <main>
      {/* ── ANNOUNCEMENT TICKER ──────────────────────────────── */}
      <div className="overflow-hidden py-2.5" style={{ background: "linear-gradient(90deg, #ac113d 0%, #c9184a 40%, #e02b6a 60%, #c9184a 80%, #ac113d 100%)" }}>
        <div className="flex animate-ticker whitespace-nowrap select-none">
          {[0, 1].map((ri) => (
            <div key={ri} className="flex shrink-0">
              {["🎆 FESTIVAL SEASON SALE — UP TO 40% OFF", "🚀 FREE DELIVERY ABOVE ₹999", "✨ PESO CERTIFIED FIREWORKS", "🎇 100K+ HAPPY CUSTOMERS", "🎊 PAN-INDIA DELIVERY", "🔥 LIMITED STOCK — ORDER NOW", "💥 EAGLE CRACKERS — INDIA'S FAVOURITE"].map((text, i) => (
                <span key={i} className="px-8 text-white font-bold text-xs tracking-widest uppercase">
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg, #000000 0%, #0d0005 40%, #1a0009 65%, #000000 100%)", minHeight: "500px" }}
      >
        {/* Fireworks canvas — contained ONLY in this hero section */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <FireworksCanvas ref={fireworksRef} autoLaunch launchInterval={2200} />
        </div>

        {/* Click-to-burst overlay — covers the entire hero area */}
        <div
          className="absolute inset-0 cursor-crosshair"
          style={{ zIndex: 3 }}
          onClick={handleHeroBgClick}
        />

        {/* CSS glow orbs for background colour mood */}
        <div
          className="hero-orb pointer-events-none"
          style={{ width: "520px", height: "520px", background: "rgba(201,24,74,0.12)", top: "-160px", left: "-100px", zIndex: 1 }}
        />
        <div
          className="hero-orb pointer-events-none"
          style={{ width: "380px", height: "380px", background: "rgba(255,215,0,0.07)", bottom: "-80px", right: "-60px", animationDelay: "3s", zIndex: 1 }}
        />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            zIndex: 1,
          }}
        />

        {/* Hero content — above click overlay */}
        <div className="relative py-24 px-4" style={{ zIndex: 10, pointerEvents: "none" }}>
          <div className="max-w-4xl mx-auto text-center">

            {/* Floating icons */}
            <div className="flex justify-center gap-4 text-5xl mb-6 select-none">
              <span className="animate-float">🎆</span>
              <span className="animate-float-d1">🎇</span>
              <span className="animate-float-d2">✨</span>
            </div>

            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6
                            bg-white/5 border border-white/10 text-sm text-gray-300 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
              Festival Season Sale — Up to 40% OFF
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-bold mb-5 leading-tight animate-slide-up">
              Light Up Every{" "}
              <span className="gradient-text">Celebration</span>
            </h1>

            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed animate-slide-up-d1">
              Premium certified fireworks delivered to your doorstep.
              Safe, vibrant, and unforgettable!
            </p>

            {/* CTAs — restore pointer-events so buttons are clickable */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-d2" style={{ pointerEvents: "auto" }}>
              <Link to="/products" className="btn-primary px-8 py-3.5 text-base">
                Shop Now <ArrowRight size={18} />
              </Link>

              <button
                onClick={() => fireworksRef.current?.launchSalvo(6)}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl
                           text-white border border-white/20 hover:bg-white/10 hover:border-white/40
                           transition-all duration-200 cursor-pointer"
              >
                <Zap size={17} className="text-secondary" />
                Fire Salvo!
              </button>
            </div>

            {/* Click hint */}
            <p className="mt-8 text-xs text-gray-600 animate-fade-in select-none">
              ✦ Click anywhere here to burst a firework ✦
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-500 animate-fade-in">
              {["PESO Certified", "100k+ Happy Customers", "Pan-India Delivery"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-dark-300 border-b border-gray-200 dark:border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={f.label} className="feature-card flex items-center gap-3" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`w-11 h-11 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                <f.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-dark dark:text-gray-100 text-sm">{f.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Handpicked</p>
              <h2 className="section-title mb-0">✨ Featured Products</h2>
            </div>
            <Link to="/products?featured=true"
                  className="flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all duration-200">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={featured.slice(0, 8)} loading={loading} />
        </section>
      )}

      {/* ── BEST SELLERS ─────────────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="py-14 bg-gray-50 dark:bg-dark-300">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Top Picks</p>
                <h2 className="section-title mb-0">🔥 Best Sellers</h2>
              </div>
              <Link to="/products?sort=-sold"
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all duration-200">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <ProductGrid products={bestSellers.slice(0, 8)} loading={loading} />
          </div>
        </section>
      )}

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-16 px-4 cursor-pointer"
        onClick={() => fireworksRef.current?.launchRainbow()}
        title="Click to launch rainbow fireworks 🌈"
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #ac113d 0%, #c9184a 50%, #e02b6a 100%)" }}
        />
        <div
          className="absolute pointer-events-none"
          style={{ width: "380px", height: "380px", background: "rgba(255,255,255,0.07)", borderRadius: "50%", filter: "blur(60px)", top: "-80px", right: "-40px" }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center text-white">
          <div className="text-4xl mb-4">🎊</div>
          <h2 className="text-3xl font-bold mb-3">Festival Season Sale!</h2>
          <p className="text-white/80 mb-2 text-lg">Up to 40% off on selected fireworks. Limited stock — order now!</p>
          <p className="text-white/40 text-xs mb-8">Click this banner to fire rainbow rockets 🌈</p>
          <Link
            to="/products?minPrice=0&maxPrice=500"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold
                       px-8 py-3.5 rounded-xl text-base
                       hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5
                       transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            Grab Deals <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
