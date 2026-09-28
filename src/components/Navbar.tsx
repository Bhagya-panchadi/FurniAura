import React, { useState } from 'react';
import { useFurniture } from '../context/FurnitureContext';
import {
  ShoppingBag,
  Heart,
  Sparkles,
  Search,
  LayoutGrid,
  User,
  ShieldCheck,
  PackageCheck,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cart,
    wishlist,
    setIsCartOpen,
    setIsAiChatOpen,
    searchQuery,
    setSearchQuery,
    userRole,
    setUserRole,
  } = useFurniture();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[#2C221E] hover:opacity-90 transition-opacity text-left whitespace-nowrap cursor-pointer"
        >
          FurniAura
        </button>

        {/* Zone 2: Clean 4-5 text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A4E47]">
          <button
            onClick={() => setCurrentView('catalog')}
            className={`transition-colors hover:text-[#2C221E] cursor-pointer ${
              currentView === 'catalog' ? 'text-[#2C221E] font-semibold underline underline-offset-8 decoration-[#C27A4E]' : ''
            }`}
          >
            Collection
          </button>
          <button
            onClick={() => setCurrentView('room-planner')}
            className={`flex items-center gap-1.5 transition-colors hover:text-[#2C221E] cursor-pointer ${
              currentView === 'room-planner' ? 'text-[#2C221E] font-semibold underline underline-offset-8 decoration-[#C27A4E]' : ''
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-[#C27A4E]" />
            Room Planner
          </button>
          <button
            onClick={() => setIsAiChatOpen(true)}
            className="flex items-center gap-1.5 text-[#C27A4E] hover:text-[#A8643B] transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Aura AI
          </button>
          <button
            onClick={() => setCurrentView('tracking')}
            className={`transition-colors hover:text-[#2C221E] cursor-pointer ${
              currentView === 'tracking' ? 'text-[#2C221E] font-semibold underline underline-offset-8 decoration-[#C27A4E]' : ''
            }`}
          >
            Order Tracking
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`transition-colors hover:text-[#2C221E] cursor-pointer ${
              currentView === 'dashboard' ? 'text-[#2C221E] font-semibold underline underline-offset-8 decoration-[#C27A4E]' : ''
            }`}
          >
            Dashboard
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions & affordances */}
        <div className="flex items-center gap-3">
          {/* Search Trigger / Input */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center bg-white border border-[#D8CFC8] rounded-full px-3 py-1.5 shadow-xs w-48 sm:w-64 transition-all">
                <Search className="w-4 h-4 text-[#8C7D73] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search sofa, oak table..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentView !== 'catalog') setCurrentView('catalog');
                  }}
                  autoFocus
                  className="w-full text-xs text-[#2C221E] bg-transparent outline-hidden"
                />
                <button
                  onClick={() => setShowSearchInput(false)}
                  className="text-xs text-[#8C7D73] hover:text-[#2C221E] ml-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                aria-label="Search"
                className="p-2 text-[#5A4E47] hover:text-[#2C221E] rounded-full hover:bg-[#F2ECE6] transition-colors cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => setCurrentView('dashboard')}
            aria-label="Wishlist"
            className="relative p-2 text-[#5A4E47] hover:text-[#2C221E] rounded-full hover:bg-[#F2ECE6] transition-colors cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C27A4E] text-white text-[10px] font-semibold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
            className="relative p-2 text-[#5A4E47] hover:text-[#2C221E] rounded-full hover:bg-[#F2ECE6] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#2C221E] text-white text-[10px] font-semibold flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Role Switcher Pill for Testing Admin Features */}
          <button
            onClick={() => {
              if (userRole === 'customer') {
                setUserRole('admin');
                setCurrentView('admin');
              } else {
                setUserRole('customer');
                setCurrentView('home');
              }
            }}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
              userRole === 'admin'
                ? 'bg-[#2C221E] text-white shadow-xs'
                : 'bg-[#EFE9E2] text-[#5A4E47] hover:bg-[#E5DDD4]'
            }`}
            title="Toggle between Customer Storefront and Admin Studio"
          >
            {userRole === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-[#E7C19D]" />
                <span>Admin Studio</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-[#8C7D73]" />
                <span>Admin Portal</span>
              </>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#5A4E47] hover:text-[#2C221E] cursor-pointer"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E8DFD8] px-4 py-4 space-y-3">
          <button
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#2C221E]"
          >
            Home
          </button>
          <button
            onClick={() => {
              setCurrentView('catalog');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#2C221E]"
          >
            Collection
          </button>
          <button
            onClick={() => {
              setCurrentView('room-planner');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#2C221E]"
          >
            AI Room Planner
          </button>
          <button
            onClick={() => {
              setIsAiChatOpen(true);
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#C27A4E]"
          >
            Ask Aura AI
          </button>
          <button
            onClick={() => {
              setCurrentView('tracking');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#2C221E]"
          >
            Order Tracking
          </button>
          <button
            onClick={() => {
              setCurrentView('dashboard');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#2C221E]"
          >
            User Dashboard
          </button>
          <div className="pt-2 border-t border-[#E8DFD8]">
            <button
              onClick={() => {
                setUserRole(userRole === 'admin' ? 'customer' : 'admin');
                setCurrentView(userRole === 'admin' ? 'home' : 'admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#8C7D73] font-medium"
            >
              Mode: {userRole === 'admin' ? 'Admin Active' : 'Switch to Admin Portal'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
