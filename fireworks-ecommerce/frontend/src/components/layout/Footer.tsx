import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎆</span>
            <span className="text-white font-bold text-lg">Crackers Bazaar</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">
            Safe, certified fireworks for every festival. Celebrate with brilliance!
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="hover:text-primary transition-colors"><Instagram size={18} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Facebook size={18} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Twitter size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[["Home", "/"], ["Products", "/products"], ["Cart", "/cart"], ["Orders", "/orders"]].map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="hover:text-primary transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-white font-semibold mb-4">Help</h4>
          <ul className="space-y-2 text-sm">
            {["FAQ", "Shipping Policy", "Return Policy", "Terms & Conditions", "Privacy Policy"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-primary transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={14} /> <a href="mailto:info@crackersbazaar.com" className="hover:text-primary">info@crackersbazaar.com</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} /> <span>+91 98765 43210</span>
            </li>
          </ul>
          <div className="mt-5">
            <p className="text-xs text-gray-500 mb-2">Newsletter</p>
            <div className="flex">
              <input placeholder="Your email" className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-3 py-2 text-sm outline-none" />
              <button className="bg-primary text-white px-3 py-2 rounded-r-lg text-sm hover:bg-primary-600">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Crackers Bazaar. All rights reserved.
      </div>
    </footer>
  );
}
