import React, { useState } from 'react';
import { FurnitureProvider, useFurniture } from './context/FurnitureContext';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { FeaturedCollections } from './components/FeaturedCollections';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuraAIChat } from './components/AuraAIChat';
import { RoomPlanner } from './components/RoomPlanner';
import { OrderTracker } from './components/OrderTracker';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentView } = useFurniture();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2C221E]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HomeHero />
            <FeaturedCollections />
          </>
        )}

        {currentView === 'catalog' && <ProductCatalog />}

        {currentView === 'room-planner' && <RoomPlanner />}

        {currentView === 'tracking' && <OrderTracker />}

        {currentView === 'dashboard' && <UserDashboard />}

        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Product Details Modal (PDP) */}
      <ProductDetailModal />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Floating Aura AI Shopping Concierge */}
      <AuraAIChat />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <FurnitureProvider>
      <AppContent />
    </FurnitureProvider>
  );
}
