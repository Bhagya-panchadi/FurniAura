import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { INITIAL_PRODUCTS } from './src/data/initialProducts.ts';
import { Product, Order, SavedRoomDesign, OrderStatus, ProductReview } from './src/types/furniture.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-Memory Database Store
let products: Product[] = [...INITIAL_PRODUCTS];

let orders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'FA-94821',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: 'Bhagyalakshmi P.',
    customerEmail: 'panchadibhagyalakshmi@gmail.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      fullName: 'Bhagyalakshmi P.',
      phone: '+91 98765 43210',
      addressLine1: 'Villa 14, Lotus Serenity Boulevard',
      addressLine2: 'Hitech City, Madhapur',
      city: 'Hyderabad',
      state: 'Telangana',
      pinCode: '500081',
      landmark: 'Near Cyber Towers',
    },
    items: [
      {
        productId: 'prod-chair-01',
        name: 'Atelier French Cane & Walnut Lounge Chair',
        image: '/src/assets/images/cane_lounge_chair_1790604845935.jpg',
        price: 16499,
        quantity: 1,
        selectedColor: 'Rich Walnut',
      },
      {
        productId: 'prod-decor-01',
        name: 'Terre Hand-Sculpted Ceramic Vase Set',
        image: '/src/assets/images/hero_living_room_1790604809160.jpg',
        price: 4499,
        quantity: 1,
        selectedColor: 'Sand Speckle',
      },
    ],
    subtotal: 20998,
    discount: 2000,
    couponCode: 'AURA10',
    shippingFee: 0,
    tax: 949,
    total: 19947,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    status: 'Shipped',
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    trackingNumber: 'FA-EXP-8839210',
    carrier: 'FurniAura White-Glove Logistics',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: 'Sep 25, 2026, 10:30 AM',
        description: 'Order placed and payment verified via UPI',
        completed: true,
      },
      {
        status: 'Confirmed',
        timestamp: 'Sep 25, 2026, 11:15 AM',
        description: 'Items confirmed and allocated at Hyderabad Fulfillment Center',
        completed: true,
      },
      {
        status: 'Processing',
        timestamp: 'Sep 26, 2026, 02:40 PM',
        description: 'Artisanal inspection passed and white-glove padded packaging completed',
        completed: true,
      },
      {
        status: 'Shipped',
        timestamp: 'Sep 27, 2026, 08:20 AM',
        description: 'Dispatched with FurniAura Specialized Fleet (Van #HYD-04)',
        completed: true,
      },
      {
        status: 'Out for Delivery',
        timestamp: 'Expected Tomorrow',
        description: 'Delivery technician will call 1 hour prior to arrival',
        completed: false,
      },
      {
        status: 'Delivered',
        timestamp: 'Expected by 6:00 PM Tomorrow',
        description: 'Complimentary placement and unboxing in your room of choice',
        completed: false,
      },
    ],
  },
];

let savedDesigns: SavedRoomDesign[] = [
  {
    id: 'des-01',
    name: 'Serene Japandi Living Suite',
    roomType: 'Living Room',
    dimensions: { lengthFt: 18, widthFt: 14 },
    style: 'Japandi',
    palette: 'Warm Cream & Oak',
    items: [
      {
        instanceId: 'item-1',
        productId: 'prod-sofa-01',
        name: 'Aura Organic Curved Bouclé Sofa',
        category: 'Sofas',
        image: '/src/assets/images/boucle_curve_sofa_1790604819882.jpg',
        x: 50,
        y: 40,
        rotation: 0,
        width: 140,
        length: 60,
        price: 34999,
      },
      {
        instanceId: 'item-2',
        productId: 'prod-table-02',
        name: 'Travertine & Oak Sculptural Coffee Table',
        category: 'Tables',
        image: '/src/assets/images/hero_living_room_1790604809160.jpg',
        x: 50,
        y: 65,
        rotation: 0,
        width: 80,
        length: 50,
        price: 18999,
      },
      {
        instanceId: 'item-3',
        productId: 'prod-chair-01',
        name: 'Atelier French Cane & Walnut Lounge Chair',
        category: 'Chairs',
        image: '/src/assets/images/cane_lounge_chair_1790604845935.jpg',
        x: 20,
        y: 55,
        rotation: 45,
        width: 50,
        length: 50,
        price: 16499,
      },
    ],
    totalCost: 70497,
    createdAt: new Date().toISOString(),
    aiNotes: 'Harmonious focal arrangement maintaining clear 3-foot pathways between sofa and entrance.',
  },
];

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Tool Declarations for Aura AI Shopping Concierge
const searchProductsTool: FunctionDeclaration = {
  name: 'searchProducts',
  description: 'Search furniture catalog by keywords, category, room type, max price, min price, or material.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: { type: Type.STRING, description: 'Keywords like sofa, oak, dining, low platform, etc.' },
      category: { type: Type.STRING, description: 'Category: Sofas, Beds, Chairs, Tables, Wardrobes, Lighting, Home Decor' },
      roomType: { type: Type.STRING, description: 'Room type: Living Room, Bedroom, Dining Room, Home Office' },
      maxPrice: { type: Type.NUMBER, description: 'Maximum price budget in INR (e.g. 25000)' },
      minPrice: { type: Type.NUMBER, description: 'Minimum price in INR' },
      material: { type: Type.STRING, description: 'Material like Oak, Bouclé, Linen, Walnut, Travertine' },
    },
  },
};

