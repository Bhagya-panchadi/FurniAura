import React from 'react';
import { useFurniture } from '../context/FurnitureContext';
import { FurnitureCategory } from '../types/furniture';
import { Sparkles, ArrowRight, Shield, Truck, Compass, Armchair, Bed, UtensilsCrossed, Lamp, Sparkle, LayoutPanelLeft } from 'lucide-react';

const CATEGORIES: { label: FurnitureCategory; icon: any }[] = [
  { label: 'Sofas', icon: Armchair },
  { label: 'Beds', icon: Bed },
  { label: 'Chairs', icon: Armchair },
  { label: 'Tables', icon: UtensilsCrossed },
  { label: 'Wardrobes', icon: LayoutPanelLeft },
  { label: 'Lighting', icon: Lamp },
  { label: 'Home Decor', icon: Sparkle },
];

export const HomeHero: React.FC = () => {
  const { setCurrentView, setIsAiChatOpen, setSelectedCategory } = useFurniture();

  return (
    <section className="relative w-full">
      {/* Hero Visual Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="relative min-h-[520px] lg:min-h-[580px] rounded-3xl overflow-hidden shadow-xl flex items-center">
          {/* Hero Background Photography */}
          <img
            src="/src/assets/images/hero_living_room_1790604809160.jpg"
            alt="FurniAura Architectural Living Room"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Measured Contrast Scrim */}
          <div className="absolute inset-0 bg-linear-to-r from-[#1E1714]/85 via-[#1E1714]/60 to-transparent" />

          {/* Hero Copy & CTAs */}
          <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-12 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-[#F4EFEB] mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#E7C19D]" />
              <span>Aura AI Shopping Concierge & Room Studio</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.12] mb-6 text-balance">
              Transform Your Space with <span className="italic font-normal text-[#E7C19D]">FurniAura</span>
            </h1>

            <p className="text-sm sm:text-base text-[#E5DDD4] font-light leading-relaxed mb-8 max-w-xl">
              Architectural craftsmanship meets intelligent spatial design. Explore organic curves, solid white oak, and natural linen curated to bring timeless serenity to your sanctuary.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setCurrentView('catalog')}
                className="px-6 py-3.5 bg-white text-[#2C221E] text-sm font-semibold rounded-xl hover:bg-[#F5EFEB] transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAiChatOpen(true)}
                className="px-6 py-3.5 bg-[#C27A4E] hover:bg-[#B36B40] text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer border border-[#E7A67D]/30"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Ask AI Designer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Value Proposition Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#EDE5DF] shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#F7F3EE] flex items-center justify-center text-[#8C6D58] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#2C221E]">10-Year Timber Warranty</p>
              <p className="text-[11px] text-[#8C7D73]">Kiln-dried hardwood frames built for life</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#EDE5DF] shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#F7F3EE] flex items-center justify-center text-[#8C6D58] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#2C221E]">White-Glove Assembly</p>
              <p className="text-[11px] text-[#8C7D73]">Complimentary placement in your room of choice</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#EDE5DF] shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#F7F3EE] flex items-center justify-center text-[#8C6D58] shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#2C221E]">AI Spatial Planning</p>
              <p className="text-[11px] text-[#8C7D73]">2D room simulator & custom color schemes</p>
            </div>
          </div>
        </div>

        {/* Quick Category Navigation */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#2C221E]">
              Browse by Category
            </h2>
            <button
              onClick={() => setCurrentView('catalog')}
              className="text-xs font-semibold text-[#8C6D58] hover:text-[#2C221E] transition-colors cursor-pointer"
            >
              View All Categories →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {CATEGORIES.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setSelectedCategory(label);
                  setCurrentView('catalog');
                }}
                className="group flex flex-col items-center justify-center p-4 bg-white hover:bg-[#F5EFEB] rounded-2xl border border-[#EDE5DF] transition-all hover:-translate-y-0.5 hover:shadow-sm cursor-pointer text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] group-hover:bg-white flex items-center justify-center text-[#8C6D58] mb-2 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#2C221E] group-hover:text-[#8C6D58] transition-colors">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
