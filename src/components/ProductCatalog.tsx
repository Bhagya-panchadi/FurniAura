import React, { useState, useMemo } from 'react';
import { useFurniture } from '../context/FurnitureContext';
import { ProductCard } from './ProductCard';
import { FurnitureCategory, RoomType } from '../types/furniture';
import { Filter, SlidersHorizontal, RotateCcw, Search, ChevronDown, Check } from 'lucide-react';

const CATEGORIES: FurnitureCategory[] = [
  'All',
  'Sofas',
  'Beds',
  'Chairs',
  'Tables',
  'Wardrobes',
  'Lighting',
  'Home Decor',
];

const ROOM_TYPES: RoomType[] = [
  'All',
  'Living Room',
  'Bedroom',
  'Dining Room',
  'Home Office',
];

const MATERIALS = [
  'All',
  'Solid White Oak',
  'Bouclé Fabric',
  'Natural Linen',
  'Solid American Walnut',
  'Natural Travertine Stone',
  'Brushed Solid Brass',
];

const BRANDS = ['All', 'Aura Studio', 'Nordic Form', 'Soma Craft', 'Maison Terre'];

export const ProductCatalog: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    selectedCategory,
    setSelectedCategory,
    selectedRoomType,
    setSelectedRoomType,
    searchQuery,
    setSearchQuery,
  } = useFurniture();

  const [priceRange, setPriceRange] = useState<number>(60000);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortOption, setSortOption] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('popular');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (selectedRoomType !== 'All' && p.roomType !== selectedRoomType) return false;
        if (p.price > priceRange) return false;
        if (selectedMaterial !== 'All' && !p.material.toLowerCase().includes(selectedMaterial.toLowerCase())) return false;
        if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
        if (minRating > 0 && p.rating < minRating) return false;
        if (inStockOnly && !p.inStock) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.subtitle.toLowerCase().includes(q) ||
            p.material.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price_asc') return a.price - b.price;
        if (sortOption === 'price_desc') return b.price - a.price;
        if (sortOption === 'rating') return b.rating - a.rating;
        if (sortOption === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return b.reviewCount - a.reviewCount; // popular
      });
  }, [
    products,
    selectedCategory,
    selectedRoomType,
    priceRange,
    selectedMaterial,
    selectedBrand,
    minRating,
    inStockOnly,
    searchQuery,
    sortOption,
  ]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedRoomType('All');
    setPriceRange(60000);
    setSelectedMaterial('All');
    setSelectedBrand('All');
    setMinRating(0);
    setInStockOnly(false);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedRoomType !== 'All' ||
    priceRange < 60000 ||
    selectedMaterial !== 'All' ||
    selectedBrand !== 'All' ||
    minRating > 0 ||
    inStockOnly ||
    searchQuery !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Catalog Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C221E] mb-1">
            Furniture Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#8C7D73]">
            Showing <span className="font-semibold text-[#2C221E]">{filteredProducts.length}</span> curated pieces crafted for mindful living
          </p>
        </div>

        {/* Search input in catalog */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8C7D73] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by piece, finish, or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D8CFC8] rounded-xl text-xs text-[#2C221E] placeholder:text-[#9E9086] outline-hidden focus:border-[#2C221E] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C7D73] hover:text-[#2C221E]"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3.5 py-2.5 bg-white border border-[#D8CFC8] rounded-xl text-xs font-semibold text-[#2C221E] flex items-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Primary Category Tabs */}
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-[#E8DFD8] overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-medium rounded-full transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#2C221E] text-white shadow-xs font-semibold'
                : 'bg-white text-[#5A4E47] border border-[#EDE5DF] hover:bg-[#F5EFEB]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Sidebar Filters (Desktop) + Product Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block fixed inset-0 z-50 bg-black/40 lg:relative lg:bg-transparent' : 'hidden'
          }`}
        >
          <div
            className={`bg-white rounded-2xl border border-[#EDE5DF] p-6 space-y-6 max-h-[85vh] lg:max-h-none overflow-y-auto ${
              mobileFilterOpen ? 'm-4 max-w-sm ml-auto shadow-2xl relative' : ''
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE6]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#8C6D58]" />
                <h3 className="font-semibold text-sm text-[#2C221E]">Refine Filters</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-[#8C6D58] hover:text-[#2C221E] font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
              {mobileFilterOpen && (
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="lg:hidden text-sm text-[#8C7D73] font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-2.5">
                Room Type
              </label>
              <div className="space-y-1.5">
                {ROOM_TYPES.map((room) => (
                  <button
                    key={room}
                    onClick={() => setSelectedRoomType(room)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                      selectedRoomType === room
                        ? 'bg-[#F5EFEB] text-[#2C221E] font-semibold'
                        : 'text-[#6F6057] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>{room}</span>
                    {selectedRoomType === room && <Check className="w-3.5 h-3.5 text-[#C27A4E]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <label className="font-semibold text-[#2C221E] uppercase tracking-wider">
                  Max Price
                </label>
                <span className="font-bold text-[#2C221E] tabular-nums">
                  ₹{priceRange.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="4000"
                max="60000"
                step="2000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#2C221E] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8C7D73] mt-1">
                <span>₹4,000</span>
                <span>₹60,000</span>
              </div>
            </div>

            {/* Material */}
            <div>
              <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-2">
                Material
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#D8CFC8] rounded-lg text-[#2C221E] outline-hidden cursor-pointer"
              >
                {MATERIALS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full text-xs p-2 bg-[#FAF8F5] border border-[#D8CFC8] rounded-lg text-[#2C221E] outline-hidden cursor-pointer"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Rating */}
            <div>
              <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-2">
                Customer Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[0, 4.5, 4.8].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setMinRating(rate)}
                    className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
                      minRating === rate
                        ? 'bg-[#2C221E] text-white border-[#2C221E]'
                        : 'border-[#EDE5DF] text-[#6F6057] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {rate === 0 ? 'All' : `${rate}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-[#F2ECE6]">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-[#2C221E] font-medium">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#2C221E] rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {/* Sorting Bar */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#EDE5DF]">
            <span className="text-xs text-[#8C7D73]">
              {filteredProducts.length} items found
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6F6057]">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e: any) => setSortOption(e.target.value)}
                className="text-xs font-semibold text-[#2C221E] bg-transparent border-0 outline-hidden cursor-pointer"
              >
                <option value="popular">Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Grid of Products */}
          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-white rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#EDE5DF] p-12 text-center">
              <h3 className="font-serif text-xl font-semibold text-[#2C221E] mb-2">
                No furniture matches your criteria
              </h3>
              <p className="text-xs text-[#8C7D73] max-w-md mx-auto mb-6">
                Try widening your price range, clearing filters, or asking Aura AI to search our full catalog for custom alternatives.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-[#2C221E] text-white text-xs font-semibold rounded-xl hover:bg-[#433731] transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