const getProductDetailsTool: FunctionDeclaration = {
  name: 'getProductDetails',
  description: 'Retrieve complete specifications, dimensions, materials, color choices, and reviews for a product.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      productId: { type: Type.STRING, description: 'Product ID e.g. prod-sofa-01' },
    },
    required: ['productId'],
  },
};

const compareProductsTool: FunctionDeclaration = {
  name: 'compareProducts',
  description: 'Compare two or more furniture pieces side by side based on price, dimensions, materials, and rating.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      productIds: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'List of product IDs to compare',
      },
    },
    required: ['productIds'],
  },
};

const checkStockAvailabilityTool: FunctionDeclaration = {
  name: 'checkStockAvailability',
  description: 'Check actual stock levels and delivery lead time for a given product or color variant.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      productId: { type: Type.STRING, description: 'Product ID' },
      colorName: { type: Type.STRING, description: 'Optional color variant name' },
    },
    required: ['productId'],
  },
};

const calculateRoomBudgetTool: FunctionDeclaration = {
  name: 'calculateRoomBudget',
  description: 'Create a tailored furniture combination matching a specific room type and maximum budget in INR.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      roomType: { type: Type.STRING, description: 'e.g. Living Room, Bedroom, Dining Room' },
      targetBudget: { type: Type.NUMBER, description: 'Total budget in INR' },
    },
    required: ['roomType', 'targetBudget'],
  },
};

const getOrderStatusTool: FunctionDeclaration = {
  name: 'getOrderStatus',
  description: 'Look up live tracking information and current stage for an order number or ID.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      orderIdentifier: { type: Type.STRING, description: 'Order number like FA-94821 or order ID' },
    },
    required: ['orderIdentifier'],
  },
};

// Tool Execution Handlers
function executeCatalogSearch(args: any) {
  const { query, category, roomType, maxPrice, minPrice, material } = args || {};
  let results = [...products];

  if (category && category !== 'All') {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (roomType && roomType !== 'All') {
    results = results.filter((p) => p.roomType.toLowerCase() === roomType.toLowerCase());
  }
  if (typeof maxPrice === 'number' && !isNaN(maxPrice)) {
    results = results.filter((p) => p.price <= maxPrice);
  }
  if (typeof minPrice === 'number' && !isNaN(minPrice)) {
    results = results.filter((p) => p.price >= minPrice);
  }
  if (material) {
    const matLower = material.toLowerCase();
    results = results.filter((p) => p.material.toLowerCase().includes(matLower));
  }
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );
  }

  return results.slice(0, 6).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    roomType: p.roomType,
    price: p.price,
    originalPrice: p.originalPrice,
    material: p.material,
    dimensions: `${p.dimensions.width}x${p.dimensions.depth}x${p.dimensions.height} ${p.dimensions.unit}`,
    rating: p.rating,
    stockQuantity: p.stockQuantity,
    inStock: p.inStock,
    colors: p.colors.map((c) => c.name),
  }));
}

