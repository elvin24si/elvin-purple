import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Cpu, 
  Layers, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  Terminal, 
  Monitor, 
  ShieldCheck, 
  Truck, 
  HelpCircle,
  X,
  Sliders
} from "lucide-react";
import { fetchPCCatalog, normalizePC } from "../lib/supabase";

// Persona profiles with clear specifications and elite presentation
const PERSONAS = [
  {
    name: "The Deep Learning System",
    tagline: "Optimized for local LLM training, neural networks, and heavy computational research.",
    specs: {
      cpu: "AMD Ryzen 9 7950X3D (16 Cores, 32 Threads)",
      gpu: "Dual NVIDIA RTX 4090 24GB VRAM (NVLink Ready)",
      ram: "128GB DDR5 5200MHz High-Capacity Module",
      storage: "4TB PCIe Gen5 NVMe M.2 SSD (Up to 14,000 MB/s)",
      cooling: "WhiteFrame Signature Dual-Radiator Liquid Loop"
    },
    metrics: {
      ai: 98,
      render: 95,
      gaming: 88,
      silent: 82
    },
    color: "from-purple-600 to-indigo-500",
    glow: "rgba(147, 51, 234, 0.08)",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
    price: 7499
  },
  {
    name: "The Esports Elite",
    tagline: "Designed for competitive gaming. Maximum frame rates and absolute thermal stability.",
    specs: {
      cpu: "AMD Ryzen 7 7800X3D (L3 V-Cache Optimized)",
      gpu: "NVIDIA RTX 4080 Super 16GB Overclocked Edition",
      ram: "32GB DDR5 7200MHz Dual-Channel Kit",
      storage: "2TB PCIe Gen4 NVMe M.2 SSD (Up to 7,400 MB/s)",
      cooling: "360mm Closed-Loop Liquid Cooler (Custom Sleeving)"
    },
    metrics: {
      ai: 62,
      render: 76,
      gaming: 99,
      silent: 92
    },
    color: "from-purple-600 to-fuchsia-500",
    glow: "rgba(147, 51, 234, 0.08)",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
    price: 3599
  },
  {
    name: "The Cinema Studio",
    tagline: "Built for 8K video scrubbing, high-resolution rendering, and real-time timeline editing.",
    specs: {
      cpu: "Intel Core i9-14900KS (24 Cores, Up to 6.2 GHz)",
      gpu: "NVIDIA RTX 4090 Founders Edition 24GB GDDR6X",
      ram: "64GB DDR5 6400MHz High-Speed Memory",
      storage: "8TB Quad-NVMe M.2 SSD RAID 0 Configuration",
      cooling: "360mm Premium LCD Screen Liquid AIO Cooler"
    },
    metrics: {
      ai: 88,
      render: 99,
      gaming: 94,
      silent: 80
    },
    color: "from-purple-600 to-pink-500",
    glow: "rgba(147, 51, 234, 0.08)",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
    price: 5299
  },
  {
    name: "The Stealth Architect",
    tagline: "Understated aesthetics. Zero-RGB configuration and whisper-quiet operation.",
    specs: {
      cpu: "Intel Core i7-14700 (Silent Bios Tuned)",
      gpu: "NVIDIA RTX 4070 Ti Super 16GB Silent Edition",
      ram: "32GB DDR5 6000MHz Low-Profile Memory",
      storage: "2TB Ultra-Quiet NVMe M.2 SSD",
      cooling: "Noctua Dual-Tower Quiet Air Cooler"
    },
    metrics: {
      ai: 70,
      render: 80,
      gaming: 86,
      silent: 99
    },
    color: "from-purple-600 to-slate-500",
    glow: "rgba(147, 51, 234, 0.08)",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
    price: 2899
  }
];

