import React, { useState } from 'react';
import { useFurniture } from '../context/FurnitureContext';
import {
  User,
  Package,
  Heart,
  MapPin,
  Compass,
  Clock,
  LogOut,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    orders,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    savedDesigns,
    recentlyViewed,
    setSelectedProductId,
    setTrackingOrderId,
    setCurrentView,
    userRole,
    setUserRole,
  } = useFurniture();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'designs' | 'addresses' | 'recent'>('orders');

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));
  const recentProducts = products.filter((p) => recentlyViewed.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Profile Banner */}
      <div className="bg-[#2C221E] rounded-3xl p-6 sm:p-8 text-white mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-[#2C221E] flex items-center justify-center font-serif text-2xl font-bold shadow-md">
            BP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold">Bhagyalakshmi P.</h1>
              <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-[#E7C19D] text-[#2C221E] font-bold">
                Gold Aura Member
              </span>
            </div>
            <p className="text-xs text-[#D8CFC8] font-light mt-0.5">
              panchadibhagyalakshmi@gmail.com · Member since 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setUserRole(userRole === 'admin' ? 'customer' : 'admin');
              if (userRole === 'customer') setCurrentView('admin');
            }}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#FAF8F5] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#E7C19D]" />
            <span>{userRole === 'admin' ? 'Open Admin Studio' : 'Admin Portal'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 pb-4 mb-8 border-b border-[#E8DFD8] overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#2C221E] text-white shadow-xs font-semibold'
              : 'bg-white text-[#5A4E47] border border-[#EDE5DF] hover:bg-[#FAF8F5]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'bg-[#2C221E] text-white shadow-xs font-semibold'
              : 'bg-white text-[#5A4E47] border border-[#EDE5DF] hover:bg-[#FAF8F5]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('designs')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'designs'
              ? 'bg-[#2C221E] text-white shadow-xs font-semibold'
              : 'bg-white text-[#5A4E47] border border-[#EDE5DF] hover:bg-[#FAF8F5]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Saved Room Designs ({savedDesigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'addresses'
              ? 'bg-[#2C221E] text-white shadow-xs font-semibold'
              : 'bg-white text-[#5A4E47] border border-[#EDE5DF] hover:bg-[#FAF8F5]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses (2)</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'recent'
              ? 'bg-[#2C221E] text-white shadow-xs font-semibold'
              : 'bg-white text-[#5A4E47] border border-[#EDE5DF] hover:bg-[#FAF8F5]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Recently Viewed</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EDE5DF] p-12 text-center">
              <Package className="w-10 h-10 text-[#8C7D73] mx-auto mb-2" />
              <p className="text-xs text-[#8C7D73]">No past orders found.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-[#EDE5DF] p-6 shadow-xs flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[#2C221E]">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-xs text-[#8C7D73]">
                      Placed on {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {ord.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {ord.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs bg-[#FAF8F5] p-2 rounded-xl border border-[#EDE5DF]">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-[#2C221E] line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-[#8C7D73]">Qty: {item.quantity} · {item.selectedColor}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between items-start md:items-end pt-4 md:pt-0 border-t md:border-t-0 border-[#F2ECE6]">
                  <div className="text-left md:text-right mb-4">
                    <span className="text-xs text-[#8C7D73] block">Total Amount</span>
                    <span className="text-base font-bold text-[#2C221E] tabular-nums">
                      ₹{ord.total.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setTrackingOrderId(ord.id);
                      setCurrentView('tracking');
                    }}
                    className="px-4 py-2 bg-[#2C221E] hover:bg-[#433731] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Track Order Progress</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EDE5DF] p-12 text-center">
              <Heart className="w-10 h-10 text-[#8C7D73] mx-auto mb-2" />
              <p className="text-xs text-[#8C7D73]">Your wishlist is currently empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((prod) => (
                <div key={prod.id} className="bg-white rounded-2xl border border-[#EDE5DF] overflow-hidden p-4 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#FAF8F5] mb-3">
                      <img src={prod.images[0]} alt={prod.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#8C6D58] uppercase">
                      {prod.category}
                    </span>
                    <h3
                      onClick={() => setSelectedProductId(prod.id)}
                      className="font-serif text-base font-semibold text-[#2C221E] hover:text-[#C27A4E] cursor-pointer mb-1 line-clamp-1"
                    >
                      {prod.name}
                    </h3>
                    <p className="text-xs font-bold text-[#2C221E] tabular-nums mb-3">
                      ₹{prod.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(prod)}
                      className="flex-1 py-2 bg-[#2C221E] hover:bg-[#433731] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="p-2 border border-[#EDE5DF] rounded-xl hover:bg-rose-50 text-rose-600 transition-colors"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. SAVED ROOM DESIGNS */}
      {activeTab === 'designs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {savedDesigns.map((des) => (
            <div key={des.id} className="bg-white rounded-2xl border border-[#EDE5DF] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#2C221E]">{des.name}</h3>
                  <p className="text-xs text-[#8C7D73]">
                    {des.roomType} · {des.dimensions.lengthFt}×{des.dimensions.widthFt} ft · {des.style}
                  </p>
                </div>
                <span className="text-sm font-bold text-[#2C221E] tabular-nums">
                  ₹{des.totalCost.toLocaleString()}
                </span>
              </div>

              {/* Items summary */}
              <div className="space-y-1.5 text-xs text-[#5A4E47]">
                <p className="font-semibold text-[11px] text-[#8C7D73] uppercase">Included Pieces:</p>
                {des.items.map((it, i) => (
                  <p key={i}>• {it.name} (₹{it.price.toLocaleString()})</p>
                ))}
              </div>

              {des.aiNotes && (
                <p className="text-[11px] text-[#7A6C63] bg-[#FAF8F5] p-3 rounded-xl border border-[#EDE5DF] italic">
                  "{des.aiNotes}"
                </p>
              )}

              <button
                onClick={() => setCurrentView('room-planner')}
                className="w-full py-2 bg-[#FAF8F5] hover:bg-[#F2ECE6] border border-[#D8CFC8] text-[#2C221E] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#8C6D58]" />
                <span>Open in 2D Planner Studio</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border-2 border-[#2C221E] p-6 shadow-xs relative">
            <span className="absolute top-4 right-4 text-[10px] font-bold text-white bg-[#2C221E] px-2 py-0.5 rounded">
              Default Delivery
            </span>
            <h4 className="font-bold text-sm text-[#2C221E] mb-1">Hyderabad Residence</h4>
            <p className="text-xs text-[#5A4E47] leading-relaxed">
              Bhagyalakshmi P.<br />
              Villa 14, Lotus Serenity Boulevard, Hitech City<br />
              Madhapur, Hyderabad, Telangana - 500081<br />
              Phone: +91 98765 43210
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#EDE5DF] p-6 shadow-xs">
            <h4 className="font-bold text-sm text-[#2C221E] mb-1">Bangalore Design Studio</h4>
            <p className="text-xs text-[#5A4E47] leading-relaxed">
              Bhagyalakshmi P.<br />
              Level 4, Indiranagar 100ft Road<br />
              Bangalore, Karnataka - 560038<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>
      )}

      {/* 5. RECENTLY VIEWED */}
      {activeTab === 'recent' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {recentProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProductId(p.id)}
              className="bg-white rounded-2xl border border-[#EDE5DF] p-4 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#FAF8F5] mb-2">
                <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#2C221E] line-clamp-1">{p.name}</h4>
                <p className="text-xs font-bold text-[#2C221E] tabular-nums">₹{p.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