function executeProductDetails(productId: string) {
  const p = products.find((prod) => prod.id === productId || prod.name.toLowerCase().includes(productId.toLowerCase()));
  if (!p) return { error: `Product not found for identifier: ${productId}` };
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice,
    material: p.material,
    dimensions: p.dimensions,
    features: p.features,
    stockQuantity: p.stockQuantity,
    inStock: p.inStock,
    colors: p.colors,
    rating: p.rating,
    reviewCount: p.reviewCount,
    deliveryDays: p.deliveryDays,
    warrantyYears: p.warrantyYears,
  };
}

function executeCompare(productIds: string[]) {
  const found = products.filter((p) => productIds.includes(p.id));
  return found.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    material: p.material,
    dimensions: `${p.dimensions.width}W x ${p.dimensions.depth}D x ${p.dimensions.height}H ${p.dimensions.unit}`,
    rating: p.rating,
    inStock: p.inStock,
    warranty: `${p.warrantyYears || 3} years`,
  }));
}

function executeCheckStock(productId: string, colorName?: string) {
  const p = products.find((prod) => prod.id === productId);
  if (!p) return { error: `Product not found: ${productId}` };
  let colorAvailable = true;
  if (colorName) {
    const col = p.colors.find((c) => c.name.toLowerCase().includes(colorName.toLowerCase()));
    if (col) colorAvailable = col.inStock;
  }
  return {
    id: p.id,
    name: p.name,
    inStock: p.inStock && colorAvailable,
    stockQuantity: p.stockQuantity,
    deliveryLeadDays: p.deliveryDays || 3,
  };
}

function executeCalculateBudget(roomType: string, targetBudget: number) {
  const relevant = products.filter((p) => p.roomType.toLowerCase() === roomType.toLowerCase() || p.category !== 'Home Decor');
  // Greedy selection
  const sorted = [...relevant].sort((a, b) => b.rating - a.rating);
  const selected: Product[] = [];
  let remaining = targetBudget;
  const categoriesIncluded = new Set<string>();

  for (const item of sorted) {
    if (!categoriesIncluded.has(item.category) && item.price <= remaining) {
      selected.push(item);
      remaining -= item.price;
      categoriesIncluded.add(item.category);
    }
  }

  return {
    roomType,
    targetBudget,
    totalBundlePrice: targetBudget - remaining,
    remainingBudget: remaining,
    items: selected.map((p) => ({ id: p.id, name: p.name, category: p.category, price: p.price })),
  };
}

function executeGetOrder(orderIdentifier: string) {
  const ord = orders.find(
    (o) => o.id === orderIdentifier || o.orderNumber.toLowerCase() === orderIdentifier.toLowerCase()
  );
  if (!ord) return { error: `Order not found for identifier: ${orderIdentifier}` };
  return {
    orderNumber: ord.orderNumber,
    customerName: ord.customerName,
    status: ord.status,
    carrier: ord.carrier,
    trackingNumber: ord.trackingNumber,
    estimatedDelivery: ord.estimatedDelivery,
    timeline: ord.timeline,
  };
}

// REST API Endpoints

// 1. Products API
app.get('/api/products', (req: Request, res: Response) => {
  const { search, category, roomType, minPrice, maxPrice, material, color, sort, inStockOnly } = req.query;
  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter((p) => p.category.toLowerCase() === (category as string).toLowerCase());
  }
  if (roomType && roomType !== 'All') {
    result = result.filter((p) => p.roomType.toLowerCase() === (roomType as string).toLowerCase());
  }
  if (minPrice) {
    result = result.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }
  if (material) {
    result = result.filter((p) => p.material.toLowerCase().includes((material as string).toLowerCase()));
  }
  if (color) {
    result = result.filter((p) => p.colors.some((c) => c.name.toLowerCase().includes((color as string).toLowerCase())));
  }
  if (inStockOnly === 'true') {
    result = result.filter((p) => p.inStock);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sort === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popular') {
    result.sort((a, b) => b.reviewCount - a.reviewCount);
  } else if (sort === 'newest') {
    result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  }

  res.json({ products: result, total: result.length });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const p = products.find((prod) => prod.id === req.params.id);
  if (!p) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const related = products
    .filter((other) => other.id !== p.id && (other.roomType === p.roomType || other.category === p.category))
    .slice(0, 4);

  res.json({ product: p, related });
});

