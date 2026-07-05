import { Link } from "react-router-dom";
import { Camera, Users, X, Mail, Phone, ArrowRight } from "lucide-react";

const SOCIAL = [
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Users,  href: "#", label: "Facebook"  },
  { icon: X,      href: "#", label: "X / Twitter" },
];

const QUICK_LINKS = [["Home", "/"], ["Products", "/products"], ["Cart", "/cart"], ["My Orders", "/orders"]];
const HELP_LINKS  = ["FAQ", "Terms & Conditions", "Privacy Policy"];

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #000000 100%)" }}>
      {/* Crimson glow accent line */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,24,74,0.7), rgba(255,215,0,0.35), rgba(201,24,74,0.7), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-5">
            <span className="text-2xl">🎆</span>
            <span className="text-white font-bold text-lg gradient-text">Eagle Crackers</span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-500">
            Safe, certified fireworks for every festival.<br />
            Celebrate with brilliance!
          </p>
          <div className="flex gap-2.5 mt-6">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-xl flex items-center justify-center
                           text-gray-500 hover:text-white
                           bg-white/5 hover:bg-primary
                           border border-white/5 hover:border-primary
                           transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-sm"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Quick Links</h4>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map(([label, href]) => (
              <li key={label}>
                <Link
                  to={href}
                  className="text-sm text-gray-500 hover:text-primary
                             flex items-center gap-1.5 group transition-colors duration-200"
                >
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-200" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Help</h4>
          <ul className="space-y-2.5">
            {HELP_LINKS.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-primary
                             flex items-center gap-1.5 group transition-colors duration-200"
                >
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-200" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + Newsletter */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Get in Touch</h4>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2.5 text-sm text-gray-500">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Mail size={13} className="text-primary" />
              </div>
              <a href="mailto:info@eaglecrackers.com" className="hover:text-primary transition-colors">
                info@eaglecrackers.com
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-gray-500">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Phone size={13} className="text-primary" />
              </div>
              <span>+91 98765 43210</span>
            </li>
          </ul>

          {/* Newsletter */}
          <div>
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Newsletter</p>
            <div className="flex overflow-hidden rounded-xl border border-white/8">
              <input
                placeholder="Your email address"
                className="flex-1 bg-white/5 px-3 py-2.5 text-sm outline-none
                           text-gray-200 placeholder:text-gray-600"
              />
              <button
                className="px-3.5 text-white text-sm font-semibold shrink-0 transition-opacity hover:opacity-80"
                style={{ background: "linear-gradient(135deg, #c9184a, #e02b6a)" }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t py-5 px-4"
        style={{ borderColor: "rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Eagle Crackers. All rights reserved.
          </p>
          <p className="text-xs text-gray-700 flex items-center gap-1">
            Made with
            <span className="text-primary">❤</span>
            in India
          </p>
        </div>
      </div>
    </footer>
  );
}
