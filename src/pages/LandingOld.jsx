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
import { fetchPCCatalog, normalizePC } from "../lib/supabasepc";

/*
  DESIGN NOTE — drop your hero image in here.
  Put a file at /public/hero-rig.jpg (or change the path below) and the
  hero section will composite it under the dark gradient + grid overlay.
  Until then, it gracefully falls back to a pure gradient backdrop.
*/
const HERO_IMAGE_SRC = "/img/hero-rig.jpg";

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
    metrics: { ai: 98, render: 95, gaming: 88, silent: 82 },
    price: 74990000
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
    metrics: { ai: 62, render: 76, gaming: 99, silent: 92 },
    price: 35990000
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
    metrics: { ai: 88, render: 99, gaming: 94, silent: 80 },
    price: 52990000
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
    metrics: { ai: 70, render: 80, gaming: 86, silent: 99 },
    price: 28990000
  }
];

// Clean, professional steps
const PROCESS_STEPS = [
  {
    title: "Design Consultation",
    desc: "Outline your performance requirements, software ecosystem, and aesthetic preferences. We help select a template or draft a custom design.",
    icon: Terminal
  },
  {
    title: "Engineering Draft",
    desc: "We align your selected specs, custom cable configurations, power supplies, and thermal flow paths to optimize performance.",
    icon: Sliders
  },
  {
    title: "Handcrafted Assembly",
    desc: "Systems are hand-assembled inside our clean rooms. Custom cable lines are routed cleanly, and liquid tubes are aligned with artistic care.",
    icon: Cpu
  },
  {
    title: "Stress Testing & Verification",
    desc: "Every system undergoes 72 hours of continuous thermal stress tests and benchmark validation to ensure complete stability out of the box.",
    icon: Flame
  },
  {
    title: "Secure Crated Delivery",
    desc: "PCs are packed inside custom wooden crates with molded padding, then shipped via insured air freight. Fully plug-and-play.",
    icon: Truck
  }
];