// Admin Add Product
app.post('/api/products', (req: Request, res: Response) => {
  const newProd: Product = {
    id: `prod-${Date.now()}`,
    name: req.body.name,
    subtitle: req.body.subtitle || '',
    category: req.body.category || 'Sofas',
    roomType: req.body.roomType || 'Living Room',
    brand: req.body.brand || 'Aura Studio',
    price: Number(req.body.price),
    originalPrice: Number(req.body.originalPrice || req.body.price),
    discountPercentage: req.body.originalPrice
      ? Math.round(((req.body.originalPrice - req.body.price) / req.body.originalPrice) * 100)
      : 0,
    rating: 5.0,
    reviewCount: 0,
    images: req.body.images && req.body.images.length > 0
      ? req.body.images
      : ['/src/assets/images/boucle_curve_sofa_1790604819882.jpg'],
    description: req.body.description || '',
    features: req.body.features || ['Premium hand-finished joinery', 'Eco-certified sustainably harvested timber'],
    dimensions: req.body.dimensions || { width: 100, depth: 80, height: 75, unit: 'cm' },
    material: req.body.material || 'Solid Oak',
    colors: req.body.colors || [{ name: 'Natural Sand', hex: '#D6C8B8', inStock: true }],
    stockQuantity: Number(req.body.stockQuantity || 10),
    inStock: Number(req.body.stockQuantity || 10) > 0,
    isBestseller: Boolean(req.body.isBestseller),
    isNewArrival: true,
    isFeatured: Boolean(req.body.isFeatured),
    warrantyYears: Number(req.body.warrantyYears || 5),
    deliveryDays: Number(req.body.deliveryDays || 3),
    reviews: [],
  };

  products.unshift(newProd);
  res.status(201).json({ success: true, product: newProd });
});

// Admin Edit Product
app.put('/api/products/:id', (req: Request, res: Response) => {
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updated: Product = {
    ...products[idx],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : products[idx].price,
    stockQuantity: req.body.stockQuantity !== undefined ? Number(req.body.stockQuantity) : products[idx].stockQuantity,
    inStock: req.body.stockQuantity !== undefined ? Number(req.body.stockQuantity) > 0 : products[idx].inStock,
  };

  products[idx] = updated;
  res.json({ success: true, product: updated });
});

// Admin Delete Product
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products.splice(idx, 1);
  res.json({ success: true });
});

// Product Reviews
app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
  const p = products.find((prod) => prod.id === req.params.id);
  if (!p) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const review: ProductReview = {
    id: `rev-${Date.now()}`,
    userName: req.body.userName || 'Verified Customer',
    rating: Number(req.body.rating || 5),
    date: new Date().toISOString().split('T')[0],
    comment: req.body.comment || '',
    verifiedPurchase: true,
  };
  p.reviews = p.reviews || [];
  p.reviews.unshift(review);
  p.reviewCount = p.reviews.length;
  p.rating = Number((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1));
  res.json({ success: true, review, rating: p.rating, reviewCount: p.reviewCount });
});

