import React, { useState } from 'react';
import { useFurniture } from '../context/FurnitureContext';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

export const FeaturedCollections: React.FC = () => {
  const { products, setCurrentView, setSelectedCategory, setIsAiChatOpen } = useFurniture();
  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'new' | 'offers'>('featured');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'featured') return p.isFeatured;
    if (activeTab === 'bestsellers') return p.isBestseller;
    if (activeTab === 'new') return p.isNewArrival;
    if (activeTab === 'offers') return p.discountPercentage >= 15;
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Section Header & Segmented Tab Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6D58] uppercase tracking-wider mb-1.5">
            <span>Curated Sanctuaries</span>
            <span aria-hidden="true">·</span>
            <span>2026 Collection</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C221E]">
            Signature Living Pieces
          </h2>
        </div>

        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-[#EFE9E2] rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'featured'
                ? 'bg-white text-[#2C221E] shadow-xs font-semibold'
                : 'text-[#6F6057] hover:text-[#2C221E]'
            }`}
          >
            Featured Pieces
          </button>
          <button
            onClick={() => setActiveTab('bestsellers')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'bestsellers'
                ? 'bg-white text-[#2C221E] shadow-xs font-semibold'
                : 'text-[#6F6057] hover:text-[#2C221E]'
            }`}
          >
            Bestsellers
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'new'
                ? 'bg-white text-[#2C221E] shadow-xs font-semibold'
                : 'text-[#6F6057] hover:text-[#2C221E]'
            }`}
          >
            New Arrivals
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'offers'
                ? 'bg-white text-[#2C221E] shadow-xs font-semibold'
                : 'text-[#6F6057] hover:text-[#2C221E]'
            }`}
          >
            Special Offers
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Editorial Room Planner Banner */}
      <div className="mt-16 bg-[#2C221E] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-[#E7C19D] mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive 2D Spatial Studio</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-4xl font-medium mb-3">
            Design Your Room Before You Buy
          </h3>
          <p className="text-sm text-[#D8CFC8] leading-relaxed mb-6 font-light">
            Input your room dimensions, experiment with furniture placement on a live 2D grid, and get real-time spatial advice from Aura AI.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('room-planner')}
              className="px-5 py-3 bg-[#C27A4E] hover:bg-[#B36B40] text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Launch Room Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAiChatOpen(true)}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-[#FAF8F5] text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#E7C19D]" />
              <span>Ask AI Advice</span>
            </button>
          </div>
        </div>

        <div className="w-full md:w-80 aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-white/10 shrink-0">
          <img
            src="/src/assets/images/boucle_curve_sofa_1790604819882.jpg"
            alt="Room Design Preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};
