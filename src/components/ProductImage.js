import React, { useState } from 'react';
import { FiImage } from 'react-icons/fi';

/**
 * ProductImage Component
 * 
 * Handles image loading with fallback for broken/missing images
 * Automatically shows placeholder if image fails to load
 */
const ProductImage = ({ src, alt, className = '', fallbackClassName = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Reset states when src changes
  React.useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [src]);

  const handleImageError = (e) => {
    console.error(`❌ Image failed to load:`, src);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Show placeholder if image failed to load or src is empty
  if (imageError || !src) {
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-black/50 ${fallbackClassName || className}`}
        title={imageError ? "Image failed to load" : "No image available"}
      >
        <div className="text-center">
          <FiImage className="w-8 h-8 text-white/30 mx-auto mb-2" />
          <p className="text-xs text-white/40">No Image</p>
          {imageError && src && (
            <p className="text-xs text-red-400 mt-1">Failed</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-black/50">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

export default ProductImage;