// 2. Orders API
app.get('/api/orders', (req: Request, res: Response) => {
  const { email } = req.query;
  if (email) {
    const userOrders = orders.filter((o) => o.customerEmail.toLowerCase() === (email as string).toLowerCase());
    return res.json({ orders: userOrders });
  }
  res.json({ orders });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const ord = orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!ord) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order: ord });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const body = req.body;
  const newOrderNumber = `FA-${Math.floor(10000 + Math.random() * 90000)}`;
  const orderId = `ord-${Date.now()}`;

  // Decrement inventory
  if (Array.isArray(body.items)) {
    for (const item of body.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        prod.inStock = prod.stockQuantity > 0;
      }
    }
  }

  const estDate = new Date();
  estDate.setDate(estDate.getDate() + 4);

  const newOrder: Order = {
    id: orderId,
    orderNumber: newOrderNumber,
    createdAt: new Date().toISOString(),
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    shippingAddress: body.shippingAddress,
    items: body.items || [],
    subtotal: body.subtotal,
    discount: body.discount || 0,
    couponCode: body.couponCode,
    shippingFee: body.shippingFee || 0,
    tax: body.tax || 0,
    total: body.total,
    paymentMethod: body.paymentMethod || 'UPI',
    paymentStatus: body.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
    status: 'Order Placed',
    estimatedDelivery: estDate.toISOString().split('T')[0],
    trackingNumber: `FA-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
    carrier: 'FurniAura White-Glove Logistics',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: 'Just now',
        description: `Order successfully registered and assigned order reference ${newOrderNumber}`,
        completed: true,
      },
      {
        status: 'Confirmed',
        timestamp: 'Estimated within 2 hours',
        description: 'Quality audit and inventory reservation at regional hub',
        completed: false,
      },
      {
        status: 'Processing',
        timestamp: 'Day 1-2',
        description: 'Fine finish inspection and white-glove packaging',
        completed: false,
      },
      {
        status: 'Shipped',
        timestamp: 'Day 2-3',
        description: 'Dispatched in climate-controlled specialized furniture transport',
        completed: false,
      },
      {
        status: 'Out for Delivery',
        timestamp: 'Day 4',
        description: 'Courier technician will contact you for a convenient delivery window',
        completed: false,
      },
      {
        status: 'Delivered',
        timestamp: `Estimated by ${estDate.toLocaleDateString()}`,
        description: 'Assembly and placement in room of choice completed',
        completed: false,
      },
    ],
  };

  orders.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

// Admin update order status
app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const ord = orders.find((o) => o.id === req.params.id);
  if (!ord) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const newStatus = req.body.status as OrderStatus;
  const statusFlow: OrderStatus[] = [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const targetIdx = statusFlow.indexOf(newStatus);
  if (targetIdx !== -1) {
    ord.status = newStatus;
    ord.timeline = ord.timeline.map((evt, i) => {
      const evtIdx = statusFlow.indexOf(evt.status);
      return {
        ...evt,
        completed: evtIdx <= targetIdx,
        timestamp: evtIdx === targetIdx ? 'Updated just now' : evt.timestamp,
      };
    });
  }

  res.json({ success: true, order: ord });
});

// 3. Saved Room Designs API
app.get('/api/saved-designs', (req: Request, res: Response) => {
  res.json({ designs: savedDesigns });
});

app.post('/api/saved-designs', (req: Request, res: Response) => {
  const newDesign: SavedRoomDesign = {
    id: `des-${Date.now()}`,
    name: req.body.name || 'Custom Sanctuary',
    roomType: req.body.roomType || 'Living Room',
    dimensions: req.body.dimensions || { lengthFt: 16, widthFt: 12 },
    style: req.body.style || 'Japandi',
    palette: req.body.palette || 'Warm Cream',
    items: req.body.items || [],
    totalCost: req.body.totalCost || 0,
    createdAt: new Date().toISOString(),
    aiNotes: req.body.aiNotes,
  };
  savedDesigns.unshift(newDesign);
  res.status(201).json({ success: true, design: newDesign });
});

// 4. Aura AI Shopping Concierge API
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { messages, userContext } = req.body;
  const lastUserMessage = messages?.[messages.length - 1]?.text || '';

  // Check if API key is present
  if (!process.env.GEMINI_API_KEY) {
    // Intelligent local fallback matching prompt constraints
    const fallbackAnswer = generateIntelligentFallback(lastUserMessage);
    return res.json(fallbackAnswer);
  }

  try {
    const systemPrompt = `You are Aura AI, the premier interior design expert and shopping concierge for FurniAura—a high-end furniture brand.
Aura AI persona: warm, knowledgeable, refined, articulate, and deeply committed to timeless aesthetics (warm neutrals, Japandi, Scandinavian, Modern Luxury).
CRITICAL RULES:
1. Always use your provided tools to search products, check stock, compare items, and retrieve accurate prices.
2. NEVER hallucinate or invent prices, materials, or fake products. Only recommend real furniture from FurniAura catalog.
3. Currency is Indian Rupees (₹).
4. You require customer confirmation before adding items to a cart or finalizing an order.
5. If recommending products, mention their key dimensions, materials, and why they pair together harmoniously.`;

    const chatResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `User request: ${lastUserMessage}\nUser profile: ${JSON.stringify(userContext || {})}` }],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        tools: [
          {
            functionDeclarations: [
              searchProductsTool,
              getProductDetailsTool,
              compareProductsTool,
              checkStockAvailabilityTool,
              calculateRoomBudgetTool,
              getOrderStatusTool,
            ],
          },
        ],
      },
    });

    const functionCalls = chatResponse.functionCalls;
    let finalAnswer = chatResponse.text || '';
    let referencedProductIds: string[] = [];

    // If model made tool calls, execute them
    if (functionCalls && functionCalls.length > 0) {
      const toolParts: any[] = [];
      for (const call of functionCalls) {
        let result: any = null;
        if (call.name === 'searchProducts') {
          result = executeCatalogSearch(call.args);
          if (Array.isArray(result)) {
            referencedProductIds.push(...result.map((r: any) => r.id));
          }
        } else if (call.name === 'getProductDetails') {
          result = executeProductDetails((call.args as any)?.productId);
          if (result?.id) referencedProductIds.push(result.id);
        } else if (call.name === 'compareProducts') {
          result = executeCompare((call.args as any)?.productIds || []);
          if (Array.isArray(result)) {
            referencedProductIds.push(...result.map((r: any) => r.id));
          }
        } else if (call.name === 'checkStockAvailability') {
          result = executeCheckStock((call.args as any)?.productId, (call.args as any)?.colorName);
          if (result?.id) referencedProductIds.push(result.id);
        } else if (call.name === 'calculateRoomBudget') {
          result = executeCalculateBudget((call.args as any)?.roomType, (call.args as any)?.targetBudget);
          if (result?.items) {
            referencedProductIds.push(...result.items.map((i: any) => i.id));
          }
        } else if (call.name === 'getOrderStatus') {
          result = executeGetOrder((call.args as any)?.orderIdentifier);
        }

        toolParts.push({
          functionResponse: {
            name: call.name,
            response: { result },
          },
        });
      }

      // Second turn with tool results
      const previousCandidateContent = chatResponse.candidates?.[0]?.content;
      if (previousCandidateContent) {
        const followup = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            { role: 'user', parts: [{ text: lastUserMessage }] },
            previousCandidateContent,
            { role: 'user', parts: toolParts },
          ],
          config: {
            systemInstruction: systemPrompt,
          },
        });

        finalAnswer = followup.text || finalAnswer;
      }
    }

    // Attach suggested product cards from catalog
    const suggestedProducts = products.filter((p) => referencedProductIds.includes(p.id)).slice(0, 3);

    return res.json({
      text: finalAnswer,
      suggestedProducts: suggestedProducts.length > 0 ? suggestedProducts : undefined,
    });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    const fallbackAnswer = generateIntelligentFallback(lastUserMessage);
    return res.json(fallbackAnswer);
  }
});

// AI Room Layout Advice Endpoint
app.post('/api/ai/room-advice', async (req: Request, res: Response) => {
  const { roomType, dimensions, style, palette, currentItems } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      advice: `For a ${dimensions.lengthFt}×${dimensions.widthFt} ft ${roomType} in ${style} style with ${palette} tones, prioritize placing your largest seating piece along the longest wall. Maintain a minimum 36-inch (90cm) walking perimeter around tables and entrances.`,
      recommendedPalette: ['#FAF8F5', '#EBE5DE', '#D2B48C', '#8C6D58'],
      suggestedProducts: products.filter((p) => p.roomType === roomType).slice(0, 2),
    });
  }

  try {
    const prompt = `You are FurniAura's AI Space Planner. Provide concise, professional layout and styling guidance for:
Room Type: ${roomType}
Dimensions: ${dimensions.lengthFt} ft x ${dimensions.widthFt} ft (${Math.round(dimensions.lengthFt * 0.3048 * 10) / 10}m x ${Math.round(dimensions.widthFt * 0.3048 * 10) / 10}m)
Design Style: ${style}
Color Palette: ${palette}
Current Items in Plan: ${JSON.stringify(currentItems || [])}

Provide:
1. 2-3 specific architectural placement rules (focal point, walkways, lighting).
2. Curated complementary material suggestions from solid oak, bouclé, French cane, travertine.
Keep response concise and practical for furniture placement.`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const matchingProds = products.filter((p) => p.roomType === roomType || p.category === 'Lighting').slice(0, 3);

    res.json({
      advice: result.text || 'Arrange furniture to foster open sightlines and natural light flow.',
      suggestedProducts: matchingProds,
    });
  } catch (e) {
    res.json({
      advice: `Maintain at least 3 feet of circulation clearance around your central table and anchor seating with a textured neutral area rug.`,
      suggestedProducts: products.filter((p) => p.roomType === roomType).slice(0, 2),
    });
  }
});

function generateIntelligentFallback(userQuery: string) {
  const q = userQuery.toLowerCase();

  if (q.includes('25000') || q.includes('25,000') || (q.includes('sofa') && q.includes('under'))) {
    const matchingSofa = products.find((p) => p.category === 'Sofas' && p.price <= 25000) || products[1];
    return {
      text: `I recommend our **${matchingSofa.name}** priced at **₹${matchingSofa.price.toLocaleString()}** (regularly ₹${matchingSofa.originalPrice.toLocaleString()}). It features natural flax linen upholstery and solid European ash legs, engineered specifically for mindful, compact living without sacrificing comfort. Would you like me to prepare this for your cart?`,
      suggestedProducts: [matchingSofa],
    };
  }

  if (q.includes('dining table') || q.includes('four people') || q.includes('4 people')) {
    const table = products.find((p) => p.id === 'prod-table-01')!;
    const chairs = products.find((p) => p.id === 'prod-chair-02')!;
    return {
      text: `For four people, our centerpiece is the **${table.name}** (160×90 cm) in solid European white oak (₹${table.price.toLocaleString()}). Its rounded bullnose edges provide generous knee room for four to six diners. It pairs beautifully with the **${chairs.name}**.`,
      suggestedProducts: [table, chairs],
    };
  }

  if (q.includes('small living room') || q.includes('compact')) {
    const sofa = products.find((p) => p.id === 'prod-sofa-02')!;
    const table = products.find((p) => p.id === 'prod-table-02')!;
    const lamp = products.find((p) => p.id === 'prod-lighting-01')!;
    return {
      text: `For a small living room, the secret is low-profile silhouettes and floating vertical lighting. I suggest the **${sofa.name}** (195 cm width) paired with the organic **${table.name}** and the **${lamp.name}** to draw the eye upward and make the room feel expansive.`,
      suggestedProducts: [sofa, table, lamp],
    };
  }

  if (q.includes('compare') || (q.includes('bed') && q.includes('difference'))) {
    const bed1 = products.find((p) => p.id === 'prod-bed-01')!;
    const bed2 = products.find((p) => p.id === 'prod-bed-02')!;
    return {
      text: `Here is a side-by-side comparison:
• **${bed1.name}** (₹${bed1.price.toLocaleString()}): Low-profile Japanese ryokan aesthetic in solid kiln-dried oak with floating nightstands included. Best for serene, open bedrooms.
• **${bed2.name}** (₹${bed2.price.toLocaleString()}): Features German hydraulic gas-lift underbed storage (750L capacity) in tailored linen. Best if you need substantial hidden storage space.`,
      suggestedProducts: [bed1, bed2],
    };
  }

  if (q.includes('bedroom')) {
    const bed = products.find((p) => p.id === 'prod-bed-01')!;
    const wardrobe = products.find((p) => p.id === 'prod-wardrobe-01')!;
    return {
      text: `For your bedroom sanctuary, grounding organic materials create optimal rest. I recommend pairing the **${bed.name}** with the fluted **${wardrobe.name}** for a cohesive Japandi aesthetic.`,
      suggestedProducts: [bed, wardrobe],
    };
  }

  // Default helpful response
  const featured = products.filter((p) => p.isFeatured).slice(0, 3);
  return {
    text: `Hello! I am Aura, your personal interior designer at FurniAura. Whether you are furnishing a new apartment, searching for a dining table for family dinners, or exploring room layouts, I can guide you through our sustainably crafted collection. What room or style are you focusing on today?`,
    suggestedProducts: featured,
  };
}

// Vite Integration Setup
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`FurniAura server active on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
