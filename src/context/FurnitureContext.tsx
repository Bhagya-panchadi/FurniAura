import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  SavedRoomDesign,
  FurnitureCategory,
  RoomType,
  ProductColor,
} from '../types/furniture';

interface FurnitureContextType {
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, selectedColor?: ProductColor, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
  appliedCoupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  orders: Order[];
  refreshOrders: () => Promise<void>;
  createOrder: (orderData: Partial<Order>) => Promise<Order | null>;
  currentView: 'home' | 'catalog' | 'room-planner' | 'dashboard' | 'admin' | 'tracking';
  setCurrentView: (view: 'home' | 'catalog' | 'room-planner' | 'dashboard' | 'admin' | 'tracking') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategory: FurnitureCategory;
  setSelectedCategory: (cat: FurnitureCategory) => void;
  selectedRoomType: RoomType;
  setSelectedRoomType: (room: RoomType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAiChatOpen: boolean;
  setIsAiChatOpen: (open: boolean) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  userRole: 'customer' | 'admin';
  setUserRole: (role: 'customer' | 'admin') => void;
  savedDesigns: SavedRoomDesign[];
  saveRoomDesign: (design: Partial<SavedRoomDesign>) => Promise<void>;
  recentlyViewed: string[];
  addToRecentlyViewed: (id: string) => void;
}

const FurnitureContext = createContext<FurnitureContextType | undefined>(undefined);

export const FurnitureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('furniaura_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('furniaura_wishlist');
      return stored ? JSON.parse(stored) : ['prod-sofa-01', 'prod-table-02'];
    } catch {
      return ['prod-sofa-01', 'prod-table-02'];
    }
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<SavedRoomDesign[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'room-planner' | 'dashboard' | 'admin' | 'tracking'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FurnitureCategory>('All');
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>('ord-1001');
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(['prod-sofa-01', 'prod-chair-01']);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('furniaura_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('furniaura_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Load products from API
  const refreshProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const refreshOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const refreshSavedDesigns = async () => {
    try {
      const res = await fetch('/api/saved-designs');
      const data = await res.json();
      if (data.designs) {
        setSavedDesigns(data.designs);
      }
    } catch (err) {
      console.error('Failed to fetch designs:', err);
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshOrders();
    refreshSavedDesigns();
  }, []);

  const addToCart = (product: Product, selectedColor?: ProductColor, quantity = 1) => {
    const color = selectedColor || product.colors[0] || { name: 'Default', hex: '#EBE5DE', inStock: true };
    const cartItemId = `${product.id}-${color.name}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          quantity,
          selectedColor: color,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const addToRecentlyViewed = (id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((pId) => pId !== id);
      return [id, ...filtered].slice(0, 8);
    });
  };

  // Pricing calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let couponDiscount = 0;
  if (appliedCoupon === 'AURA10') {
    couponDiscount = Math.round(cartSubtotal * 0.1);
  } else if (appliedCoupon === 'LUXE15') {
    couponDiscount = Math.round(cartSubtotal * 0.15);
  } else if (appliedCoupon === 'FURNI20') {
    couponDiscount = Math.round(cartSubtotal * 0.2);
  }

  const shippingFee = cartSubtotal >= 15000 || cartSubtotal === 0 ? 0 : 999;
  const tax = Math.round((cartSubtotal - couponDiscount) * 0.05); // 5% GST
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee + tax);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (['AURA10', 'LUXE15', 'FURNI20'].includes(clean)) {
      setAppliedCoupon(clean);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const createOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => [data.order, ...prev]);
        clearCart();
        setTrackingOrderId(data.order.id);
        refreshProducts(); // update inventory
        return data.order;
      }
      return null;
    } catch (e) {
      console.error('Order creation error:', e);
      return null;
    }
  };

  const saveRoomDesign = async (design: Partial<SavedRoomDesign>) => {
    try {
      const res = await fetch('/api/saved-designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(design),
      });
      const data = await res.json();
      if (data.success && data.design) {
        setSavedDesigns((prev) => [data.design, ...prev]);
      }
    } catch (e) {
      console.error('Save design error:', e);
    }
  };

  return (
    <FurnitureContext.Provider
      value={{
        products,
        isLoadingProducts,
        refreshProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartSubtotal,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        refreshOrders,
        createOrder,
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedCategory,
        setSelectedCategory,
        selectedRoomType,
        setSelectedRoomType,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        isAiChatOpen,
        setIsAiChatOpen,
        trackingOrderId,
        setTrackingOrderId,
        userRole,
        setUserRole,
        savedDesigns,
        saveRoomDesign,
        recentlyViewed,
        addToRecentlyViewed,
      }}
    >
      {children}
    </FurnitureContext.Provider>
  );
};

export const useFurniture = () => {
  const ctx = useContext(FurnitureContext);
  if (!ctx) {
    throw new Error('useFurniture must be used within a FurnitureProvider');
  }
  return ctx;
};
