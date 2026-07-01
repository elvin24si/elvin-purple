// src/components/Header.jsx
import { Link } from "react-router-dom";
import { Settings, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="w-full bg-[#08090C] border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-light tracking-[0.2em] text-[#EDECE7] uppercase">
            <Link to="/" className="hover:opacity-80 transition-opacity duration-200 cursor-pointer">
              White<span className="font-bold text-[#A78BFA]">Frame</span> <span className="text-[#6B6E76]">Labs</span>
            </Link>
          </h1>
          <p className="text-[10px] text-[#6B6E76] mt-1 uppercase tracking-[0.3em]">Premium Boutique PC Shop</p>
        </div>
        
        <nav className="flex items-center gap-8 text-[10px] font-medium uppercase tracking-widest text-[#9A9DA6]">
          <Link to="/member" className="hover:text-[#A78BFA] transition-colors">Dashboard</Link>
          <Link to="/catalog" className="hover:text-[#A78BFA] transition-colors">Catalog</Link>
          <Link to="/custom" className="hover:text-[#A78BFA] transition-colors">Custom Build</Link>
          <Link to="/points-shop" className="hover:text-[#A78BFA] transition-colors">Points Shop</Link>
          
          <Link to="/cart" className="hover:text-[#A78BFA] transition-colors flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" />
            Cart
            {cartCount > 0 && (
              <span className="bg-[#7C5CFC] text-white text-[9px] font-black rounded-full px-1.5 py-0.5 min-w-[16px] text-center inline-block">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Settings Icon Link Route */}
          <Link 
            to="/settings" 
            className="text-[#6B6E76] hover:text-[#A78BFA] transition-colors p-1"
            title="Account Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}