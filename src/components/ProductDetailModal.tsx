import React, { useState, useEffect } from 'react';
import { useFurniture } from '../context/FurnitureContext';
import { Product, ProductReview } from '../types/furniture';
import {
  X,
  Star,
  Shield,
  Truck,
  Check,
  Heart,
  ShoppingBag,
  ArrowRight,
  Maximize2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    products,
    addToCart,
    toggleWishlist,
    isWishlisted,
    addToRecentlyViewed,
    setIsCartOpen,
  } = useFurniture();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const product = products.find((p) => p.id === selectedProductId);

  useEffect(() => {
    if (selectedProductId) {
      addToRecentlyViewed(selectedProductId);
      setActiveImageIndex(0);
      setSelectedColorIndex(0);
      setQuantity(1);
      setReviewSuccess(false);
    }
  }, [selectedProductId]);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const selectedColor = product.colors[selectedColorIndex] || product.colors[0];

  const handleBuyNow = () => {
    addToCart(product, selectedColor, quantity);
    setSelectedProductId(null);
    setIsCartOpen(true);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: newReviewAuthor,
          rating: newReviewRating,
          comment: newReviewComment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccess(true);
        setNewReviewAuthor('');
        setNewReviewComment('');
        // Append locally to product
        if (product.reviews) {
          product.reviews.unshift(data.review);
        }
      }
    } catch (err) {
      console.error('Review submit failed:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.roomType === product.roomType || p.category === product.category))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EDE5DF] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Header with Close */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8DFD8]">
          <span className="text-xs font-semibold text-[#8C6D58] uppercase tracking-wider">
            {product.brand} · {product.category}
          </span>
          <button
            onClick={() => setSelectedProductId(null)}
            className="p-2 text-[#5A4E47] hover:text-[#2C221E] rounded-full hover:bg-[#EFE9E2] transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-10">
          {/* Main PDP Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Gallery (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#F2ECE6] border border-[#E8DFD8] shadow-xs">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist"
                  className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md transition-colors cursor-pointer ${
                    wishlisted ? 'bg-[#C27A4E] text-white' : 'bg-white/90 text-[#2C221E] hover:text-[#C27A4E]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnail Selector */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'border-[#2C221E] scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Contiguous Purchase Module (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                {/* Rating & In-Stock */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5 font-medium text-[#2C221E]">
                    <Star className="w-4 h-4 fill-[#C27A4E] text-[#C27A4E]" />
                    <span className="font-bold tabular-nums">{product.rating}</span>
                    <span className="text-[#8C7D73]">({product.reviewCount} customer reviews)</span>
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      product.inStock ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {product.inStock ? `In Stock (${product.stockQuantity} available)` : 'Backorder Only'}
                  </span>
                </div>

                {/* Name & Subtitle */}
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C221E] leading-tight mb-2">
                  {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6C63] mb-4">
                  {product.subtitle}
                </p>

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3 p-3.5 bg-white rounded-xl border border-[#EDE5DF] mb-6">
                  <span className="text-2xl font-bold text-[#2C221E] tabular-nums">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-[#9E9086] line-through tabular-nums">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span className="text-xs font-bold text-[#C27A4E] px-2 py-0.5 bg-[#FAF0E8] rounded-md">
                      Save {product.discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-[#2C221E] uppercase tracking-wider mb-2.5">
                    Select Finish: <span className="font-normal text-[#8C7D73]">{selectedColor.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((color, idx) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColorIndex(idx)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                          selectedColorIndex === idx
                            ? 'border-[#2C221E] bg-white text-[#2C221E] shadow-xs'
                            : 'border-[#E8DFD8] bg-[#FAF8F5] text-[#6F6057] hover:bg-white'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-xs font-semibold text-[#2C221E] uppercase tracking-wider">
                    Quantity
                  </label>
                  <div className="flex items-center border border-[#D8CFC8] rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-sm font-semibold text-[#5A4E47] hover:bg-[#F2ECE6] transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-[#2C221E] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-sm font-semibold text-[#5A4E47] hover:bg-[#F2ECE6] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => addToCart(product, selectedColor, quantity)}
                    className="flex-1 py-3.5 px-4 bg-[#2C221E] hover:bg-[#433731] text-white text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-3.5 px-4 bg-[#C27A4E] hover:bg-[#B36B40] text-white text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Trust Callouts */}
              <div className="space-y-2 pt-4 border-t border-[#E8DFD8] text-xs text-[#7A6C63]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#8C6D58]" />
                  <span>White-glove delivery in {product.deliveryDays || 3} business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#8C6D58]" />
                  <span>{product.warrantyYears || 5}-year structural timber warranty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Specifications Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#E8DFD8]">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#2C221E] mb-3">
                Design & Craftsmanship
              </h3>
              <p className="text-xs sm:text-sm text-[#5A4E47] leading-relaxed mb-4">
                {product.description}
              </p>
              <ul className="space-y-2">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#5A4E47]">
                    <Check className="w-4 h-4 text-[#C27A4E] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl font-semibold text-[#2C221E] mb-3">
                Dimensions & Specifications
              </h3>
              <div className="bg-white rounded-xl border border-[#EDE5DF] overflow-hidden text-xs">
                <div className="flex justify-between p-3 border-b border-[#F2ECE6]">
                  <span className="text-[#8C7D73]">Overall Dimensions</span>
                  <span className="font-semibold text-[#2C221E] tabular-nums">
                    {product.dimensions.width}W × {product.dimensions.depth}D × {product.dimensions.height}H {product.dimensions.unit}
                  </span>
                </div>
                <div className="flex justify-between p-3 border-b border-[#F2ECE6]">
                  <span className="text-[#8C7D73]">Primary Material</span>
                  <span className="font-semibold text-[#2C221E]">{product.material}</span>
                </div>
                <div className="flex justify-between p-3 border-b border-[#F2ECE6]">
                  <span className="text-[#8C7D73]">Seating / Capacity</span>
                  <span className="font-semibold text-[#2C221E]">
                    {product.seatingCapacity ? `${product.seatingCapacity} Persons` : 'Standard'}
                  </span>
                </div>
                <div className="flex justify-between p-3 border-b border-[#F2ECE6]">
                  <span className="text-[#8C7D73]">Assembly</span>
                  <span className="font-semibold text-[#2C221E]">
                    {product.assemblyRequired ? 'Assembly Included' : 'No Assembly Required'}
                  </span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-[#8C7D73]">Warranty</span>
                  <span className="font-semibold text-[#2C221E]">{product.warrantyYears || 5} Years Structural</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-8 border-t border-[#E8DFD8]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#2C221E]">
                  Customer Reviews
                </h3>
                <p className="text-xs text-[#8C7D73]">
                  Rated {product.rating} out of 5 based on verified owner experiences
                </p>
              </div>
            </div>

            {/* Existing Reviews */}
            <div className="space-y-3 mb-8">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white rounded-xl border border-[#EDE5DF] text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#2C221E]">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[#8C7D73] text-[11px]">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#C27A4E] mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-[#C27A4E]' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[#5A4E47] leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#8C7D73]">No customer reviews yet. Be the first to share your thoughts!</p>
              )}
            </div>

            {/* Write a Review Form */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8DFD8]">
              <h4 className="font-serif text-base font-semibold text-[#2C221E] mb-3">
                Write a Review
              </h4>
              {reviewSuccess ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Thank you! Your verified review has been posted.</span>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#2C221E] uppercase mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="e.g. Maya Krishnan"
                        className="w-full text-xs p-2.5 bg-white border border-[#D8CFC8] rounded-lg text-[#2C221E] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#2C221E] uppercase mb-1">
                        Rating
                      </label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full text-xs p-2.5 bg-white border border-[#D8CFC8] rounded-lg text-[#2C221E] outline-hidden cursor-pointer"
                      >
                        <option value={5}>5 Stars - Exceptional Craftsmanship</option>
                        <option value={4}>4 Stars - Very Pleased</option>
                        <option value={3}>3 Stars - Average</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#2C221E] uppercase mb-1">
                      Your Experience
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Comment on comfort, wood finish, delivery experience..."
                      className="w-full text-xs p-2.5 bg-white border border-[#D8CFC8] rounded-lg text-[#2C221E] outline-hidden"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-5 py-2 bg-[#2C221E] text-white text-xs font-semibold rounded-lg hover:bg-[#433731] transition-colors cursor-pointer"
                  >
                    {isSubmittingReview ? 'Posting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Related Recommendations */}
          {relatedProducts.length > 0 && (
            <div className="pt-8 border-t border-[#E8DFD8]">
              <h3 className="font-serif text-xl font-semibold text-[#2C221E] mb-4">
                Recommended Companions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => setSelectedProductId(rel.id)}
                    className="group bg-white p-3 rounded-xl border border-[#EDE5DF] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#F2ECE6] mb-2">
                      <img src={rel.images[0]} alt={rel.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-[#2C221E] line-clamp-1 mb-1">
                        {rel.name}
                      </h4>
                      <p className="text-xs font-bold text-[#2C221E] tabular-nums">
                        ₹{rel.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
