import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchFeatured, fetchBestSellers } from "../store/slices/productSlice";
import ProductGrid from "../components/product/ProductGrid";
import { ArrowRight, Zap, Clock } from "lucide-react";
import FireworksCanvas, { type FireworksHandle } from "../components/common/FireworksCanvas";
import { Seo, seoAbsoluteUrl, siteName } from "../components/common/Seo";

const DIWALI_DATE = new Date("2026-11-08T00:00:00+05:30");

function useDiwaliCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = DIWALI_DATE.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { featured, bestSellers, loading } = useAppSelector((s) => s.products);
  const fireworksRef = useRef<FireworksHandle>(null);
  const countdown = useDiwaliCountdown();

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
      <Seo
        title="Elite Eagle Crackers - Buy Certified Fireworks Online"
        description="Shop PESO certified fireworks and crackers for Diwali, weddings, New Year, and festival celebrations with Elite Eagle Crackers."
        path="/"
        keywords={["buy crackers online", "online fireworks store India", "festival crackers sale"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteName,
            url: seoAbsoluteUrl("/"),
            logo: seoAbsoluteUrl("/logo-dark.png"),
            email: "info@eaglecrackers.com",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: seoAbsoluteUrl("/"),
            potentialAction: {
              "@type": "SearchAction",
              target: `${seoAbsoluteUrl("/products")}?keyword={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />

      {/* ── ANNOUNCEMENT TICKER ──────────────────────────────── */}
      <div className="overflow-hidden py-2.5" style={{ background: "linear-gradient(90deg, #ac113d 0%, #c9184a 40%, #e02b6a 60%, #c9184a 80%, #ac113d 100%)" }}>
        <div className="flex animate-ticker whitespace-nowrap select-none">
          {[0, 1].map((ri) => (
            <div key={ri} className="flex shrink-0">
              {["FESTIVAL SEASON SALE — UP TO 70% OFF", "PESO CERTIFIED FIREWORKS", "10K+ HAPPY CUSTOMERS", "PAN-INDIA DELIVERY", "MINIMUM ORDER: RS.3,000", "LIMITED STOCK — ORDER NOW", "ELITE EAGLE CRACKERS — INDIA'S FAVOURITE"].map((text, i) => (
                <span key={i} className="px-8 text-white font-bold text-xs tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block mr-3 align-middle" />
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
              Festival Season Sale — Up to 70% OFF
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
              {["PESO Certified", "10k+ Happy Customers", "Pan-India Delivery", "Min. Order ₹3,000"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DIWALI COUNTDOWN ─────────────────────────────────── */}
      <section className="py-8 px-4" style={{ background: "linear-gradient(135deg, #0d0005 0%, #1a0009 50%, #0d0005 100%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock size={16} className="text-secondary" />
            <p className="text-xs font-bold text-secondary uppercase tracking-widest">Diwali 2026 Countdown</p>
          </div>
          <p className="text-white/60 text-sm mb-5">Order early — limited stock sells out fast!</p>
          <div className="flex justify-center gap-3 sm:gap-6">
            {[
              { value: countdown.days, label: "Days" },
              { value: countdown.hours, label: "Hours" },
              { value: countdown.minutes, label: "Mins" },
              { value: countdown.seconds, label: "Secs" },
            ].map(({ value, label }, idx) => (
              <div key={label} className="flex items-center gap-3 sm:gap-6">
                <div className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-bold text-2xl sm:text-3xl text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, #c9184a 0%, #e02b6a 100%)", boxShadow: "0 0 20px rgba(201,24,74,0.4)" }}
                  >
                    {String(value).padStart(2, "0")}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-1.5">{label}</span>
                </div>
                {idx < 3 && <span className="text-primary font-bold text-2xl mb-4 -mx-1">:</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      {(loading || featured.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Handpicked</p>
              <h2 className="section-title mb-0">✨ Featured Products</h2>
            </div>
            {!loading && (
              <Link to="/products?featured=true"
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all duration-200">
                View all <ArrowRight size={14} />
              </Link>
            )}
          </div>
          <ProductGrid products={featured.slice(0, 8)} loading={loading} />
        </section>
      )}

      {/* ── BEST SELLERS ─────────────────────────────────────── */}
      {(loading || bestSellers.length > 0) && (
        <section className="py-14 bg-gray-50 dark:bg-dark-300">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Top Picks</p>
                <h2 className="section-title mb-0">🔥 Best Sellers</h2>
              </div>
              {!loading && (
                <Link to="/products?sort=-sold"
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all duration-200">
                  View all <ArrowRight size={14} />
                </Link>
              )}
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
          <p className="text-white/80 mb-2 text-lg">Up to 70% off on selected fireworks. Limited stock — order now!</p>
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
