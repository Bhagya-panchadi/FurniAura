import React, { useState } from 'react';
import { useFurniture } from '../context/FurnitureContext';
import { RoomType, DesignStyle, RoomPlacerItem, Product } from '../types/furniture';
import {
  Compass,
  RotateCw,
  Trash2,
  Plus,
  Save,
  ShoppingBag,
  Sparkles,
  Check,
  Move,
  Layers,
  Info,
} from 'lucide-react';

const STYLES: DesignStyle[] = [
  'Japandi',
  'Minimalist',
  'Scandinavian',
  'Modern Luxury',
  'Mid-Century Modern',
  'Organic Modern',
];

const PALETTES = [
  { name: 'Warm Cream & Oak', colors: ['#FAF8F5', '#EBE5DE', '#D2B48C', '#8C6D58'] },
  { name: 'Earthy Terracotta', colors: ['#FAF5F0', '#E5DDD4', '#C27A4E', '#523825'] },
  { name: 'Muted Sage & Sand', colors: ['#F6F8F5', '#DFD8D0', '#949E8B', '#3E4739'] },
  { name: 'Midnight & Brass', colors: ['#F5F5F5', '#E0D7CC', '#CFB53B', '#2C221E'] },
];

export const RoomPlanner: React.FC = () => {
  const { products, addToCart, saveRoomDesign, setIsCartOpen } = useFurniture();

  const [roomType, setRoomType] = useState<RoomType>('Living Room');
  const [dimensions, setDimensions] = useState({ lengthFt: 18, widthFt: 14 });
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle>('Japandi');
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0]);

  // Placed Furniture Items on the 2D Canvas
  const [placedItems, setPlacedItems] = useState<RoomPlacerItem[]>([
    {
      instanceId: 'item-init-1',
      productId: 'prod-sofa-01',
      name: 'Aura Organic Curved Bouclé Sofa',
      category: 'Sofas',
      image: '/src/assets/images/boucle_curve_sofa_1790604819882.jpg',
      x: 35,
      y: 40,
      rotation: 0,
      width: 140,
      length: 65,
      price: 34999,
    },
    {
      instanceId: 'item-init-2',
      productId: 'prod-table-02',
      name: 'Travertine & Oak Coffee Table',
      category: 'Tables',
      image: '/src/assets/images/hero_living_room_1790604809160.jpg',
      x: 35,
      y: 65,
      rotation: 0,
      width: 80,
      length: 50,
      price: 18999,
    },
  ]);

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(0);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [catalogPickerOpen, setCatalogPickerOpen] = useState(false);

  // Total bundle price
  const totalCost = placedItems.reduce((sum, item) => sum + item.price, 0);

  // Move item
  const moveItem = (index: number, dx: number, dy: number) => {
    setPlacedItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const newX = Math.max(5, Math.min(85, item.x + dx));
        const newY = Math.max(5, Math.min(85, item.y + dy));
        return { ...item, x: newX, y: newY };
      })
    );
  };

  // Rotate item by 90 degrees
  const rotateItem = (index: number) => {
    setPlacedItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  // Delete item from canvas
  const removeItem = (index: number) => {
    setPlacedItems((prev) => prev.filter((_, i) => i !== index));
    setSelectedItemIndex(null);
  };

  // Add catalog product into canvas
  const addProductToCanvas = (product: Product) => {
    const newItem: RoomPlacerItem = {
      instanceId: `placed-${Date.now()}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      image: product.images[0],
      x: 45 + (placedItems.length % 3) * 5,
      y: 40 + (placedItems.length % 3) * 5,
      rotation: 0,
      width: Math.min(130, Math.max(50, Math.round(product.dimensions.width * 0.55))),
      length: Math.min(100, Math.max(45, Math.round(product.dimensions.depth * 0.55))),
      price: product.price,
    };
    setPlacedItems((prev) => [...prev, newItem]);
    setSelectedItemIndex(placedItems.length);
    setCatalogPickerOpen(false);
  };

  // Fetch AI Room Advice from Gemini
  const handleGetAiAdvice = async () => {
    setIsLoadingAdvice(true);
    try {
      const res = await fetch('/api/ai/room-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomType,
          dimensions,
          style: selectedStyle,
          palette: selectedPalette.name,
          currentItems: placedItems.map((p) => ({ name: p.name, category: p.category })),
        }),
      });
      const data = await res.json();
      setAiAdvice(data.advice || 'Ensure ample clearance around entrances and conversational sightlines.');
    } catch (e) {
      setAiAdvice('Maintain at least 3 feet of circulation pathways between major seating elements and doorways.');
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  // Save room design
  const handleSaveDesign = async () => {
    await saveRoomDesign({
      name: `${selectedStyle} ${roomType}`,
      roomType,
      dimensions,
      style: selectedStyle,
      palette: selectedPalette.name,
      items: placedItems,
      totalCost,
      aiNotes: aiAdvice || undefined,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Add all bundle items to cart
  const handleAddBundleToCart = () => {
    for (const item of placedItems) {
      const p = products.find((prod) => prod.id === item.productId);
      if (p) {
        addToCart(p);
      }
    }
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6D58] uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-[#C27A4E]" />
            <span>Interactive Spatial Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C221E]">
            AI Room Planner & Layout Designer
          </h1>
          <p className="text-xs sm:text-sm text-[#8C7D73] mt-1">
            Configure room dimensions, experiment with architectural furniture placement, and calculate your complete sanctuary bundle.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDesign}
            className="px-4 py-2.5 bg-white border border-[#D8CFC8] hover:border-[#2C221E] text-[#2C221E] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Saved to Profile</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#8C6D58]" />
                <span>Save Design</span>
              </>
            )}
          </button>

          <button
            onClick={handleAddBundleToCart}
            disabled={placedItems.length === 0}
            className="px-5 py-2.5 bg-[#2C221E] hover:bg-[#433731] disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add Bundle to Cart (₹{totalCost.toLocaleString()})</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Controls & 2D Layout Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Room Configuration Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-[#EDE5DF] p-6 space-y-6 shadow-xs">
            {/* Room Type */}
            <div>
              <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-2">
                1. Room Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Living Room', 'Bedroom', 'Dining Room', 'Home Office'] as RoomType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setRoomType(type)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                      roomType === type
                        ? 'border-[#2C221E] bg-[#FAF8F5] text-[#2C221E] font-semibold'
                        : 'border-[#EDE5DF] text-[#6F6057] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Dimensions */}
            <div>
              <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-2">
                2. Dimensions (Feet)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-[#8C7D73] block mb-1">Length (ft)</span>
                  <input
                    type="number"
                    min="8"
                    max="40"
                    value={dimensions.lengthFt}
                    onChange={(e) => setDimensions({ ...dimensions, lengthFt: Number(e.target.value) })}
                    className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#D8CFC8] rounded-lg text-[#2C221E] outline-hidden font-semibold"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-[#8C7D73] block mb-1">Width (ft)</span>
                  <input
                    type="number"
                    min="8"
                    max="40"
                    value={dimensions.widthFt}
                    onChange={(e) => setDimensions({ ...dimensions, widthFt: Number(e.target.value) })}
                    className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#D8CFC8] rounded-lg text-[#2C221E] outline-hidden font-semibold"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#8C7D73] mt-1.5">
                Area: <span className="font-semibold text-[#2C221E]">{dimensions.lengthFt * dimensions.widthFt} sq. ft</span> (approx. {Math.round(dimensions.lengthFt * 0.3048 * dimensions.widthFt * 0.3048)} m²)
              </p>
            </div>

            {/* Interior Design Style */}
            <div>
              <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-2">
                3. Design Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e: any) => setSelectedStyle(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-[#D8CFC8] rounded-lg text-[#2C221E] outline-hidden cursor-pointer"
              >
                {STYLES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Palette */}
            <div>
              <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-2">
                4. Color Palette
              </label>
              <div className="space-y-2">
                {PALETTES.map((pal) => (
                  <button
                    key={pal.name}
                    onClick={() => setSelectedPalette(pal)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      selectedPalette.name === pal.name
                        ? 'border-[#2C221E] bg-[#FAF8F5]'
                        : 'border-[#EDE5DF] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="text-xs font-medium text-[#2C221E]">{pal.name}</span>
                    <div className="flex items-center gap-1">
                      {pal.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Room Advice Button */}
            <div className="pt-2 border-t border-[#F2ECE6]">
              <button
                onClick={handleGetAiAdvice}
                disabled={isLoadingAdvice}
                className="w-full py-2.5 px-4 bg-[#C27A4E] hover:bg-[#B36B40] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoadingAdvice ? 'Analyzing Layout...' : 'Generate AI Layout Guidance'}</span>
              </button>
            </div>
          </div>

          {/* AI Guidance Box */}
          {aiAdvice && (
            <div className="bg-[#FAF8F5] border border-[#E7C19D] rounded-2xl p-5 text-xs text-[#2C221E] space-y-2 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#8C6D58]">
                <Sparkles className="w-4 h-4 text-[#C27A4E]" />
                <span>Aura Space Architecture Advice</span>
              </div>
              <p className="leading-relaxed text-[#5A4E47] whitespace-pre-line">
                {aiAdvice}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: 2D Interactive Canvas & Placed Furniture List (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Canvas Card */}
          <div className="bg-white rounded-3xl border border-[#EDE5DF] p-6 shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F2ECE6]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8C6D58]" />
                <h3 className="font-semibold text-sm text-[#2C221E]">
                  2D Floorplan View ({dimensions.lengthFt} × {dimensions.widthFt} ft)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCatalogPickerOpen(true)}
                  className="px-3.5 py-1.5 bg-[#2C221E] hover:bg-[#433731] text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Furniture</span>
                </button>
              </div>
            </div>

            {/* 2D Interactive Floorplan Box */}
            <div className="relative w-full aspect-16/10 bg-[#FAF8F5] rounded-2xl border-2 border-dashed border-[#D8CFC8] overflow-hidden flex items-center justify-center p-6 shadow-inner">
              {/* Floor grid markers */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(#2C221E 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Architectural Perimeter & Scale */}
              <div className="absolute top-2 left-3 text-[10px] font-mono text-[#8C7D73]">
                Wall: {dimensions.lengthFt} ft
              </div>
              <div className="absolute top-1/2 left-2 -translate-y-1/2 -rotate-90 text-[10px] font-mono text-[#8C7D73]">
                Wall: {dimensions.widthFt} ft
              </div>

              {/* Entrance Marker */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#D8CFC8] text-[#2C221E] text-[9px] font-mono font-bold rounded-t-sm uppercase tracking-wider">
                Door Entrance (36")
              </div>

              {/* Placed Furniture Elements */}
              {placedItems.map((item, index) => {
                const isSelected = selectedItemIndex === index;
                return (
                  <div
                    key={item.instanceId}
                    onClick={() => setSelectedItemIndex(index)}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                      width: `${item.width}px`,
                      height: `${item.length}px`,
                    }}
                    className={`absolute rounded-xl transition-all shadow-md flex flex-col items-center justify-center p-1.5 select-none cursor-pointer border ${
                      isSelected
                        ? 'border-[#2C221E] ring-2 ring-[#C27A4E] bg-white z-20'
                        : 'border-[#EDE5DF] bg-[#FAF8F5] hover:border-[#8C7D73] z-10'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain pointer-events-none rounded"
                    />
                    <div className="absolute inset-x-1 bottom-1 text-[9px] font-semibold text-[#2C221E] bg-white/90 rounded px-1 text-center truncate pointer-events-none">
                      {item.name}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selection Controls (Rotate, Nudge, Delete) */}
            {selectedItemIndex !== null && placedItems[selectedItemIndex] && (
              <div className="mt-4 p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE5DF] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#2C221E]">
                    Selected: {placedItems[selectedItemIndex].name}
                  </span>
                  <span className="text-[#8C7D73]">
                    (₹{placedItems[selectedItemIndex].price.toLocaleString()})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Directional Nudge */}
                  <div className="flex items-center border border-[#D8CFC8] rounded-lg bg-white">
                    <button
                      onClick={() => moveItem(selectedItemIndex, -5, 0)}
                      className="px-2 py-1 text-[#2C221E] hover:bg-[#F2ECE6]"
                      title="Move Left"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => moveItem(selectedItemIndex, 5, 0)}
                      className="px-2 py-1 text-[#2C221E] hover:bg-[#F2ECE6]"
                      title="Move Right"
                    >
                      →
                    </button>
                    <button
                      onClick={() => moveItem(selectedItemIndex, 0, -5)}
                      className="px-2 py-1 text-[#2C221E] hover:bg-[#F2ECE6]"
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveItem(selectedItemIndex, 0, 5)}
                      className="px-2 py-1 text-[#2C221E] hover:bg-[#F2ECE6]"
                      title="Move Down"
                    >
                      ↓
                    </button>
                  </div>

                  {/* Rotate */}
                  <button
                    onClick={() => rotateItem(selectedItemIndex)}
                    className="px-3 py-1 bg-white border border-[#D8CFC8] hover:border-[#2C221E] text-[#2C221E] rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate</span>
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(selectedItemIndex)}
                    className="px-3 py-1 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bundle Itemized List */}
          <div className="bg-white rounded-3xl border border-[#EDE5DF] p-6 shadow-xs">
            <h3 className="font-serif text-lg font-semibold text-[#2C221E] mb-4">
              Placed Furniture Pieces ({placedItems.length})
            </h3>
            <div className="divide-y divide-[#F2ECE6]">
              {placedItems.map((item, idx) => (
                <div key={item.instanceId} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-[#FAF8F5]"
                    />
                    <div>
                      <p className="font-semibold text-[#2C221E]">{item.name}</p>
                      <p className="text-[#8C7D73]">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#2C221E] tabular-nums">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-[#8C7D73] hover:text-rose-600 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Footer */}
            <div className="mt-4 pt-4 border-t border-[#E8DFD8] flex items-center justify-between text-sm">
              <span className="font-semibold text-[#2C221E]">Total Room Design Value:</span>
              <span className="text-lg font-bold text-[#2C221E] tabular-nums">
                ₹{totalCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Item Picker Modal */}
      {catalogPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 max-h-[80vh] flex flex-col shadow-2xl border border-[#EDE5DF]">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2ECE6] mb-4">
              <h3 className="font-serif text-lg font-semibold text-[#2C221E]">
                Select Furniture to Place in {roomType}
              </h3>
              <button
                onClick={() => setCatalogPickerOpen(false)}
                className="text-[#8C7D73] hover:text-[#2C221E]"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => addProductToCanvas(prod)}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#EDE5DF] hover:border-[#2C221E] hover:bg-[#FAF8F5] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-white"
                    />
                    <div>
                      <h4 className="font-semibold text-xs text-[#2C221E]">{prod.name}</h4>
                      <p className="text-[11px] text-[#8C7D73]">
                        {prod.material} · {prod.dimensions.width}×{prod.dimensions.depth} cm
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#2C221E] tabular-nums">
                      ₹{prod.price.toLocaleString()}
                    </span>
                    <button className="px-3 py-1 bg-[#2C221E] text-white text-xs font-medium rounded-lg">
                      Place
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
