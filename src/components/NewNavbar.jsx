// src/components/NewNavbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

export default function NewNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const dropdownRef = useRef(null);

  // Navigation Items mapped to actual IDs on the Landing page
  const navItems = [
    { label: "Estimator", id: "simulator" },
    { label: "Signature Rigs", id: "signature" },
    { label: "Gamer Rewards", id: "points-economy" },
    { label: "How It Works", id: "work-process" },
    { label: "Bespoke Builder", id: "custom-builder" },
  ];

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

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for highlighting active section in landing page
  useEffect(() => {
    if (location.pathname !== "/") {
      if (location.pathname === "/guestCatalog") {
        setActiveSection("catalog");
      } else {
        setActiveSection("");
      }
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // Trigger when section occupies the mid-viewport
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  // Smooth scroll helper
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = isScrolled ? 70 : 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Nav click handler supporting cross-page hashing
  const handleNavClick = (e, id) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      navigate(`/#${id}`);
    }
    setIsOpen(false);
  };

  // Listen to page changes/load to perform smooth scroll to hash
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.replace("#", "");
      const timer = setTimeout(() => {
        scrollToSection(id);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

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
    <header 
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-[#08090C]/90 backdrop-blur-md border-b border-[#7C5CFC]/15 shadow-[0_4px_30px_rgba(0,0,0,0.6)] py-0" 
          : "bg-transparent border-b border-transparent py-2"
      }`}
    >
      <div 
        className={`max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-500 ${
          isScrolled ? "h-16" : "h-24"
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-2 h-2 rounded-full bg-[#7C5CFC] shadow-[0_0_8px_#7C5CFC] group-hover:bg-[#A78BFA] group-hover:shadow-[0_0_12px_#A78BFA] transition-all duration-300"></div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-light tracking-[0.2em] text-[#EDECE7] uppercase transition-all duration-300 group-hover:text-[#A78BFA]">
              White<span className="font-bold text-[#A78BFA]">Frame</span>
            </h1>
            <p className="text-[7px] font-mono text-[#6B6E76] uppercase tracking-[0.3em] -mt-0.5 group-hover:text-[#9A9DA6] transition-all duration-300">Labs</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#9A9DA6]">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative px-4 py-2 rounded-full transition-all duration-300 border ${
                  isActive
                    ? "text-[#A78BFA] bg-[#A78BFA]/8 border-[#A78BFA]/20 shadow-[0_0_12px_rgba(167,139,250,0.1)] font-semibold"
                    : "text-[#9A9DA6] hover:text-[#EDECE7] hover:bg-white/[0.02] border-transparent"
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <Link
            to="/guestCatalog"
            className={`relative px-4 py-2 rounded-full transition-all duration-300 border ${
              activeSection === "catalog"
                ? "text-[#A78BFA] bg-[#A78BFA]/8 border-[#A78BFA]/20 shadow-[0_0_12px_rgba(167,139,250,0.1)] font-semibold"
                : "text-[#9A9DA6] hover:text-[#EDECE7] hover:bg-white/[0.02] border-transparent"
            }`}
          >
            Catalog
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(getDashboardPath())}
                className="border border-white/10 bg-transparent hover:bg-white/[0.05] text-[#EDECE7] hover:text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-lg cursor-pointer transition-all hover:border-[#7C5CFC]/30 active:scale-95"
              >
                Go to Dashboard
              </button>
              
              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-white/[0.05] transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 flex items-center justify-center text-xs font-bold text-[#A78BFA] uppercase tracking-wide cursor-pointer inline-flex shadow-[0_0_8px_rgba(124,92,252,0.1)]">
                    {user.username ? user.username.substring(0, 2) : <User className="w-4 h-4" />}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6B6E76]" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#0E0F14]/95 backdrop-blur-md border border-white/[0.08] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                className="text-[10px] font-mono tracking-widest text-[#9A9DA6] hover:text-[#EDECE7] transition-colors px-3 py-2 uppercase"
              >
                Sign In
              </Link>
              <Button 
                onClick={() => navigate("/register")}
                className="bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-[10px] font-mono uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all duration-300 cursor-pointer shadow-lg shadow-[#7C5CFC]/20 hover:shadow-[#7C5CFC]/40 hover:scale-[1.03] active:scale-95"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-[#9A9DA6] hover:text-[#EDECE7] focus:outline-none transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6 animate-in spin-in-90 duration-300" /> : <Menu className="w-6 h-6 animate-in fade-in duration-300" />}
        </button>
      </div>

      {/* Mobile Drawer (Responsive Menu) */}
      {isOpen && (
        <div 
          className={`lg:hidden fixed inset-x-0 bottom-0 z-40 bg-[#08090C]/98 backdrop-blur-lg border-t border-white/[0.06] flex flex-col justify-between p-8 animate-in slide-in-from-right duration-300 ${
            isScrolled ? "top-16" : "top-24"
          } transition-all duration-500`}
        >
          <nav className="flex flex-col gap-5 text-sm font-mono tracking-widest uppercase text-[#9A9DA6]">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a 
                  key={item.id}
                  href={`#${item.id}`} 
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`flex items-center justify-between py-2.5 border-b border-white/[0.04] transition-colors ${
                    isActive ? "text-[#A78BFA] font-bold" : "hover:text-[#EDECE7]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] shadow-[0_0_6px_#A78BFA]"></div>}
                </a>
              );
            })}
            <Link 
              to="/guestCatalog" 
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between py-2.5 border-b border-white/[0.04] transition-colors ${
                activeSection === "catalog" ? "text-[#A78BFA] font-bold" : "hover:text-[#EDECE7]"
              }`}
            >
              <span>Catalog</span>
              {activeSection === "catalog" && <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] shadow-[0_0_6px_#A78BFA]"></div>}
            </Link>
          </nav>

          <div className="flex flex-col gap-4 mt-8 pb-8">
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
                  className="w-full bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  Go to Dashboard
                </Button>

                <button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full border border-white/10 bg-transparent hover:bg-white/[0.05] text-[#EDECE7] hover:text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all active:scale-95"
                >
                  Account Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl transition-colors border border-red-500/20 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="w-full border border-white/10 bg-transparent hover:bg-white/[0.05] text-[#EDECE7] hover:text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl cursor-pointer transition-all active:scale-95"
                >
                  Sign In
                </button>
                <Button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/register");
                  }}
                  className="w-full bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl cursor-pointer shadow-lg shadow-[#7C5CFC]/25"
                >
                  Get Started
                </Button>
              </div>
            )}

            <div className="flex justify-end items-center mt-6 pt-6 border-t border-white/[0.04]">
              <span className="text-[9px] text-[#52545c] font-mono">v1.2.0</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
