import React, { useState } from 'react';
import { useFurniture } from '../context/FurnitureContext';
import { OrderStatus } from '../types/furniture';
import {
  PackageCheck,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const TRACKING_STAGES: { status: OrderStatus; label: string }[] = [
  { status: 'Order Placed', label: 'Order Placed' },
  { status: 'Confirmed', label: 'Confirmed' },
  { status: 'Processing', label: 'Artisanal Inspection' },
  { status: 'Shipped', label: 'Shipped' },
  { status: 'Out for Delivery', label: 'Out for Delivery' },
  { status: 'Delivered', label: 'Delivered & Placed' },
];

export const OrderTracker: React.FC = () => {
  const { orders, trackingOrderId, setTrackingOrderId } = useFurniture();
  const [searchInput, setSearchInput] = useState('');

  // Current tracked order
  const activeOrder =
    orders.find((o) => o.id === trackingOrderId || o.orderNumber === trackingOrderId) ||
    orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === searchInput.trim().toLowerCase() ||
        o.id.toLowerCase() === searchInput.trim().toLowerCase()
    );
    if (found) {
      setTrackingOrderId(found.id);
    }
  };

  const getStageIndex = (status: OrderStatus) => {
    return TRACKING_STAGES.findIndex((s) => s.status === status);
  };

  const currentStageIndex = activeOrder ? getStageIndex(activeOrder.status) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Lookup Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6D58] uppercase tracking-wider mb-1">
            <PackageCheck className="w-4 h-4 text-[#C27A4E]" />
            <span>Real-Time Logistics Portal</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-[#2C221E]">
            Order Tracking & Delivery Journey
          </h1>
        </div>

        {/* Order Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search Order # e.g. FA-94821"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="text-xs px-3.5 py-2.5 bg-white border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden focus:border-[#2C221E] w-48 sm:w-64"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#2C221E] hover:bg-[#433731] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>
      </div>

      {!activeOrder ? (
        <div className="bg-white rounded-3xl border border-[#EDE5DF] p-12 text-center">
          <Clock className="w-12 h-12 text-[#8C7D73] mx-auto mb-3" />
          <h3 className="font-serif text-xl font-semibold text-[#2C221E] mb-2">
            No active order found
          </h3>
          <p className="text-xs text-[#8C7D73]">
            Please enter a valid order reference number (e.g. FA-94821) in the search field above.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Order Summary Header Card */}
          <div className="bg-white rounded-3xl border border-[#EDE5DF] p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F2ECE6]">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-lg font-bold text-[#2C221E]">
                    Order #{activeOrder.orderNumber}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {activeOrder.status}
                  </span>
                </div>
                <p className="text-xs text-[#8C7D73]">
                  Carrier: <strong className="text-[#2C221E] font-medium">{activeOrder.carrier}</strong> · Tracking ID:{' '}
                  <span className="font-mono text-[#2C221E]">{activeOrder.trackingNumber}</span>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#8C7D73] block">Estimated Delivery Arrival</span>
                <span className="text-base font-bold text-[#2C221E]">
                  {activeOrder.estimatedDelivery}
                </span>
              </div>
            </div>

            {/* Visual Step Tracker */}
            <div className="pt-8 pb-4">
              <div className="relative">
                {/* Horizontal Progress Bar Line */}
                <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-[#EDE5DF] -z-0">
                  <div
                    className="h-full bg-[#C27A4E] transition-all duration-500"
                    style={{
                      width: `${(currentStageIndex / (TRACKING_STAGES.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Stages List */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 relative z-10">
                  {TRACKING_STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div key={stage.status} className="flex flex-col items-center text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-[#2C221E] text-white shadow-xs'
                              : 'bg-[#F2ECE6] text-[#8C7D73] border border-[#D8CFC8]'
                          } ${isCurrent ? 'ring-4 ring-[#E7C19D]' : ''}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[#E7C19D]" />
                          ) : (
                            <span className="text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <span
                          className={`text-xs mt-2.5 font-medium leading-tight ${
                            isCurrent ? 'text-[#2C221E] font-bold' : isCompleted ? 'text-[#5A4E47]' : 'text-[#A0938A]'
                          }`}
                        >
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Milestones & Destination Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Timeline Milestones (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EDE5DF] p-6 sm:p-8 shadow-xs">
              <h3 className="font-serif text-lg font-semibold text-[#2C221E] mb-6">
                Activity History
              </h3>

              <div className="space-y-6 relative border-l-2 border-[#EDE5DF] ml-3 pl-6">
                {activeOrder.timeline.map((event, i) => (
                  <div key={i} className="relative">
                    <span
                      className={`absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        event.completed ? 'bg-[#C27A4E]' : 'bg-[#D8CFC8]'
                      }`}
                    />
                    <div className="text-xs">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-[#2C221E]">{event.status}</h4>
                        <span className="text-[11px] text-[#8C7D73]">{event.timestamp}</span>
                      </div>
                      <p className="text-[#6F6057]">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Address & Items (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Delivery Address Card */}
              <div className="bg-white rounded-3xl border border-[#EDE5DF] p-6 shadow-xs text-xs space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#2C221E]">
                  <MapPin className="w-4 h-4 text-[#8C6D58]" />
                  <span>Delivery Destination</span>
                </div>
                <div className="text-[#5A4E47] leading-relaxed">
                  <p className="font-bold text-[#2C221E]">{activeOrder.shippingAddress.fullName}</p>
                  <p>{activeOrder.shippingAddress.addressLine1}</p>
                  {activeOrder.shippingAddress.addressLine2 && <p>{activeOrder.shippingAddress.addressLine2}</p>}
                  <p>
                    {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} -{' '}
                    <span className="font-mono">{activeOrder.shippingAddress.pinCode}</span>
                  </p>
                  <p className="mt-1 text-[#8C7D73]">Phone: {activeOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Package Contents */}
              <div className="bg-white rounded-3xl border border-[#EDE5DF] p-6 shadow-xs text-xs space-y-4">
                <h4 className="font-semibold text-sm text-[#2C221E]">
                  Package Items ({activeOrder.items.length})
                </h4>
                <div className="divide-y divide-[#F2ECE6]">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-[#FAF8F5]"
                        />
                        <div>
                          <p className="font-semibold text-[#2C221E]">{item.name}</p>
                          <p className="text-[11px] text-[#8C7D73]">
                            Qty: {item.quantity} · Finish: {item.selectedColor}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#2C221E] tabular-nums">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#F2ECE6] flex justify-between font-bold text-sm text-[#2C221E]">
                  <span>Total Order Value</span>
                  <span className="tabular-nums">₹{activeOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