export default function LandingOld() {
  const navigate = useNavigate();

  const [selectedPersona, setSelectedPersona] = useState(0);
  const [budgetSlider, setBudgetSlider] = useState(25000000);
  const [activeStep, setActiveStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [selectedPC, setSelectedPC] = useState(null);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 88;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const getSimulatorRecommendation = (budget) => {
    if (budget < 20000000) {
      return {
        tier: "Standard Core System",
        experience: "Optimized for fluid 1080p and 1440p gaming, office workloads, and home media.",
        gpu: "NVIDIA RTX 4060 / AMD RX 7600",
        cpu: "Intel i5 / AMD Ryzen 5",
        gamingFeel: "85 FPS · 1440p High",
        creationFeel: "Standard render speed",
        silentFeel: "Quiet operation",
        model: "STORM BREAKER",
        modelId: "PC-010"
      };
    } else if (budget < 30000000) {
      return {
        tier: "Professional Mid-Range System",
        experience: "Designed for high-frame rate 1440p gaming, 4K rendering, and fast file exports.",
        gpu: "NVIDIA RTX 4070 Super / AMD RX 7800 XT",
        cpu: "Intel i7 / AMD Ryzen 7",
        gamingFeel: "120 FPS · 1440p Ultra",
        creationFeel: "Fast video encoding",
        silentFeel: "Whisper-quiet fans",
        model: "NEBULA STRIKE",
        modelId: "PC-006"
      };
    } else if (budget < 45000000) {
      return {
        tier: "Signature Elite System",
        experience: "Excellent liquid-cooled design. Native 4K gaming and professional 3D workspace rendering.",
        gpu: "NVIDIA RTX 4080 Super / AMD RX 7900 XTX",
        cpu: "AMD Ryzen 7 7800X3D",
        gamingFeel: "75 FPS · Native 4K Ultra",
        creationFeel: "Accelerated 3D rendering",
        silentFeel: "Liquid-cooled silence",
        model: "SIGNATURE // MIYAKO",
        modelId: "SIG-004"
      };
    } else {
      return {
        tier: "Signature Flagship System",
        experience: "Ultimate performance design. Custom hardline liquid loop, premium layout, and peak compute power.",
        gpu: "NVIDIA RTX 4090 24GB Founders Edition",
        cpu: "AMD Ryzen 9 7950X3D",
        gamingFeel: "110 FPS · Native 4K Ultra RT",
        creationFeel: "Production-grade render",
        silentFeel: "Ultra-quiet liquid loop",
        model: "SIGNATURE // AYAKA",
        modelId: "SIG-001"
      };
    }
  };

  const simRec = getSimulatorRecommendation(budgetSlider);

  return (
    <div className="bg-[#08090C] text-[#EDECE7] min-h-screen font-sans antialiased overflow-x-clip selection:bg-[#7C5CFC] selection:text-white">
      {/* Fonts: industrial display + clean body + mono for specs/data */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .ff-display { font-family: 'Space Grotesk', sans-serif; }
        .ff-mono { font-family: 'JetBrains Mono', monospace; }
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* 1. HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#08090C]/90 backdrop-blur-md border-b border-white/[0.06] py-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center">
          <Link to="/" className="flex flex-col group">
            <h1 className="ff-display text-xl md:text-2xl font-medium tracking-[0.2em] text-[#EDECE7] uppercase transition-all duration-300 group-hover:text-[#A78BFA]">
              White<span className="font-bold text-[#A78BFA]">Frame</span>
            </h1>
            <p className="ff-mono text-[8px] text-[#6B6E76] uppercase tracking-[0.3em] -mt-0.5">Labs</p>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-[10px] font-medium uppercase tracking-[0.2em] text-[#9A9DA6]">
            <a href="#signature" onClick={(e) => handleScrollTo(e, "signature")} className="hover:text-[#A78BFA] transition-colors">
              Signature series
            </a>
            <a href="#explorer" onClick={(e) => handleScrollTo(e, "explorer")} className="hover:text-[#A78BFA] transition-colors">
              Rig Explorer
            </a>
            <a href="#simulator" onClick={(e) => handleScrollTo(e, "simulator")} className="hover:text-[#A78BFA] transition-colors">
              Benchmarks
            </a>
            <a href="#process" onClick={(e) => handleScrollTo(e, "process")} className="hover:text-[#A78BFA] transition-colors">
              Crafting process
            </a>
            <Link to="/guestCatalog" className="hover:text-[#A78BFA] transition-colors">
              Catalog
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-[10px] font-bold uppercase tracking-[0.15em] px-5 py-2.5 rounded-lg border border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#7C5CFC]/25 active:scale-95 cursor-pointer"
            >
              Login / Register
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO — image-backed, dark, blueprint-grid overlay */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE_SRC}
            alt=""
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            className="w-full h-full object-cover opacity-[0.55]"
          />
          {/* Base gradient fallback / mood layer — always present */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(124,92,252,0.16),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(217,119,87,0.10),transparent_50%)]"></div>
          {/* Depth gradient so text stays legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#08090C] via-[#08090C]/70 to-[#08090C]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-[#08090C]/40"></div>
        </div>

        {/* Blueprint grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,252,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,252,0.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_90%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center relative z-10 space-y-10">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span className="ff-mono text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-[#C9C2FF]">
              Bespoke system architecture, hand-assembled
            </span>
          </div>

          <div className="space-y-6">
            <h2 className="ff-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.05] max-w-5xl mx-auto text-[#F4F3EF]">
              Exquisite Custom Computers.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#7C5CFC] to-[#D97757]">
                Built for Peak Performance.
              </span>
            </h2>
            <p className="text-[#9A9DA6] text-sm md:text-base lg:text-lg font-light leading-relaxed max-w-3xl mx-auto">
              We design and hand-assemble breathtaking, high-performance computing systems. Specify your goals, select your layout style, and let our master technicians build your perfect PC.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link
              to="/guestCatalog"
              className="w-full sm:w-auto bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-5 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:shadow-[#7C5CFC]/25 active:scale-95 group cursor-pointer"
            >
              Explore Catalog
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Trust grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-16 border-t border-white/[0.07]">
            {[
              ["5-Year Warranty", "Premium parts protection"],
              ["Acoustic Tuning", "Whisper-quiet system runs"],
              ["Plug & Play", "Fully configured delivery"],
              ["Bespoke Design", "Matched to your setup style"]
            ].map(([title, sub]) => (
              <div key={title} className="p-5 rounded-xl bg-white/[0.025] border border-white/[0.07] backdrop-blur-sm">
                <p className="ff-display text-lg md:text-xl font-bold text-[#C9C2FF]">{title}</p>
                <p className="ff-mono text-[9px] uppercase tracking-widest text-[#6B6E76] mt-1.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
          <span className="ff-mono text-[8px] uppercase tracking-[0.3em] text-[#6B6E76]">Scroll</span>
          <div className="w-1.5 h-6 rounded-full border border-white/20 flex items-start justify-center p-0.5">
            <div className="w-0.5 h-1.5 rounded-full bg-[#A78BFA]"></div>
          </div>
        </div>
      </section>

      {/* 3. RIG EXPLORER */}
      <section id="explorer" className="py-24 border-t border-white/[0.06] bg-[#0B0C10] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-16 text-center md:text-left">
            <p className="ff-mono text-[10px] text-[#A78BFA] tracking-[0.3em] uppercase mb-3">Interactive Workspace</p>
            <h2 className="ff-display text-3xl font-bold uppercase tracking-tight text-[#F4F3EF]">Find Your Hardware Profile</h2>
            <p className="text-[#9A9DA6] text-sm mt-3 max-w-2xl leading-relaxed">
              We design specialized rigs matching different workloads. Select a profile below to explore component specifications and performance curves.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {PERSONAS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPersona(idx)}
                    className={`w-full text-left p-6 rounded-xl border transition-all duration-300 flex items-start justify-between group cursor-pointer ${
                      selectedPersona === idx
                        ? "bg-white/[0.04] border-[#7C5CFC]/40 shadow-lg shadow-[#7C5CFC]/5 translate-x-1"
                        : "bg-white/[0.015] border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="space-y-1">
                      <h3 className={`ff-display text-base font-semibold transition-colors ${
                        selectedPersona === idx ? "text-[#C9C2FF]" : "text-[#EDECE7] group-hover:text-[#C9C2FF]"
                      }`}>
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#8A8D96] line-clamp-1">{p.tagline}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-[#6B6E76] transition-transform ${
                      selectedPersona === idx ? "text-[#A78BFA] translate-x-1" : "group-hover:translate-x-0.5"
                    }`} />
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-xl bg-white/[0.025] border border-white/[0.07] flex items-center justify-between">
                <div>
                  <p className="ff-mono text-[9px] uppercase tracking-widest text-[#6B6E76]">Estimated Cost</p>
                  <p className="ff-mono text-2xl font-bold text-[#C9C2FF] mt-1">
                    Rp {PERSONAS[selectedPersona].price.toLocaleString('id-ID')}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-4 rounded-lg flex items-center gap-2 transition-all cursor-pointer hover:shadow-lg hover:shadow-[#7C5CFC]/20"
                >
                  Configure Profile <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl bg-white/[0.02] border border-white/[0.07] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-1/4 -right-1/4 w-80 h-80 rounded-full blur-[100px] opacity-60 pointer-events-none bg-[#7C5CFC]/20"></div>

              <div className="space-y-8 relative z-10">
                <div className="space-y-3">
                  <div className="inline-flex rounded-full border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 px-3 py-1 text-[9px] uppercase font-bold tracking-widest text-[#C9C2FF] ff-mono">
                    System Specifications
                  </div>
                  <h3 className="ff-display text-2xl font-bold uppercase text-[#F4F3EF]">{PERSONAS[selectedPersona].name}</h3>
                  <p className="text-[#9A9DA6] text-sm leading-relaxed">{PERSONAS[selectedPersona].tagline}</p>
                </div>

                <div className="border-t border-b border-white/[0.07] py-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SpecRow label="Processor (CPU)" val={PERSONAS[selectedPersona].specs.cpu} icon={Cpu} />
                    <SpecRow label="Graphics (GPU)" val={PERSONAS[selectedPersona].specs.gpu} icon={Monitor} />
                    <SpecRow label="Memory (RAM)" val={PERSONAS[selectedPersona].specs.ram} icon={Layers} />
                    <SpecRow label="Storage (SSD)" val={PERSONAS[selectedPersona].specs.storage} icon={Terminal} />
                  </div>
                  <div className="pt-2 border-t border-white/[0.07]">
                    <SpecRow label="Liquid Cooling & Thermals" val={PERSONAS[selectedPersona].specs.cooling} icon={Flame} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="ff-mono text-[10px] uppercase tracking-widest text-[#6B6E76]">Simulated Load Ratings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <MetricBar label="AI Compute (Tensor Workload)" score={PERSONAS[selectedPersona].metrics.ai} />
                    <MetricBar label="Real-time 3D Rendering" score={PERSONAS[selectedPersona].metrics.render} />
                    <MetricBar label="Gaming Frame Rate Stability" score={PERSONAS[selectedPersona].metrics.gaming} />
                    <MetricBar label="Thermal Silence Index" score={PERSONAS[selectedPersona].metrics.silent} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENCHMARK SIMULATOR */}
      <section id="simulator" className="py-24 bg-[#08090C] border-t border-white/[0.06] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <p className="ff-mono text-[10px] text-[#A78BFA] tracking-[0.3em] uppercase">Interactive Estimator</p>
                <h2 className="ff-display text-3xl font-bold uppercase tracking-tight text-[#F4F3EF]">Benchmark Simulator</h2>
                <p className="text-[#9A9DA6] text-sm leading-relaxed">
                  Drag the slider to choose your target budget. The simulator dynamically estimates graphics performance, CPU benchmarks, and recommends the corresponding WhiteFrame build.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-white/[0.025] border border-white/[0.07] space-y-6">
                <div className="flex justify-between items-center">
                  <span className="ff-mono text-xs uppercase tracking-widest text-[#9A9DA6]">Target Budget</span>
                  <span className="ff-mono text-2xl font-bold text-[#F4F3EF] tabular-nums">Rp {budgetSlider.toLocaleString('id-ID')}</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="15000000"
                    max="75000000"
                    step="1000000"
                    value={budgetSlider}
                    onChange={(e) => setBudgetSlider(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7C5CFC] focus:outline-none"
                  />
                  <div className="flex justify-between ff-mono text-[9px] uppercase tracking-widest text-[#6B6E76]">
                    <span>Rp 15jt Core</span>
                    <span>Rp 45jt Elite</span>
                    <span>Rp 75jt Ultimate</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/[0.07] space-y-3">
                  <p className="ff-mono text-[9px] uppercase tracking-widest text-[#6B6E76]">Recommended Configuration</p>
                  <div className="flex justify-between items-center bg-white/[0.03] p-4 border border-white/[0.07] rounded-lg">
                    <div>
                      <h4 className="ff-display text-sm font-bold text-[#C9C2FF] uppercase tracking-wide">{simRec.model}</h4>
                      <p className="ff-mono text-[10px] text-[#6B6E76] uppercase mt-0.5">{simRec.tier}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/login`)}
                      className="text-[9px] font-bold uppercase tracking-widest text-[#EDECE7] bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-4 py-2 rounded transition-all cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white/[0.02] border border-white/[0.07] rounded-2xl p-8 md:p-10 space-y-8">
              <h3 className="ff-display text-xl font-bold uppercase tracking-wider text-[#F4F3EF] flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#A78BFA]" />
                Performance Estimations
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[#9A9DA6]">Gaming Performance (4K Ultra Presets)</span>
                    <span className="ff-mono text-[#C9C2FF] font-bold">{simRec.gamingFeel}</span>
                  </div>
                  <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7C5CFC] transition-all duration-500 rounded-full"
                      style={{ width: budgetSlider < 27000000 ? "40%" : budgetSlider < 45000000 ? "70%" : budgetSlider < 68000000 ? "90%" : "100%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[#9A9DA6]">Creative Production & Export Speed</span>
                    <span className="ff-mono text-[#C9C2FF] font-bold">{simRec.creationFeel}</span>
                  </div>
                  <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#A78BFA] transition-all duration-500 rounded-full"
                      style={{ width: budgetSlider < 27000000 ? "35%" : budgetSlider < 45000000 ? "65%" : budgetSlider < 68000000 ? "85%" : "100%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-[#9A9DA6]">Thermal Silence & Acoustic Index</span>
                    <span className="ff-mono text-[#C9C2FF] font-bold">{simRec.silentFeel}</span>
                  </div>
                  <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#D97757] transition-all duration-500 rounded-full"
                      style={{ width: budgetSlider < 27000000 ? "50%" : budgetSlider < 45000000 ? "75%" : budgetSlider < 68000000 ? "90%" : "100%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.07] grid grid-cols-2 gap-6">
                <div>
                  <p className="ff-mono text-[8px] uppercase tracking-widest text-[#6B6E76]">Estimated GPU footprint</p>
                  <p className="text-xs text-[#EDECE7] font-semibold mt-1">{simRec.gpu}</p>
                </div>
                <div>
                  <p className="ff-mono text-[8px] uppercase tracking-widest text-[#6B6E76]">Estimated CPU footprint</p>
                  <p className="text-xs text-[#EDECE7] font-semibold mt-1">{simRec.cpu}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SIGNATURE SERIES */}
      <section id="signature" className="py-24 border-t border-white/[0.06] bg-[#0B0C10] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-16 text-center">
            <p className="ff-mono text-[10px] text-[#A78BFA] tracking-[0.3em] uppercase mb-3">Premium Masterpieces</p>
            <h2 className="ff-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F4F3EF]">The Signature Series</h2>
            <p className="text-[#9A9DA6] text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
              Every Signature system is a numbered custom build featuring custom liquid loops, precise cable routing, and matching desktop aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {signaturePCs.map((pc) => (
              <div
                key={pc.id}
                className="group cursor-pointer flex flex-col bg-white/[0.02] border border-white/[0.07] rounded-xl overflow-hidden hover:border-[#7C5CFC]/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#7C5CFC]/10"
                onClick={() => setSelectedPC(pc)}
              >
                <div className="aspect-[4/5] bg-white/[0.03] overflow-hidden relative border-b border-white/[0.07]">
                  <img
                    src={pc.image}
                    alt={pc.name}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#08090C]/80 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 ff-mono text-[8px] uppercase tracking-widest text-[#C9C2FF]">
                    {pc.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h3 className="ff-display text-sm font-bold text-[#EDECE7] uppercase tracking-wide group-hover:text-[#C9C2FF] transition-colors line-clamp-1">
                        {pc.name}
                      </h3>
                      <span className="ff-mono text-xs font-bold text-[#D97757] tabular-nums">
                        Rp {pc.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="ff-mono text-[9px] text-[#6B6E76] uppercase tracking-[0.2em] font-medium flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-[#6B6E76]" />
                      {pc.specs.cpu.split(" ")[0]} {pc.specs.cpu.split(" ")[1] || ""} | {pc.specs.gpu.split(" ")[1] || "RTX"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#A78BFA] group-hover:text-[#C9C2FF] pt-2 border-t border-white/[0.07]">
                    <span>Explore Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PROCESS TIMELINE */}
      <section id="process" className="py-24 bg-[#08090C] border-t border-white/[0.06] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-16 text-center">
            <p className="ff-mono text-[10px] text-[#A78BFA] tracking-[0.3em] uppercase mb-3">Our Workflow</p>
            <h2 className="ff-display text-3xl font-bold uppercase tracking-tight text-[#F4F3EF]">The Commission Process</h2>
            <p className="text-[#9A9DA6] text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
              Every system is custom-designed, optimized, and verified to ensure maximum performance. Here is how we build your custom computer.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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
                        ? "bg-white/[0.04] border-[#7C5CFC]/30 translate-x-2"
                        : "bg-transparent border-transparent hover:bg-white/[0.02] hover:translate-x-1"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                      isSelected
                        ? "bg-[#7C5CFC] border-[#7C5CFC] text-white"
                        : "bg-white/[0.03] border-white/[0.08] text-[#6B6E76]"
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="ff-mono text-[9px] uppercase tracking-widest text-[#6B6E76]">Phase 0{idx + 1}</span>
                      <h4 className={`ff-display text-sm font-bold uppercase tracking-wide transition-colors ${
                        isSelected ? "text-[#C9C2FF]" : "text-[#9A9DA6]"
                      }`}>{step.title}</h4>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 rounded-2xl bg-white/[0.02] border border-white/[0.07] p-8 md:p-10 min-h-[300px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 ff-display text-8xl font-bold text-white/[0.03] select-none pointer-events-none">
                0{activeStep + 1}
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#A78BFA] animate-ping"></span>
                  <p className="ff-mono text-[10px] uppercase tracking-[0.25em] text-[#A78BFA]">Commission Stage</p>
                </div>

                <h3 className="ff-display text-2xl font-bold uppercase text-[#F4F3EF]">
                  {PROCESS_STEPS[activeStep].title}
                </h3>

                <p className="text-[#9A9DA6] text-sm md:text-base leading-relaxed max-w-xl font-light">
                  {PROCESS_STEPS[activeStep].desc}
                </p>
              </div>

              <div className="pt-8 border-t border-white/[0.07] flex items-center justify-between">
                <div className="flex gap-1.5">
                  {PROCESS_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        activeStep === idx ? "w-8 bg-[#7C5CFC]" : "w-2 bg-white/10"
                      }`}
                    ></div>
                  ))}
                </div>
                <Link
                  to="/custom"
                  className="text-[9px] font-bold uppercase tracking-widest text-[#A78BFA] hover:text-[#C9C2FF] flex items-center gap-1.5"
                >
                  Initiate Commission <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VALUE PROPS */}
      <section className="py-24 border-t border-white/[0.06] relative bg-[#0B0C10]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              [ShieldCheck, "5-Year Premium Warranty", "Every custom system carries a fully transferrable 5-year warranty on all physical parts and fluid connections. Hardware logs are maintained in our private database registry."],
              [CheckCircle2, "Full Configuration Setup", "We pre-load all necessary system drivers, optimize operating systems, and perform complete hardware validations. Your PC arrives fully plug-and-play."],
              [HelpCircle, "Concierge Support", "Direct access to the technician who built your computer. We provide real-time diagnostic checks, hardware consultations, and custom cooling loop logs."]
            ].map(([Icon, title, body]) => (
              <div key={title} className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/25 flex items-center justify-center text-[#A78BFA]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="ff-display text-lg font-bold uppercase tracking-wide text-[#F4F3EF]">{title}</h3>
                <p className="text-[#9A9DA6] text-xs leading-relaxed font-light">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="py-24 border-t border-white/[0.06] relative bg-[#08090C]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="ff-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F4F3EF] leading-tight">
            Ready to design your custom computer?
          </h2>
          <p className="text-[#9A9DA6] text-sm max-w-2xl mx-auto leading-relaxed font-light">
            We limit assembly slots to 15 builds per month to maintain craftsmanship. Login and tell us your interest or needs below to reserve your custom build slot.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto pt-4">
          
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-[10px] font-extrabold uppercase tracking-widest px-8 py-4.5 rounded-lg border border-white/10 transition-all cursor-pointer whitespace-nowrap"
            >
              Consult My Builder
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-[#050608] text-[#7C7F88] border-t border-white/[0.06] py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="ff-display text-lg font-medium tracking-[0.2em] text-[#EDECE7] uppercase">
                White<span className="font-bold text-[#A78BFA]">Frame</span>
              </span>
              <span className="ff-mono text-[8px] text-[#5A5D65] uppercase tracking-[0.3em] -mt-0.5">Labs</span>
            </div>
            <p className="text-[#6B6E76] text-xs leading-relaxed font-light">
              Crafting extreme compute platforms, custom liquid-cooled loops, and silent high-end architectural systems. Handcrafted in Indonesia.
            </p>
          </div>

          <div>
            <h4 className="ff-mono text-[10px] uppercase tracking-widest text-[#5A5D65] font-bold mb-4">Commissioning</h4>
            <ul className="space-y-2 text-xs text-[#8A8D96]">
              <li><Link to="/login" className="hover:text-[#A78BFA] transition-colors">Start Custom Commission</Link></li>
              <li><Link to="/login" className="hover:text-[#A78BFA] transition-colors">Pre-Built Inventory</Link></li>
              <li><a href="#process" onClick={(e) => handleScrollTo(e, "process")} className="hover:text-[#A78BFA] transition-colors">Engineering Checklist</a></li>
              <li><a href="#simulator" onClick={(e) => handleScrollTo(e, "simulator")} className="hover:text-[#A78BFA] transition-colors">Performance Calculator</a></li>
            </ul>
          </div>

          <div>
            <h4 className="ff-mono text-[10px] uppercase tracking-widest text-[#5A5D65] font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-xs text-[#8A8D96]">
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Quiet-tuned Workstations</a></li>
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Studio Render Clusters</a></li>
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Custom Room Theme Match</a></li>
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Home Studio Solutions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="ff-mono text-[10px] uppercase tracking-widest text-[#5A5D65] font-bold mb-4">Secure Portal</h4>
            <ul className="space-y-2 text-xs text-[#8A8D96]">
              <li><Link to="/login" className="hover:text-[#A78BFA] transition-colors">Client CRM Portal</Link></li>
              <li><Link to="/member" className="hover:text-[#A78BFA] transition-colors">Order Fulfillment Logs</Link></li>
              <li><a href="#" className="hover:text-[#A78BFA] transition-colors">Engineering Live Feeds</a></li>
              <li><Link to="/dashboard" className="hover:text-[#A78BFA] transition-colors">Executive Admin CRM</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 mt-12 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="ff-mono text-[10px] text-[#5A5D65] uppercase tracking-widest">
            &copy; 2026 WhiteFrame Labs. All Rights Reserved.
          </p>
          <div className="flex gap-6 ff-mono text-[10px] uppercase tracking-widest text-[#5A5D65]">
            <a href="#" className="hover:text-[#8A8D96] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#8A8D96] transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>

      {/* 10. SIGNATURE PC DETAIL MODAL */}
      {selectedPC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="bg-[#0E0F13] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-8 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPC(null)}
              className="absolute top-4 right-4 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[#9A9DA6] hover:text-[#EDECE7] p-2 rounded-full z-10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 aspect-square md:aspect-auto md:h-full bg-white/[0.03] relative">
                <img src={selectedPC.image} alt={selectedPC.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>

              <div className="md:col-span-7 p-8 md:p-10 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="ff-mono text-[8px] uppercase tracking-widest text-[#6B6E76]">{selectedPC.id} // {selectedPC.meta.availability}</span>
                  </div>
                  <h3 className="ff-display text-2xl font-bold uppercase text-[#F4F3EF]">{selectedPC.name}</h3>
                  <p className="ff-mono text-[#D97757] text-lg font-bold">Rp.{selectedPC.price.toLocaleString()}</p>
                </div>

                <div className="border-t border-white/[0.07] pt-6 space-y-4">
                  <h4 className="ff-mono text-[10px] uppercase tracking-widest text-[#6B6E76]">Hardware Blueprint</h4>
                  <div className="space-y-3">
                    <SpecDetailModal label="Processor (CPU)" val={selectedPC.specs.cpu} />
                    <SpecDetailModal label="Graphics Accelerator (GPU)" val={selectedPC.specs.gpu} />
                    <SpecDetailModal label="System Memory" val={selectedPC.specs.ram} />
                    <SpecDetailModal label="Thermal Block & Cooler" val={`${selectedPC.thermals.cooler} (${selectedPC.thermals.type} / ${selectedPC.thermals.fanCount} Fans)`} />
                    <SpecDetailModal label="Availability" val={`${selectedPC.meta.availability}`} />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/[0.07] flex gap-4">
                  <button
                    onClick={() => { setSelectedPC(null); navigate("/login"); }}
                    className="flex-1 bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-[10px] font-bold uppercase tracking-widest py-4 rounded-lg transition-all text-center cursor-pointer hover:shadow-lg hover:shadow-[#7C5CFC]/20"
                  >
                    Custom Configure
                  </button>
                  <button
                    onClick={() => { setSelectedPC(null); navigate("/guestCatalog"); }}
                    className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-[#EDECE7] text-[10px] font-bold uppercase tracking-widest py-4 rounded-lg transition-all text-center border border-white/10 cursor-pointer"
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
      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#A78BFA] shrink-0 mt-0.5">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="ff-mono text-[8px] uppercase tracking-widest text-[#6B6E76]">{label}</p>
        <p className="text-xs text-[#EDECE7] mt-0.5 leading-relaxed font-semibold">{val}</p>
      </div>
    </div>
  );
}

function MetricBar({ label, score }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-semibold text-[#9A9DA6]">
        <span>{label}</span>
        <span className="ff-mono text-[#EDECE7] font-bold">{score}%</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#7C5CFC] to-[#A78BFA] rounded-full transition-all duration-1000"
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}

function SpecDetailModal({ label, val }) {
  return (
    <div>
      <p className="ff-mono text-[8px] uppercase tracking-widest text-[#6B6E76]">{label}</p>
      <p className="text-xs text-[#EDECE7] font-semibold mt-0.5 leading-relaxed">{val}</p>
    </div>
  );
}