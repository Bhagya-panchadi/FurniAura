import React from 'react';
import { useFurniture } from '../context/FurnitureContext';
import { ShieldCheck, Truck, RotateCcw, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setIsAiChatOpen, userRole, setUserRole } = useFurniture();

  return (
    <footer className="bg-[#231B17] text-[#D8CFC8] border-t border-[#382E28] pt-14 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl text-white font-semibold tracking-tight">
              FurniAura
            </span>
            <p className="text-xs text-[#A89C92] leading-relaxed max-w-sm">
              Architectural craftsmanship rooted in mindful living. We design enduring solid oak tables, organic curved bouclé seating, and low-profile sanctuaries engineered for life.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-[#D8CFC8]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#C27A4E]" />
                10-Year Timber Warranty
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-[#C27A4E]" />
                White-Glove Placement
              </span>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Collection
            </h4>
            <ul className="space-y-2 text-xs text-[#A89C92]">
              <li>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Curved Sofas
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  White Oak Tables
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Linen Platform Beds
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  French Cane Chairs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Architectural Lighting
                </button>
              </li>
            </ul>
          </div>

          {/* Intelligent Studios */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              AI Design Studio
            </h4>
            <ul className="space-y-2 text-xs text-[#A89C92]">
              <li>
                <button
                  onClick={() => setCurrentView('room-planner')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  2D Room Layout Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAiChatOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E7C19D]" />
                  Aura AI Concierge
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('tracking')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Live Order Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Customer Sanctuary
                </button>
              </li>
            </ul>
          </div>

          {/* Admin & Operations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Management
            </h4>
            <ul className="space-y-2 text-xs text-[#A89C92]">
              <li>
                <button
                  onClick={() => {
                    setUserRole('admin');
                    setCurrentView('admin');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Merchant Admin Portal
                </button>
              </li>
              <li>
                <span className="text-[#7A6E64]">Status: Logistics Fleet Active</span>
              </li>
              <li>
                <span className="text-[#7A6E64]">All Timber FSC® Certified</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#382E28] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C7D73] gap-4">
          <p>© 2026 FurniAura Studio Inc. All rights reserved. Crafted with care for modern interiors.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Delivery & Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