// Clean, professional steps
const PROCESS_STEPS = [
  {
    title: "1. Design Consultation",
    desc: "Outline your performance requirements, software ecosystem, and aesthetic preferences. We help select a template or draft a custom design.",
    icon: Terminal
  },
  {
    title: "2. Engineering Draft",
    desc: "We align your selected specs, custom cable configurations, power supplies, and thermal flow paths to optimize performance.",
    icon: Sliders
  },
  {
    title: "3. Handcrafted Assembly",
    desc: "Systems are hand-assembled inside our clean rooms. Custom cable lines are routed cleanly, and liquid tubes are aligned with artistic care.",
    icon: Cpu
  },
  {
    title: "4. Stress Testing & Verification",
    desc: "Every system undergoes 72 hours of continuous thermal stress tests and benchmark validation to ensure complete stability out of the box.",
    icon: Flame
  },
  {
    title: "5. Secure Crated Delivery",
    desc: "PCs are packed inside custom wooden crates with molded padding, then shipped via insured air freight. Fully plug-and-play.",
    icon: Truck
  }
];

export default function Landing() {
  const navigate = useNavigate();
  
  // Interactivity States
  const [selectedPersona, setSelectedPersona] = useState(0);
  const [budgetSlider, setBudgetSlider] = useState(3000);
  const [activeStep, setActiveStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPC, setSelectedPC] = useState(null);

  // Signature series showcase data from Supabase
  const [signaturePCs, setSignaturePCs] = useState([]);
  useEffect(() => {
    fetchPCCatalog()
      .then((rows) => {
        const normalized = rows.map(normalizePC);
        setSignaturePCs(
          normalized.filter((pc) => pc.category === "Signature").slice(0, 4)
        );
      })
      .catch(() => setSignaturePCs([]));
  }, []);

  // Auto-slide active process step every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Sticky header shadow handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler with header offset
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 88; // Height of the sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // signaturePCs is now populated via Supabase fetch (see useEffect above)

  // Calculate clean, professional estimator values based on budget
  const getSimulatorRecommendation = (budget) => {
    if (budget < 1800) {
      return {
        tier: "Standard Core System",
        experience: "Optimized for fluid 1080p and 1440p gaming, office workloads, and home media.",
        gpu: "NVIDIA RTX 4060 / AMD RX 7600",
        cpu: "Intel i5 / AMD Ryzen 5",
        gamingFeel: "85 FPS (1440p High)",
        creationFeel: "Standard Render Speed",
        silentFeel: "Quiet Operation",
        model: "STORM BREAKER",
        modelId: "PC-010"
      };
    } else if (budget < 3000) {
      return {
        tier: "Professional Mid-Range System",
        experience: "Designed for high-frame rate 1440p gaming, 4K rendering, and fast file exports.",
        gpu: "NVIDIA RTX 4070 Super / AMD RX 7800 XT",
        cpu: "Intel i7 / AMD Ryzen 7",
        gamingFeel: "120 FPS (1440p Ultra)",
        creationFeel: "Fast Video Encoding",
        silentFeel: "Whisper-Quiet Fans",
        model: "NEBULA STRIKE",
        modelId: "PC-006"
      };
    } else if (budget < 4500) {
      return {
        tier: "Signature Elite System",
        experience: "Excellent liquid-cooled design. Native 4K gaming and professional 3D workspace rendering.",
        gpu: "NVIDIA RTX 4080 Super / AMD RX 7900 XTX",
        cpu: "AMD Ryzen 7 7800X3D",
        gamingFeel: "75 FPS (Native 4K Ultra)",
        creationFeel: "Accelerated 3D rendering",
        silentFeel: "Liquid-Cooled Silence",
        model: "SIGNATURE // MIYAKO",
        modelId: "SIG-004"
      };
    } else {
      return {
        tier: "Signature Flagship System",
        experience: "Ultimate performance design. Custom hardline liquid loop, premium layout, and peak compute power.",
        gpu: "NVIDIA RTX 4090 24GB Founders Edition",
        cpu: "AMD Ryzen 9 7950X3D",
        gamingFeel: "110 FPS (Native 4K Ultra RT)",
        creationFeel: "Production-Grade Render",
        silentFeel: "Ultra-Quiet Liquid Loop",
        model: "SIGNATURE // AYAKA",
        modelId: "SIG-001"
      };
    }
  };

  const simRec = getSimulatorRecommendation(budgetSlider);

  return (
    <div className="bg-slate-50/50 text-slate-850 min-h-screen font-sans antialiased overflow-x-hidden selection:bg-purple-600 selection:text-white">
      
      {/* 1. GLASSMORPHIC FLOATING HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/85 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm" 
          : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
          
          {/* Logo Area */}
          <Link to="/" className="flex flex-col group">
            <h1 className="text-xl md:text-2xl font-light tracking-[0.2em] text-slate-800 uppercase transition-all duration-300 group-hover:text-purple-600">
              White<span className="font-bold text-purple-600">Frame</span>
            </h1>
            <p className="text-[8px] text-slate-400 uppercase tracking-[0.3em] -mt-0.5">Labs</p>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-10 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
            <a 
              href="#signature" 
              onClick={(e) => handleScrollTo(e, "signature")} 
              className="hover:text-purple-600 transition-colors"
            >
              Signature series
            </a>
            <a 
              href="#explorer" 
              onClick={(e) => handleScrollTo(e, "explorer")} 
              className="hover:text-purple-600 transition-colors"
            >
              Rig Explorer
            </a>
            <a 
              href="#simulator" 
              onClick={(e) => handleScrollTo(e, "simulator")} 
              className="hover:text-purple-600 transition-colors"
            >
              Benchmarks
            </a>
            <a 
              href="#process" 
              onClick={(e) => handleScrollTo(e, "process")} 
              className="hover:text-purple-600 transition-colors"
            >
              Crafting process
            </a>
            <Link to="/catalog" className="hover:text-purple-600 transition-colors">Catalog</Link>
            <Link to="/custom" className="hover:text-purple-600 transition-colors">Custom Build</Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-slate-800 transition-colors"
            >
              Client Access
            </button>
            <button 
              onClick={() => navigate("/custom")}
              className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-lg border border-purple-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 active:scale-95 cursor-pointer"
            >
              Commission PC
            </button>
          </div>
        </div>
      </header>

      {/* 2. CINEMATIC HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden bg-white">
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-purple-100/40 blur-[80px] md:blur-[140px] pointer-events-none animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-violet-100/30 blur-[70px] md:blur-[120px] pointer-events-none"></div>

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(243,244,246,0.5),rgba(255,255,255,0.9))] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center relative z-10 space-y-10">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-purple-700">
              The pinnacle of bespoke system architecture
            </span>
          </div>

          {/* Main Headline */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[1.1] max-w-5xl mx-auto text-slate-900">
              Exquisite Custom Computers.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600">Built for Peak Performance.</span>
            </h2>
            <p className="text-slate-500 text-sm md:text-base lg:text-lg font-light leading-relaxed max-w-3xl mx-auto">
              We design and hand-assemble breathtaking, high-performance computing systems. Specify your goals, select your layout style, and let our master technicians build your perfect PC.
            </p>
          </div>

          {/* Call-to-actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link 
              to="/custom" 
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-5 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 active:scale-95 group cursor-pointer"
            >
              Commission Build
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link 
              to="/catalog" 
              className="w-full sm:w-auto bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-[0.2em] px-8 py-5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 active:scale-95"
            >
              Explore Catalog
            </Link>
          </div>

          {/* User-friendly Trust Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-16 border-t border-slate-100">
            <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm shadow-slate-100/40">
              <p className="text-xl md:text-2xl font-bold text-purple-600">5-Year Warranty</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-1.5 font-bold">Premium Parts Protection</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm shadow-slate-100/40">
              <p className="text-xl md:text-2xl font-bold text-purple-600">Acoustic Tuning</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-1.5 font-bold">Whisper-Quiet System Runs</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm shadow-slate-100/40">
              <p className="text-xl md:text-2xl font-bold text-purple-600">Plug & Play</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-1.5 font-bold">Fully Configured Delivery</p>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm shadow-slate-100/40">
              <p className="text-xl md:text-2xl font-bold text-purple-600">Bespoke Design</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-1.5 font-bold">Matched to your setup style</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
          <span className="text-[8px] uppercase tracking-[0.3em] font-semibold text-slate-400">Scroll</span>
          <div className="w-1.5 h-6 rounded-full border border-slate-350 flex items-start justify-center p-0.5">
            <div className="w-0.5 h-1.5 rounded-full bg-slate-400 animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE BUILD PERSONA EXPLORER */}
      <section id="explorer" className="py-24 border-t border-slate-100 bg-slate-50/30 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          {/* Section Header */}
          <div className="mb-16 text-center md:text-left">
            <p className="text-[10px] text-purple-600 font-bold tracking-[0.3em] uppercase mb-3">Interactive Workspace</p>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900">Find Your Hardware Profile</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-2xl leading-relaxed">
              We design specialized rigs matching different workloads. Select a profile below to explore component specifications and performance curves.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Persona Selectors (Left side) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {PERSONAS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPersona(idx)}
                    className={`w-full text-left p-6 rounded-xl border transition-all duration-300 flex items-start justify-between group cursor-pointer ${
                      selectedPersona === idx 
                        ? "bg-white border-purple-200 shadow-lg shadow-purple-500/5 translate-x-1" 
                        : "bg-white/60 border-slate-150 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <h3 className={`text-base font-bold transition-colors ${
                        selectedPersona === idx ? "text-purple-600" : "text-slate-800 group-hover:text-purple-600"
                      }`}>
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-450 line-clamp-1">{p.tagline}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${
                      selectedPersona === idx ? "text-purple-600 translate-x-1" : "group-hover:translate-x-0.5"
                    }`} />
                  </button>
                ))}
              </div>

              {/* Call to action button matching persona */}
              <div className="p-6 rounded-xl bg-white border border-slate-100 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Estimated Cost</p>
                  <p className="text-2xl font-black text-purple-600 mt-1">${PERSONAS[selectedPersona].price.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => navigate("/custom")} 
                  className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-4 rounded-lg flex items-center gap-2 transition-all cursor-pointer hover:shadow-lg hover:shadow-purple-500/15"
                >
                  Configure Profile <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Persona Details & Interactive Performance Bars (Right side) */}
            <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-100 p-8 md:p-10 flex flex-col justify-between shadow-xl shadow-slate-100/50 relative overflow-hidden">
              
              {/* Dynamic Glow Background */}
              <div 
                className="absolute -top-1/4 -right-1/4 w-80 h-80 rounded-full blur-[80px] transition-all duration-1000 opacity-80 pointer-events-none"
                style={{ backgroundColor: PERSONAS[selectedPersona].glow }}
              ></div>

              <div className="space-y-8 relative z-10">
                {/* Header */}
                <div className="space-y-3">
                  <div className={`inline-flex rounded-full border px-3 py-1 text-[9px] uppercase font-bold tracking-widest ${PERSONAS[selectedPersona].badgeColor}`}>
                    System Specifications
                  </div>
                  <h3 className="text-2xl font-black italic uppercase text-slate-900">{PERSONAS[selectedPersona].name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{PERSONAS[selectedPersona].tagline}</p>
                </div>

                {/* Specs List */}
                <div className="border-t border-b border-slate-100 py-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SpecRow label="Processor (CPU)" val={PERSONAS[selectedPersona].specs.cpu} icon={Cpu} />
                    <SpecRow label="Graphics (GPU)" val={PERSONAS[selectedPersona].specs.gpu} icon={Monitor} />
                    <SpecRow label="Memory (RAM)" val={PERSONAS[selectedPersona].specs.ram} icon={Layers} />
                    <SpecRow label="Storage (SSD)" val={PERSONAS[selectedPersona].specs.storage} icon={Terminal} />
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <SpecRow label="Liquid Cooling & Thermals" val={PERSONAS[selectedPersona].specs.cooling} icon={Flame} />
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Simulated Load Ratings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <MetricBar label="AI Compute (Tensor Workload)" score={PERSONAS[selectedPersona].metrics.ai} themeColor={PERSONAS[selectedPersona].color} />
                    <MetricBar label="Real-time 3D Rendering" score={PERSONAS[selectedPersona].metrics.render} themeColor={PERSONAS[selectedPersona].color} />
                    <MetricBar label="Gaming Frame Rate Stability" score={PERSONAS[selectedPersona].metrics.gaming} themeColor={PERSONAS[selectedPersona].color} />
                    <MetricBar label="Thermal Silence Index" score={PERSONAS[selectedPersona].metrics.silent} themeColor={PERSONAS[selectedPersona].color} />
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. PERFORMANCE & BENCHMARK SIMULATOR (SLIDER) */}
      <section id="simulator" className="py-24 bg-white border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Simulator Controls */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] text-purple-600 font-bold tracking-[0.3em] uppercase">Interactive Estimator</p>
                <h2 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900">Benchmark Simulator</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Drag the slider to choose your target budget. The simulator dynamically estimates graphics performance, CPU benchmarks, and recommends the corresponding WhiteFrame build.
                </p>
              </div>

              {/* Slider Component */}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Target Budget</span>
                  <span className="text-3xl font-black text-slate-900 tabular-nums">${budgetSlider.toLocaleString()}</span>
                </div>

                <div className="space-y-2">
                  <input 
                    type="range" 
                    min="1000" 
                    max="5000" 
                    step="100" 
                    value={budgetSlider} 
                    onChange={(e) => setBudgetSlider(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none"
                  />
                  <div className="flex justify-between text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                    <span>$1,000 (Core)</span>
                    <span>$3,000 (Elite)</span>
                    <span>$5,000 (Ultimate)</span>
                  </div>
                </div>

                {/* Recommendation Card */}
                <div className="pt-6 border-t border-slate-250 space-y-3">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Recommended Configuration</p>
                  <div className="flex justify-between items-center bg-white p-4 border border-slate-100 rounded-lg shadow-sm">
                    <div>
                      <h4 className="text-sm font-bold text-purple-600 uppercase italic tracking-wide">{simRec.model}</h4>
                      <p className="text-[10px] text-slate-400 uppercase mt-0.5">{simRec.tier}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/catalog`)} 
                      className="text-[9px] font-bold uppercase tracking-widest text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Benchmarks Output */}
            <div className="lg:col-span-7 bg-slate-50/50 border border-slate-100 shadow-xl shadow-slate-100/50 rounded-2xl p-8 md:p-10 space-y-8">
              <h3 className="text-xl font-bold uppercase tracking-wider italic text-slate-800 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-600" />
                Performance Estimations
              </h3>

              <div className="space-y-6">
                
                {/* Benchmark 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-600">Gaming Performance (4K Ultra Presets)</span>
                    <span className="text-purple-600 font-bold">{simRec.gamingFeel}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 transition-all duration-500 rounded-full"
                      style={{ width: budgetSlider < 1800 ? "40%" : budgetSlider < 3000 ? "70%" : budgetSlider < 4500 ? "90%" : "100%" }}
                    ></div>
                  </div>
                </div>

                {/* Benchmark 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-600">Creative Production & Export Speed</span>
                    <span className="text-purple-600 font-bold">{simRec.creationFeel}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-500 rounded-full"
                      style={{ width: budgetSlider < 1800 ? "35%" : budgetSlider < 3000 ? "65%" : budgetSlider < 4500 ? "85%" : "100%" }}
                    ></div>
                  </div>
                </div>

                {/* Benchmark 3 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-600">Thermal Silence & Acoustic Index</span>
                    <span className="text-purple-600 font-bold">{simRec.silentFeel}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500 rounded-full"
                      style={{ width: budgetSlider < 1800 ? "50%" : budgetSlider < 3000 ? "75%" : budgetSlider < 4500 ? "90%" : "100%" }}
                    ></div>
                  </div>
                </div>

              </div>

              {/* Hardware specifications details */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-slate-405 font-bold">Estimated GPU footprint</p>
                  <p className="text-xs text-slate-700 font-semibold mt-1">{simRec.gpu}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-slate-405 font-bold">Estimated CPU footprint</p>
                  <p className="text-xs text-slate-700 font-semibold mt-1">{simRec.cpu}</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. SIGNATURE SERIES SHOWCASE */}
      <section id="signature" className="py-24 border-t border-slate-100 bg-slate-50/30 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          {/* Section Header */}
          <div className="mb-16 text-center">
            <p className="text-[10px] text-purple-600 font-bold tracking-[0.3em] uppercase mb-3">Premium Masterpieces</p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900">The Signature Series</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
              Every Signature system is a numbered custom build featuring custom liquid loops, precise cable routing, and matching desktop aesthetics.
            </p>
          </div>

          {/* Grid of Signature PCs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {signaturePCs.map((pc) => (
              <div 
                key={pc.id} 
                className="group cursor-pointer flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:border-purple-250 transition-all duration-505 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/5"
                onClick={() => setSelectedPC(pc)}
              >
                {/* Image Container */}
                <div className="aspect-[4/5] bg-slate-100 overflow-hidden relative border-b border-slate-100">
                  <img 
                    src={pc.image} 
                    alt={pc.name} 
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
                  />
                  
                  {/* Category Tag */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-purple-600">
                    {pc.category}
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide group-hover:text-purple-600 transition-colors line-clamp-1">
                        {pc.name}
                      </h3>
                      <span className="text-xs font-bold text-purple-600 tabular-nums">
                        ${pc.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-medium flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-slate-400" />
                      {pc.specs.cpu.split(" ")[0]} {pc.specs.cpu.split(" ")[1] || ""} | {pc.specs.gpu.split(" ")[1] || "RTX"}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-purple-600 group-hover:text-purple-700 pt-2 border-t border-slate-100">
                    <span>Explore Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              to="/catalog" 
              className="inline-flex items-center gap-2 bg-purple-50 hover:bg-purple-100/60 border border-purple-200/50 px-8 py-4 rounded-xl text-[10px] font-extrabold uppercase tracking-widest text-purple-700 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              Browse Full Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. TIMELINE PROCESS SECTION */}
      <section id="process" className="py-24 bg-white border-t border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          {/* Section Header */}
          <div className="mb-16 text-center">
            <p className="text-[10px] text-purple-600 font-bold tracking-[0.3em] uppercase mb-3">Our Workflow</p>
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900">The Commission Process</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
              Every system is custom-designed, optimized, and verified to ensure maximum performance. Here is how we build your custom computer.
            </p>
          </div>

          {/* Timeline Interactivity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Timeline Stepper (Left) */}
            <div className="lg:col-span-5 space-y-2">
              {PROCESS_STEPS.map((step, idx) => {
                const IconComponent = step.icon;
                const isSelected = activeStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-4 rounded-xl border flex items-center gap-5 transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? "bg-slate-50 border-purple-200 shadow-sm translate-x-2" 
                        : "bg-transparent border-transparent hover:bg-slate-50/50 hover:translate-x-1"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                      isSelected 
                        ? "bg-purple-600 border-purple-500 text-white" 
                        : "bg-slate-100 border-slate-200 text-slate-400"
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Phase 0{idx + 1}</span>
                      <h4 className={`text-sm font-bold uppercase tracking-wide transition-colors ${
                        isSelected ? "text-purple-600" : "text-slate-600"
                      }`}>{step.title}</h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Timeline Detailed Focus Panel (Right) */}
            <div className="lg:col-span-7 rounded-2xl bg-slate-50/40 border border-slate-100 p-8 md:p-10 min-h-[300px] flex flex-col justify-between shadow-xl shadow-slate-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-8xl font-black text-slate-200/50 select-none pointer-events-none">
                0{activeStep + 1}
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-purple-600 font-bold">Commission Stage</p>
                </div>
                
                <h3 className="text-2xl font-black uppercase text-slate-900 italic">
                  {PROCESS_STEPS[activeStep].title}
                </h3>
                
                <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl font-light">
                  {PROCESS_STEPS[activeStep].desc}
                </p>
              </div>

              <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {PROCESS_STEPS.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        activeStep === idx ? "w-8 bg-purple-600" : "w-2 bg-slate-200"
                      }`}
                    ></div>
                  ))}
                </div>
                <Link 
                  to="/custom" 
                  className="text-[9px] font-bold uppercase tracking-widest text-purple-600 hover:text-purple-700 flex items-center gap-1.5"
                >
                  Initiate Commission <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 7. PREMIUM VALUE PROP SECTION */}
      <section className="py-24 border-t border-slate-100 relative bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm shadow-purple-50">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide text-slate-800">5-Year Premium Warranty</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-light">
                Every custom system carries a fully transferrable 5-year warranty on all physical parts and fluid connections. Hardware logs are maintained in our private database registry.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm shadow-purple-50">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide text-slate-800">Full Configuration Setup</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-light">
                We pre-load all necessary system drivers, optimize operating systems, and perform complete hardware validations. Your PC arrives fully plug-and-play.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm shadow-purple-50">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide text-slate-800">Concierge Support</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-light">
                Direct access to the technician who built your computer. We provide real-time diagnostic checks, hardware consultations, and custom cooling loop logs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 8. PRE-FOOTER NEWSLETTER & BRAND STATEMENT */}
      <section className="py-24 border-t border-slate-100 relative bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900 leading-tight">
            Ready to design your custom computer?
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed font-light">
            We limit assembly slots to 15 builds per month to maintain craftsmanship. Register your interest below to reserve your custom build slot.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
            <input 
              type="email" 
              placeholder="Enter your contact email" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-4 text-xs focus:outline-none focus:border-purple-500 text-slate-800 placeholder-slate-400"
            />
            <button 
              onClick={() => navigate("/custom")}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-extrabold uppercase tracking-widest px-8 py-4.5 rounded-lg border border-purple-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              Consult My Builder
            </button>
          </div>
        </div>
      </section>

      {/* 9. DEEP DARK FOOTER */}
      <footer className="bg-slate-950 text-slate-355 border-t border-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-lg font-light tracking-[0.2em] text-slate-100 uppercase">
                White<span className="font-bold text-purple-500">Frame</span>
              </span>
              <span className="text-[8px] text-slate-500 uppercase tracking-[0.3em] -mt-0.5">Labs</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed font-light">
              Crafting extreme compute platforms, custom liquid-cooled loops, and silent high-end architectural systems. Handcrafted in Indonesia.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-slate-405 font-bold mb-4">Commissioning</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link to="/custom" className="hover:text-purple-400 transition-colors">Start Custom Commission</Link></li>
              <li><Link to="/catalog" className="hover:text-purple-400 transition-colors">Pre-Built Inventory</Link></li>
              <li>
                <a 
                  href="#process" 
                  onClick={(e) => handleScrollTo(e, "process")} 
                  className="hover:text-purple-400 transition-colors"
                >
                  Engineering Checklist
                </a>
              </li>
              <li>
                <a 
                  href="#simulator" 
                  onClick={(e) => handleScrollTo(e, "simulator")} 
                  className="hover:text-purple-400 transition-colors"
                >
                  Performance Calculator
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-slate-405 font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Quiet-tuned Workstations</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Studio Render Clusters</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Custom Room Theme Match</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Home Studio Solutions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-slate-405 font-bold mb-4">Secure Portal</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link to="/login" className="hover:text-purple-400 transition-colors">Client CRM Portal</Link></li>
              <li><Link to="/member" className="hover:text-purple-400 transition-colors">Order Fulfillment Logs</Link></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Engineering Live Feeds</a></li>
              <li><Link to="/dashboard" className="hover:text-purple-400 transition-colors">Executive Admin CRM</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 mt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-650 uppercase tracking-widest">
            &copy; 2026 WhiteFrame Labs. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest text-slate-650">
            <a href="#" className="hover:text-slate-450 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-455 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>

      {/* 10. INTERACTIVE DETAIL MODAL FOR SIGNATURE PCs */}
      {selectedPC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-305">
          <div 
            className="bg-white border border-slate-100 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-8 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPC(null)}
              className="absolute top-4 right-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 p-2 rounded-full z-10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              
              {/* Left Column: Image */}
              <div className="md:col-span-5 aspect-square md:aspect-auto md:h-full bg-slate-100 relative">
                <img 
                  src={selectedPC.image} 
                  alt={selectedPC.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent"></div>
              </div>

              {/* Right Column: Spec Sheets */}
              <div className="md:col-span-7 p-8 md:p-10 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">{selectedPC.id} // {selectedPC.meta.availability}</span>
                  </div>
                  <h3 className="text-2xl font-black italic uppercase text-slate-900">{selectedPC.name}</h3>
                  <p className="text-purple-650 text-lg font-bold">${selectedPC.price.toLocaleString()}</p>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-slate-450 font-bold">Hardware Blueprint</h4>
                  <div className="space-y-3">
                    <SpecDetailModal label="Processor (CPU)" val={selectedPC.specs.cpu} />
                    <SpecDetailModal label="Graphics Accelerator (GPU)" val={selectedPC.specs.gpu} />
                    <SpecDetailModal label="System Memory" val={selectedPC.specs.ram} />
                    <SpecDetailModal label="Thermal Block & Cooler" val={`${selectedPC.thermals.cooler} (${selectedPC.thermals.type} / ${selectedPC.thermals.fanCount} Fans)`} />
                    <SpecDetailModal label="Availability / Delivery Estimation" val={`${selectedPC.meta.availability} - Shipped in ${selectedPC.meta.buildTime}`} />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex gap-4">
                  <button 
                    onClick={() => {
                      setSelectedPC(null);
                      navigate("/custom");
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold uppercase tracking-widest py-4 rounded-lg transition-all text-center cursor-pointer hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    Custom Configure
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedPC(null);
                      navigate("/catalog");
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest py-4 rounded-lg transition-all text-center border border-slate-200 cursor-pointer"
                  >
                    Explore Similar
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponents
function SpecRow({ label, val, icon: Icon }) {
  return (
    <div className="flex gap-3 items-start p-1.5">
      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5 shadow-sm">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[8px] uppercase tracking-widest text-slate-450 font-bold">{label}</p>
        <p className="text-xs text-slate-700 mt-0.5 leading-relaxed font-semibold">{val}</p>
      </div>
    </div>
  );
}

function MetricBar({ label, score, themeColor }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
        <span>{label}</span>
        <span className="text-slate-700 font-bold">{score}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${themeColor} rounded-full transition-all duration-1000`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}

function SpecDetailModal({ label, val }) {
  return (
    <div>
      <p className="text-[8px] uppercase tracking-widest text-slate-450 font-bold">{label}</p>
      <p className="text-xs text-slate-700 font-semibold mt-0.5 leading-relaxed">{val}</p>
    </div>
  );
}
