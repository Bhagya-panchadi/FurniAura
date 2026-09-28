export type FurnitureCategory =
  | 'All'
  | 'Sofas'
  | 'Beds'
  | 'Chairs'
  | 'Tables'
  | 'Wardrobes'
  | 'Lighting'
  | 'Home Decor';

export type RoomType =
  | 'All'
  | 'Living Room'
  | 'Bedroom'
  | 'Dining Room'
  | 'Home Office'
  | 'Lounge';

export type DesignStyle =
  | 'Japandi'
  | 'Minimalist'
  | 'Scandinavian'
  | 'Modern Luxury'
  | 'Mid-Century Modern'
  | 'Organic Modern';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
  inStock: boolean;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount?: number;
  verifiedPurchase: boolean;
}

export interface Dimensions {
  width: number;
  depth: number;
  height: number;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: FurnitureCategory;
  roomType: RoomType;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  dimensions: Dimensions;
  material: string;
  colors: ProductColor[];
  stockQuantity: number;
  inStock: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  seatingCapacity?: number;
  assemblyRequired?: boolean;
  warrantyYears?: number;
  deliveryDays?: number;
  reviews?: ProductReview[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedColor: ProductColor;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedColor: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: DeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending';
  status: OrderStatus;
  estimatedDelivery: string;
  trackingNumber: string;
  carrier: string;
  timeline: OrderTimelineEvent[];
}

export interface RoomPlacerItem {
  instanceId: string;
  productId: string;
  name: string;
  category: string;
  image: string;
  x: number; // percentage in room
  y: number; // percentage in room
  rotation: number; // degrees 0, 90, 180, 270
  width: number; // in relative scale
  length: number;
  price: number;
}

export interface SavedRoomDesign {
  id: string;
  name: string;
  roomType: RoomType;
  dimensions: {
    lengthFt: number;
    widthFt: number;
  };
  style: DesignStyle;
  palette: string;
  items: RoomPlacerItem[];
  totalCost: number;
  createdAt: string;
  aiNotes?: string;
}

export interface AIAgentMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
  actionPrompt?: {
    type: 'add_to_cart' | 'view_room_plan' | 'compare';
    productIds: string[];
    label: string;
  };
}
