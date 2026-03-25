import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="py-24 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <ShoppingCart size={36} className="text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-dark mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6 max-w-xs">Looks like you haven't added any fireworks yet. Browse our collection!</p>
      <Link to="/products" className="btn-primary">Shop Now</Link>
    </div>
  );
}
