import React, { useState } from 'react';
import { useFurniture } from '../context/FurnitureContext';
import { Order, DeliveryAddress } from '../types/furniture';
import {
  X,
  CheckCircle2,
  CreditCard,
  QrCode,
  Banknote,
  Truck,
  ShieldCheck,
  Building,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    appliedCoupon,
    couponDiscount,
    createOrder,
    setCurrentView,
    setTrackingOrderId,
  } = useFurniture();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [fullName, setFullName] = useState('Bhagyalakshmi P.');
  const [email, setEmail] = useState('panchadibhagyalakshmi@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [addressLine1, setAddressLine1] = useState('Villa 14, Lotus Serenity Boulevard');
  const [addressLine2, setAddressLine2] = useState('Hitech City, Madhapur');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [pinCode, setPinCode] = useState('500081');
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery'>('UPI');
  const [upiId, setUpiId] = useState('bhagya@okhdfcbank');

  if (!isOpen) return null;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !addressLine1 || !city || !pinCode) return;
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    const shippingAddress: DeliveryAddress = {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
    };

    const orderPayload: Partial<Order> = {
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress,
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        image: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor.name,
      })),
      subtotal: cartSubtotal,
      discount: couponDiscount,
      couponCode: appliedCoupon || undefined,
      shippingFee: deliveryMethod === 'express' ? 1499 : (cartSubtotal >= 15000 ? 0 : 999),
      tax: Math.round((cartSubtotal - couponDiscount) * 0.05),
      total: cartTotal + (deliveryMethod === 'express' ? 1499 : 0),
      paymentMethod,
    };

    const newOrder = await createOrder(orderPayload);
    setIsProcessing(false);

    if (newOrder) {
      setCreatedOrder(newOrder);
      setStep('confirmation');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EDE5DF] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-[#E8DFD8]">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-semibold text-[#2C221E]">
              {step === 'confirmation' ? 'Order Confirmed' : 'FurniAura Secure Checkout'}
            </h2>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              256-Bit SSL Encrypted
            </span>
          </div>
          {step !== 'confirmation' && (
            <button
              onClick={onClose}
              className="p-1.5 text-[#8C7D73] hover:text-[#2C221E] rounded-full hover:bg-[#F2ECE6] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Progress Indicator */}
          {step !== 'confirmation' && (
            <div className="flex items-center justify-center gap-4 text-xs font-semibold mb-6">
              <span className={`flex items-center gap-1.5 ${step === 'shipping' ? 'text-[#2C221E]' : 'text-emerald-700'}`}>
                <span className="w-5 h-5 rounded-full bg-[#2C221E] text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Delivery & Address</span>
              </span>
              <span className="w-8 h-px bg-[#D8CFC8]" />
              <span className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-[#2C221E]' : 'text-[#8C7D73]'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'payment' ? 'bg-[#2C221E] text-white' : 'bg-[#EFE9E2] text-[#8C7D73]'}`}>
                  2
                </span>
                <span>Payment Method</span>
              </span>
            </div>
          )}

          {/* STEP 1: Shipping Address Form */}
          {step === 'shipping' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden focus:border-[#2C221E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-1.5">
                    Phone Number (for Courier Coordination) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden focus:border-[#2C221E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-1.5">
                  Email Address (for Receipt & Tracking) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden focus:border-[#2C221E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-1.5">
                  Street Address & House/Villa Number *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden focus:border-[#2C221E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden focus:border-[#2C221E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden focus:border-[#2C221E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-1.5">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden focus:border-[#2C221E] font-mono"
                  />
                </div>
              </div>

              {/* Delivery Speed Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-2">
                  Delivery & Placement Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryMethod('standard')}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      deliveryMethod === 'standard'
                        ? 'border-[#2C221E] bg-white ring-1 ring-[#2C221E]'
                        : 'border-[#EDE5DF] bg-[#FAF8F5] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#2C221E]">Standard White-Glove</span>
                      <span className="font-semibold text-emerald-700">Free</span>
                    </div>
                    <p className="text-[11px] text-[#8C7D73]">Delivered within 3-4 business days with room placement</p>
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('express')}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      deliveryMethod === 'express'
                        ? 'border-[#2C221E] bg-white ring-1 ring-[#2C221E]'
                        : 'border-[#EDE5DF] bg-[#FAF8F5] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#2C221E]">Priority Specialized Assembly</span>
                      <span className="font-semibold text-[#2C221E]">₹1,499</span>
                    </div>
                    <p className="text-[11px] text-[#8C7D73]">Guaranteed 48-hr arrival with complete tool setup</p>
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-4 flex justify-between items-center border-t border-[#E8DFD8]">
                <span className="text-xs text-[#8C7D73]">
                  Bag Total: <strong className="text-[#2C221E] tabular-nums">₹{cartTotal.toLocaleString()}</strong>
                </span>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2C221E] hover:bg-[#433731] text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Method */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'UPI'
                        ? 'border-[#2C221E] bg-white ring-1 ring-[#2C221E]'
                        : 'border-[#EDE5DF] bg-[#FAF8F5]'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#8C6D58] shrink-0" />
                    <div>
                      <span className="font-bold text-[#2C221E] block">UPI / QR Code</span>
                      <span className="text-[11px] text-[#8C7D73]">Google Pay, PhonePe, Paytm, BHIM</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'Card'
                        ? 'border-[#2C221E] bg-white ring-1 ring-[#2C221E]'
                        : 'border-[#EDE5DF] bg-[#FAF8F5]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#8C6D58] shrink-0" />
                    <div>
                      <span className="font-bold text-[#2C221E] block">Credit / Debit Card</span>
                      <span className="text-[11px] text-[#8C7D73]">Visa, Mastercard, RuPay, Amex</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('NetBanking')}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'NetBanking'
                        ? 'border-[#2C221E] bg-white ring-1 ring-[#2C221E]'
                        : 'border-[#EDE5DF] bg-[#FAF8F5]'
                    }`}
                  >
                    <Building className="w-5 h-5 text-[#8C6D58] shrink-0" />
                    <div>
                      <span className="font-bold text-[#2C221E] block">Net Banking</span>
                      <span className="text-[11px] text-[#8C7D73]">HDFC, ICICI, SBI, Axis, Kotak</span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-[#2C221E] bg-white ring-1 ring-[#2C221E]'
                        : 'border-[#EDE5DF] bg-[#FAF8F5]'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#8C6D58] shrink-0" />
                    <div>
                      <span className="font-bold text-[#2C221E] block">Cash on Delivery</span>
                      <span className="text-[11px] text-[#8C7D73]">Pay upon inspection & room placement</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* UPI Custom Form */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 bg-white rounded-2xl border border-[#EDE5DF] space-y-3">
                  <label className="block text-xs font-semibold text-[#2C221E]">
                    Enter Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi"
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden"
                  />
                  <p className="text-[11px] text-[#8C7D73]">
                    A payment request will be triggered to your UPI application.
                  </p>
                </div>
              )}

              {/* Order Summary Recap */}
              <div className="p-4 bg-white rounded-2xl border border-[#EDE5DF] space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-[#2C221E]">
                  <span>Total Payable:</span>
                  <span className="text-base font-bold tabular-nums">
                    ₹{(cartTotal + (deliveryMethod === 'express' ? 1499 : 0)).toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-[#8C7D73]">
                  Delivering to: {fullName}, {city}, {pinCode}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E8DFD8]">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs text-[#8C6D58] hover:text-[#2C221E] font-medium cursor-pointer"
                >
                  ← Back to Address
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="px-6 py-3.5 bg-[#2C221E] hover:bg-[#433731] disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>{isProcessing ? 'Securing Order...' : 'Confirm & Place Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Order Confirmation */}
          {step === 'confirmation' && createdOrder && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C221E] mb-2">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6C63] max-w-md mx-auto">
                  Thank you, <strong className="text-[#2C221E]">{createdOrder.customerName}</strong>. Your artisanal furniture order has been received and allocated for white-glove inspection.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-white rounded-2xl border border-[#EDE5DF] p-6 max-w-lg mx-auto text-left space-y-3 text-xs">
                <div className="flex justify-between border-b border-[#F2ECE6] pb-2">
                  <span className="text-[#8C7D73]">Order Reference</span>
                  <span className="font-mono font-bold text-[#2C221E]">{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between border-b border-[#F2ECE6] pb-2">
                  <span className="text-[#8C7D73]">Estimated Delivery</span>
                  <span className="font-semibold text-[#2C221E]">{createdOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between border-b border-[#F2ECE6] pb-2">
                  <span className="text-[#8C7D73]">Payment Status</span>
                  <span className="font-semibold text-emerald-700">{createdOrder.paymentStatus} ({createdOrder.paymentMethod})</span>
                </div>
                <div className="flex justify-between font-bold text-[#2C221E] pt-1">
                  <span>Total Amount Paid</span>
                  <span className="tabular-nums">₹{createdOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Next Actions */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setTrackingOrderId(createdOrder.id);
                    setCurrentView('tracking');
                    onClose();
                  }}
                  className="px-6 py-3 bg-[#2C221E] text-white text-xs font-semibold rounded-xl hover:bg-[#433731] transition-colors cursor-pointer shadow-md"
                >
                  Track Order Progress
                </button>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    onClose();
                  }}
                  className="px-6 py-3 bg-white border border-[#D8CFC8] text-[#2C221E] text-xs font-semibold rounded-xl hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
