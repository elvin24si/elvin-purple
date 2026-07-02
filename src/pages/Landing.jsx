// src/pages/Landing.jsx
import NewNavbar from "../components/NewNavbar";
import Hero from "../components/Hero";
import BudgetSlider from "../components/landing/BudgetSlider";
import SignatureShowcase from "../components/landing/SignatureShowcase";
import CatalogPreview from "../components/landing/CatalogPreview";
import PointsEconomy from "../components/landing/PointsEconomy";
import WorkProcess from "../components/landing/WorkProcess";
import CustomRequest from "../components/landing/CustomRequest";
import BottomCTA from "../components/landing/BottomCTA";

export default function Landing() {
  return (
    <div className="bg-[#08090C] text-[#EDECE7] min-h-screen font-sans antialiased overflow-x-hidden selection:bg-[#7C5CFC] selection:text-white">
      {/* Dynamic Font Imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .ff-display { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* Header Sticky Navbar */}
      <NewNavbar />

      {/* Hero Section */}
      <Hero />

      {/* 1. Dynamic Budget & Performance Estimator */}
      <BudgetSlider />

      {/* 2. Signature Series Showcase */}
      <SignatureShowcase />

      {/* 3. Curated Catalog Preview Grid */}
      <CatalogPreview />

      {/* 4. Points & Merch Economy ("Gamer Rewards") */}
      <PointsEconomy />

      {/* 5. Work Process Timeline */}
      <WorkProcess />

      {/* 6. Bespoke Builder Custom Consultation */}
      <CustomRequest />

      {/* 7. Bottom CTA & Footer */}
      <BottomCTA />
    </div>
  );
}