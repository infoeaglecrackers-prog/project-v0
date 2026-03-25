import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchFeatured, fetchBestSellers } from "../store/slices/productSlice";
import ProductGrid from "../components/product/ProductGrid";
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: ShieldCheck, label: "Certified Safe", desc: "All products are PESO approved" },
  { icon: Truck, label: "Fast Delivery", desc: "2-3 day delivery across India" },
  { icon: RefreshCw, label: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: Headphones, label: "24/7 Support", desc: "Always here to help you" },
];

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { featured, bestSellers, loading } = useAppSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchBestSellers());
  }, [dispatch]);

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-dark via-[#2d1a0e] to-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-2 text-5xl mb-4">🎆 🎇 ✨</div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Light Up Every <span className="text-primary">Celebration</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Premium certified fireworks delivered to your doorstep. Safe, vibrant, and unforgettable!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products" className="btn-primary px-8 py-3 text-base inline-flex items-center gap-2">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link to="/products?category=sparklers" className="btn-ghost text-white border-white/30 px-8 py-3 text-base">
              View Sparklers
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                <f.icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-dark dark:text-gray-100 text-sm">{f.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">✨ Featured Products</h2>
            <Link to="/products?featured=true" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <ProductGrid products={featured.slice(0, 8)} loading={loading} />
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-800/50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">🔥 Best Sellers</h2>
              <Link to="/products?sort=-sold" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <ProductGrid products={bestSellers.slice(0, 8)} loading={loading} />
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-primary text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">🎊 Festival Season Sale!</h2>
          <p className="text-white/80 mb-6">Up to 40% off on selected fireworks. Limited stock — order now!</p>
          <Link to="/products?minPrice=0&maxPrice=500" className="bg-white text-primary font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 inline-block">
            Grab Deals
          </Link>
        </div>
      </section>
    </main>
  );
}
