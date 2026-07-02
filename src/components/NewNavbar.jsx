// src/components/NewNavbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

export default function NewNavbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check login state
  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem("current_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse user session", e);
        }
      } else {
        setUser(null);
      }
    };
    
    checkUser();
    
    // Listen for custom login events if login is performed in-page
    window.addEventListener("storage", checkUser);
    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("current_user");
    setUser(null);
    setDropdownOpen(false);
    setIsOpen(false);
    navigate("/");
    window.location.reload(); // Force full reload to reset cart context/other states
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    return (user.role || "").toLowerCase() === "admin" ? "/dashboard" : "/member";
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#08090C]/80 backdrop-blur-md border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex flex-col group">
          <h1 className="text-xl md:text-2xl font-light tracking-[0.2em] text-[#EDECE7] uppercase transition-all duration-300 group-hover:text-[#A78BFA]">
            White<span className="font-bold text-[#A78BFA]">Frame</span>
          </h1>
          <p className="text-[8px] font-mono text-[#6B6E76] uppercase tracking-[0.3em] -mt-0.5">Labs</p>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest text-[#9A9DA6]">
          <a href="#features" className="hover:text-[#A78BFA] transition-colors">Features</a>
          <a href="#pricing" className="hover:text-[#A78BFA] transition-colors">Pricing</a>
          <Link to="/guestCatalog" className="hover:text-[#A78BFA] transition-colors">Catalog</Link>
          <Link to="/old-landing" className="text-[10px] text-[#6b6e76] hover:text-[#A78BFA] transition-colors">Legacy View</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate(getDashboardPath())}
                className="border-white/10 hover:bg-white/[0.05] text-[#EDECE7] text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-lg cursor-pointer animate-in fade-in duration-300"
              >
                Go to Dashboard
              </Button>
              
              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-white/[0.05] transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 flex items-center justify-center text-xs font-bold text-[#A78BFA] uppercase tracking-wide cursor-pointer inline-flex">
                    {user.username ? user.username.substring(0, 2) : <User className="w-4 h-4" />}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6B6E76]" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#0E0F14] border border-white/[0.08] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-xs font-bold text-[#EDECE7] truncate">{user.username}</p>
                      <p className="text-[10px] text-[#6B6E76] truncate mt-0.5">{user.email}</p>
                      <span className="inline-block bg-[#7C5CFC]/10 text-[#A78BFA] text-[9px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded mt-2">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#9A9DA6] hover:text-[#EDECE7] hover:bg-white/[0.03] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-[#9A9DA6] hover:text-[#EDECE7] hover:bg-white/[0.03] transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-white/[0.03] transition-colors border-t border-white/[0.06] cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-[11px] font-semibold uppercase tracking-widest text-[#9A9DA6] hover:text-[#EDECE7] transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Button 
                onClick={() => navigate("/register")}
                className="bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all duration-300 cursor-pointer shadow-lg shadow-[#7C5CFC]/20"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#9A9DA6] hover:text-[#EDECE7] focus:outline-none transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer (Responsive Menu) */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bottom-0 z-40 bg-[#08090C] border-t border-white/[0.08] flex flex-col justify-between p-8 animate-in slide-in-from-right duration-300">
          <nav className="flex flex-col gap-6 text-base font-semibold uppercase tracking-wider text-[#9A9DA6]">
            <a 
              href="#features" 
              onClick={() => setIsOpen(false)}
              className="hover:text-[#EDECE7] transition-colors py-2 border-b border-white/[0.04]"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={() => setIsOpen(false)}
              className="hover:text-[#EDECE7] transition-colors py-2 border-b border-white/[0.04]"
            >
              Pricing
            </a>
            <Link 
              to="/guestCatalog" 
              onClick={() => setIsOpen(false)}
              className="hover:text-[#EDECE7] transition-colors py-2 border-b border-white/[0.04]"
            >
              Catalog
            </Link>
            <Link 
              to="/old-landing" 
              onClick={() => setIsOpen(false)}
              className="hover:text-[#EDECE7] text-xs text-[#6B6E76] transition-colors py-2"
            >
              Legacy Page Reference
            </Link>
          </nav>

          <div className="flex flex-col gap-4 mt-8 pb-12">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 flex items-center justify-center text-sm font-bold text-[#A78BFA] uppercase tracking-wide">
                    {user.username ? user.username.substring(0, 2) : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#EDECE7]">{user.username}</p>
                    <p className="text-xs text-[#6B6E76]">{user.email}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate(getDashboardPath());
                  }}
                  className="w-full bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl transition-all cursor-pointer"
                >
                  Go to Dashboard
                </Button>

                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full border-white/10 hover:bg-white/[0.05] text-[#EDECE7] text-xs font-bold uppercase tracking-widest py-4 rounded-xl cursor-pointer"
                >
                  Account Settings
                </Button>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest py-4 rounded-xl transition-colors border border-red-500/20 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="w-full border-white/10 hover:bg-white/[0.05] text-[#EDECE7] text-xs font-bold uppercase tracking-widest py-4 rounded-xl cursor-pointer"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/register");
                  }}
                  className="w-full bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl cursor-pointer shadow-lg shadow-[#7C5CFC]/25"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
