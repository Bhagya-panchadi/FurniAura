import React, { useState } from 'react';
import { useFurniture } from '../context/FurnitureContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  ShoppingBag,
} from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    setCurrentView,
  } = useFurniture();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const success = applyCoupon(couponInput);
    if (!success) {
      setCouponError(true);
    } else {
      setCouponError(false);
      setCouponInput('');
    }
  };

  const shippingFee = cartSubtotal >= 15000 || cartSubtotal === 0 ? 0 : 999;
  const estDeliveryDate = new Date();
  estDeliveryDate.setDate(estDeliveryDate.getDate() + 4);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#EDE5DF] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E8DFD8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8C6D58]" />
            <h2 className="font-serif text-lg font-semibold text-[#2C221E]">
              Your Shopping Bag ({cart.reduce((t, i) => t + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#8C7D73] hover:text-[#2C221E] rounded-full hover:bg-[#F2ECE6] transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F2ECE6] flex items-center justify-center text-[#8C7D73]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#2C221E]">
                Your bag is currently empty
              </h3>
              <p className="text-xs text-[#8C7D73] max-w-xs">
                Explore our handcrafted seating, solid oak tables, and architectural accessories to begin furnishing your space.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentView('catalog');
                }}
                className="px-6 py-3 bg-[#2C221E] text-white text-xs font-semibold rounded-xl hover:bg-[#433731] transition-colors cursor-pointer"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 bg-white rounded-2xl border border-[#EDE5DF] shadow-2xs"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover bg-[#FAF8F5] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold text-[#2C221E] leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8C7D73] hover:text-rose-600 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#8C7D73] mt-0.5">
                        Finish: {item.selectedColor.name}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#D8CFC8] rounded-lg bg-[#FAF8F5]">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-[#5A4E47] hover:bg-[#EFE9E2] rounded-l-md transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#2C221E] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-[#5A4E47] hover:bg-[#EFE9E2] rounded-r-md transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#2C221E] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Window Callout */}
              <div className="p-3 bg-[#FAF5F0] rounded-xl border border-[#E7C19D]/50 text-xs text-[#6F6057] flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#C27A4E] shrink-0" />
                <span>
                  Estimated White-Glove Delivery by{' '}
                  <strong className="text-[#2C221E]">{estDeliveryDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Coupon Code & Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E8DFD8] space-y-4 shadow-lg">
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#FAF0E8] border border-[#E7A67D]/40 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-[#C27A4E] font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon '{appliedCoupon}' applied (-₹{couponDiscount.toLocaleString()})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-[#8C6D58] hover:text-[#2C221E] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. AURA10, LUXE15)"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      setCouponError(false);
                    }}
                    className="flex-1 text-xs px-3 py-2 bg-[#FAF8F5] border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden focus:border-[#2C221E] uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2C221E] text-white text-xs font-semibold rounded-xl hover:bg-[#433731] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 mt-1">
                  Invalid coupon. Try <strong>AURA10</strong> or <strong>LUXE15</strong>.
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#6F6057] pt-2 border-t border-[#F2ECE6]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2C221E] tabular-nums">
                  ₹{cartSubtotal.toLocaleString()}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#C27A4E]">
                  <span>Discount</span>
                  <span className="font-semibold tabular-nums">-₹{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>White-Glove Delivery</span>
                <span className="font-semibold tabular-nums">
                  {shippingFee === 0 ? <span className="text-emerald-700">Free</span> : `₹${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-semibold text-[#2C221E] tabular-nums">
                  ₹{Math.round((cartSubtotal - couponDiscount) * 0.05).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#2C221E] pt-2 border-t border-[#F2ECE6]">
                <span>Total Amount</span>
                <span className="tabular-nums">₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onOpenCheckout();
              }}
              className="w-full py-3.5 bg-[#2C221E] hover:bg-[#433731] text-white text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
