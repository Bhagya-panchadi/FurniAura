import React, { useState } from 'react';
import { Product } from '../types/furniture';
import { useFurniture } from '../context/FurnitureContext';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProductId, addToCart, toggleWishlist, isWishlisted } = useFurniture();
  const [imageError, setImageError] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const wishlisted = isWishlisted(product.id);
  const primaryImage = product.images[0] || '';

  return (
    <div className="group relative flex flex-col bg-[#FFFFFF] rounded-2xl border border-[#EDE5DF] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#D8CFC8]">
      {/* Visual Area */}
      <div
        onClick={() => setSelectedProductId(product.id)}
        className="relative w-full aspect-4/3 bg-[#F7F3EE] overflow-hidden cursor-pointer"
      >
        {!imageError && primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-[#F5EFEB] to-[#E8DFD8] p-4 text-center">
            <span className="text-2xl font-serif text-[#8C6D58] mb-1">FurniAura</span>
            <span className="text-xs text-[#6F6057] font-medium">{product.name}</span>
          </div>
        )}

        {/* Quiet Tag */}
        {product.isBestseller && (
          <span className="absolute top-3 left-3 text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[#2C221E] rounded-md shadow-xs">
            Bestseller
          </span>
        )}
        {!product.isBestseller && product.isNewArrival && (
          <span className="absolute top-3 left-3 text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[#8C6D58] rounded-md shadow-xs">
            New Arrival
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors cursor-pointer ${
            wishlisted
              ? 'bg-[#C27A4E] text-white shadow-xs'
              : 'bg-white/90 text-[#5A4E47] hover:text-[#C27A4E] shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductId(product.id);
            }}
            className="flex-1 py-2 px-3 bg-white/95 text-[#2C221E] text-xs font-semibold rounded-lg shadow-md hover:bg-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#8C6D58]" />
            Quick View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, product.colors[selectedColorIndex]);
            }}
            className="p-2 bg-[#2C221E] text-white rounded-lg shadow-md hover:bg-[#433731] transition-colors cursor-pointer"
            aria-label="Add to cart"
            title="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#8C7D73] mb-1.5">
            <span className="uppercase tracking-wider font-medium text-[11px]">
              {product.category} · {product.roomType}
            </span>
            <div className="flex items-center gap-1 text-[#2C221E] font-medium">
              <Star className="w-3.5 h-3.5 fill-[#C27A4E] text-[#C27A4E]" />
              <span className="tabular-nums">{product.rating}</span>
              <span className="text-[#8C7D73]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setSelectedProductId(product.id)}
            className="font-serif text-base sm:text-lg font-semibold text-[#2C221E] leading-snug line-clamp-1 hover:text-[#C27A4E] transition-colors cursor-pointer mb-1"
          >
            {product.name}
          </h3>

          {/* Material callout */}
          <p className="text-xs text-[#7A6C63] line-clamp-1 mb-3">
            {product.material}
          </p>
        </div>

        {/* Color Palette Indicators & Pricing */}
        <div>
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.colors.map((color, idx) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColorIndex(idx);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                    selectedColorIndex === idx
                      ? 'ring-2 ring-offset-1 ring-[#2C221E] scale-110'
                      : 'border-black/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name}${color.inStock ? '' : ' (Out of stock)'}`}
                />
              ))}
              <span className="text-[11px] text-[#8C7D73] ml-1">
                {product.colors[selectedColorIndex]?.name}
              </span>
            </div>
          )}

          {/* Price Line */}
          <div className="flex items-baseline justify-between pt-2 border-t border-[#F2ECE6]">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#2C221E] tabular-nums">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-[#9E9086] line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.discountPercentage > 0 && (
              <span className="text-xs font-semibold text-[#B85D35] tabular-nums">
                {product.discountPercentage}% off
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
