import React, { useState } from 'react';
import { useFurniture } from '../context/FurnitureContext';
import { Product, Order, OrderStatus, FurnitureCategory, RoomType } from '../types/furniture';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  Star,
  RefreshCw,
  Eye,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    refreshProducts,
    orders,
    refreshOrders,
    setCurrentView,
    setTrackingOrderId,
    setUserRole,
  } = useFurniture();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics' | 'reviews'>('products');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // New Product Form State
  const [newName, setNewName] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<FurnitureCategory>('Sofas');
  const [newRoomType, setNewRoomType] = useState<RoomType>('Living Room');
  const [newPrice, setNewPrice] = useState(24999);
  const [newOriginalPrice, setNewOriginalPrice] = useState(29999);
  const [newMaterial, setNewMaterial] = useState('Solid White Oak & Linen');
  const [newStock, setNewStock] = useState(15);
  const [newImage, setNewImage] = useState('/src/assets/images/boucle_curve_sofa_1790604819882.jpg');
  const [newDescription, setNewDescription] = useState('Sculptural hand-crafted piece built with sustainably harvested timber.');

  // Edit Product State
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // Calculate Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const inStockProductsCount = products.filter((p) => p.inStock).length;

  // Add Product Handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          subtitle: newSubtitle,
          category: newCategory,
          roomType: newRoomType,
          price: newPrice,
          originalPrice: newOriginalPrice,
          material: newMaterial,
          stockQuantity: newStock,
          images: [newImage],
          description: newDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddingProduct(false);
        setNewName('');
        refreshProducts();
      }
    } catch (e) {
      console.error('Failed to create product:', e);
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this piece from live catalog?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        refreshProducts();
      }
    } catch (e) {
      console.error('Failed to delete product:', e);
    }
  };

  // Update Product Price & Stock
  const handleSaveProductEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: editPrice, stockQuantity: editStock }),
      });
      if (res.ok) {
        setEditingProductId(null);
        refreshProducts();
      }
    } catch (e) {
      console.error('Failed to update product:', e);
    }
  };

  // Update Order Delivery Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        refreshOrders();
      }
    } catch (e) {
      console.error('Failed to update order status:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-[#2C221E] rounded-3xl p-6 sm:p-8 text-white mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-[#E7C19D]" />
            <span className="text-xs uppercase tracking-wider text-[#E7C19D] font-semibold">
              FurniAura Operational Studio
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold">
            Merchant & Inventory Admin
          </h1>
          <p className="text-xs text-[#D8CFC8] font-light mt-0.5">
            Real-time management for catalog products, inventory levels, order workflows & analytics
          </p>
        </div>

        <button
          onClick={() => {
            setUserRole('customer');
            setCurrentView('home');
          }}
          className="px-4 py-2.5 bg-white text-[#2C221E] hover:bg-[#FAF8F5] text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          Exit to Customer Storefront
        </button>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-[#EDE5DF] shadow-2xs">
          <div className="flex items-center justify-between text-[#8C7D73] mb-2">
            <span className="text-xs font-semibold uppercase">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-[#8C6D58]" />
          </div>
          <span className="text-2xl font-bold text-[#2C221E] tabular-nums">
            ₹{totalRevenue.toLocaleString()}
          </span>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium">+18% growth this month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EDE5DF] shadow-2xs">
          <div className="flex items-center justify-between text-[#8C7D73] mb-2">
            <span className="text-xs font-semibold uppercase">Customer Orders</span>
            <Package className="w-4 h-4 text-[#8C6D58]" />
          </div>
          <span className="text-2xl font-bold text-[#2C221E] tabular-nums">
            {totalOrdersCount}
          </span>
          <p className="text-[11px] text-[#8C7D73] mt-1">All fulfillment routes active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EDE5DF] shadow-2xs">
          <div className="flex items-center justify-between text-[#8C7D73] mb-2">
            <span className="text-xs font-semibold uppercase">Average Order Value</span>
            <TrendingUp className="w-4 h-4 text-[#8C6D58]" />
          </div>
          <span className="text-2xl font-bold text-[#2C221E] tabular-nums">
            ₹{avgOrderValue.toLocaleString()}
          </span>
          <p className="text-[11px] text-[#8C7D73] mt-1">High-intent room bundles</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EDE5DF] shadow-2xs">
          <div className="flex items-center justify-between text-[#8C7D73] mb-2">
            <span className="text-xs font-semibold uppercase">Active Catalog SKUs</span>
            <ShoppingBag className="w-4 h-4 text-[#8C6D58]" />
          </div>
          <span className="text-2xl font-bold text-[#2C221E] tabular-nums">
            {products.length} ({inStockProductsCount} In Stock)
          </span>
          <p className="text-[11px] text-emerald-700 mt-1">Zero out-of-sync discrepancies</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-[#E8DFD8] overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-[#2C221E] text-white shadow-xs font-semibold'
              : 'bg-white text-[#5A4E47] border border-[#EDE5DF] hover:bg-[#FAF8F5]'
          }`}
        >
          Catalog Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#2C221E] text-white shadow-xs font-semibold'
              : 'bg-white text-[#5A4E47] border border-[#EDE5DF] hover:bg-[#FAF8F5]'
          }`}
        >
          Customer Orders & Status ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-[#2C221E] text-white shadow-xs font-semibold'
              : 'bg-white text-[#5A4E47] border border-[#EDE5DF] hover:bg-[#FAF8F5]'
          }`}
        >
          Customer Reviews Moderation
        </button>
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
              Inventory & Catalog Pieces
            </h2>
            <button
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="px-4 py-2 bg-[#2C221E] hover:bg-[#433731] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingProduct ? 'Close Form' : 'Add Furniture Product'}</span>
            </button>
          </div>

          {/* Add Product Form Modal / Section */}
          {isAddingProduct && (
            <form onSubmit={handleCreateProduct} className="p-6 bg-white rounded-3xl border border-[#EDE5DF] space-y-4 shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-[#2C221E]">
                Add New Architectural Furniture Piece
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#2C221E] uppercase mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Kyoto Minimalist Oak Credenza"
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#2C221E] uppercase mb-1">
                    Subtitle *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="e.g. Low-profile 3-door fluted credenza"
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#2C221E] uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden"
                  >
                    {['Sofas', 'Beds', 'Chairs', 'Tables', 'Wardrobes', 'Lighting', 'Home Decor'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#2C221E] uppercase mb-1">
                    Selling Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#2C221E] uppercase mb-1">
                    Original Regular Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#2C221E] uppercase mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2C221E] uppercase mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 text-xs text-[#8C7D73] hover:text-[#2C221E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2C221E] text-white text-xs font-semibold rounded-xl hover:bg-[#433731] cursor-pointer"
                >
                  Publish to Catalog
                </button>
              </div>
            </form>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-[#EDE5DF] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#EDE5DF] text-[#8C7D73] uppercase font-semibold">
                  <tr>
                    <th className="p-4">Piece</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Inventory</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2ECE6]">
                  {products.map((p) => {
                    const isEditing = editingProductId === p.id;
                    return (
                      <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-[#FAF8F5]"
                          />
                          <div>
                            <p className="font-semibold text-[#2C221E]">{p.name}</p>
                            <p className="text-[11px] text-[#8C7D73]">{p.material}</p>
                          </div>
                        </td>
                        <td className="p-4 text-[#5A4E47]">{p.category}</td>
                        <td className="p-4 font-bold text-[#2C221E] tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-24 p-1 border rounded text-xs bg-white"
                            />
                          ) : (
                            `₹${p.price.toLocaleString()}`
                          )}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(Number(e.target.value))}
                              className="w-16 p-1 border rounded text-xs bg-white"
                            />
                          ) : (
                            <span
                              className={`font-semibold ${
                                p.inStock ? 'text-emerald-700' : 'text-rose-600'
                              }`}
                            >
                              {p.stockQuantity} units ({p.inStock ? 'In Stock' : 'Out of Stock'})
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-[#2C221E]">
                          ★ {p.rating} ({p.reviewCount})
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <button
                                onClick={() => handleSaveProductEdit(p.id)}
                                className="p-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
                                title="Save changes"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingProductId(p.id);
                                  setEditPrice(p.price);
                                  setEditStock(p.stockQuantity);
                                }}
                                className="p-1.5 text-[#5A4E47] hover:text-[#2C221E] rounded-lg hover:bg-[#EDE5DF]"
                                title="Edit Price & Stock"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50"
                              title="Delete piece"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER WORKFLOW & STATUS UPDATES */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-[#2C221E]">
              Customer Orders & Delivery Status Dispatch
            </h2>
            <button
              onClick={() => refreshOrders()}
              className="text-xs text-[#8C6D58] hover:text-[#2C221E] flex items-center gap-1 font-medium cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Orders</span>
            </button>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-white rounded-3xl border border-[#EDE5DF] p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2ECE6]">
                  <div>
                    <span className="font-mono text-base font-bold text-[#2C221E]">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-xs text-[#8C7D73] ml-3">
                      Customer: <strong>{ord.customerName}</strong> ({ord.customerEmail})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#8C7D73]">Update Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="text-xs font-semibold p-2 bg-[#FAF8F5] border border-[#D8CFC8] rounded-xl text-[#2C221E] outline-hidden cursor-pointer"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-[#2C221E] mb-1">Destination Address:</p>
                    <p className="text-[#5A4E47] leading-relaxed">
                      {ord.shippingAddress.fullName} · {ord.shippingAddress.addressLine1}, {ord.shippingAddress.city} - {ord.shippingAddress.pinCode}
                    </p>
                    <p className="text-[#8C7D73] mt-1">
                      Tracking ID: <span className="font-mono text-[#2C221E]">{ord.trackingNumber}</span> ({ord.carrier})
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-[#8C7D73]">Payment: <strong className="text-[#2C221E]">{ord.paymentMethod}</strong> ({ord.paymentStatus})</p>
                    <p className="font-bold text-sm text-[#2C221E] mt-1">
                      Total: ₹{ord.total.toLocaleString()}
                    </p>
                    <button
                      onClick={() => {
                        setTrackingOrderId(ord.id);
                        setCurrentView('tracking');
                      }}
                      className="mt-2 text-xs text-[#8C6D58] hover:text-[#2C221E] font-medium underline"
                    >
                      View Live Customer Tracker →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-[#EDE5DF] p-6 shadow-xs space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[#2C221E] mb-2">
            Published Customer Reviews
          </h2>
          <div className="divide-y divide-[#F2ECE6]">
            {products.flatMap((p) => (p.reviews || []).map((rev) => ({ ...rev, productName: p.name }))).map((r) => (
              <div key={r.id} className="py-3 flex items-start justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#2C221E]">{r.userName}</span>
                    <span className="text-[#8C7D73]">on {r.productName}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                      Verified Buyer
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[#C27A4E] mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <p className="text-[#5A4E47]">{r.comment}</p>
                </div>
                <span className="text-[11px] text-[#8C7D73]">{r.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
