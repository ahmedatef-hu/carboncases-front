import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import ProductImage from './ProductImage';
import api from '../utils/api';

const ProductCard = ({ product, onAddToWishlist }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addedToWishlist, setAddedToWishlist] = useState(false);

  // Get product images (use image_count from backend or default to 1)
  const imageCount = product.image_count || 0;
  const hasMultipleImages = imageCount > 1;

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await api.post('/wishlist', { productId: product.id });
      setAddedToWishlist(true);
      setTimeout(() => setAddedToWishlist(false), 2000);
      
      if (onAddToWishlist) {
        onAddToWishlist(product.id);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (error.response?.status === 400) {
        alert('Already in wishlist!');
      }
    }
  };

  return (
    <div className="group block product-card-dark rounded-2xl">
      <Link to={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-900 to-black rounded-t-2xl">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
            {isAuthenticated && (
              <button
                onClick={handleAddToWishlist}
                className={`backdrop-blur-sm p-3 rounded-full transition-all duration-300 shadow-glow-orange border ${
                  addedToWishlist 
                    ? 'bg-orange-500 border-orange-500 scale-110' 
                    : 'bg-black/80 border-orange-500/30 hover:bg-orange-500 hover:scale-110'
                }`}
                title={addedToWishlist ? 'Added to Wishlist!' : 'Add to Wishlist'}
              >
                <FiHeart size={18} className={`transition-all duration-300 ${
                  addedToWishlist ? 'text-white fill-white' : 'text-white'
                }`} />
              </button>
            )}
          </div>

          {/* Stock Badge */}
          {(product.stock_quantity || 0) < 10 && (product.stock_quantity || 0) > 0 && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-2 rounded-full uppercase tracking-wide glow-orange">
              Only {product.stock_quantity} left!
            </div>
          )}
          {(product.stock_quantity || 0) === 0 && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-gray-800 to-black text-white text-xs font-bold px-3 py-2 rounded-full uppercase tracking-wide">
              Out of Stock
            </div>
          )}

          {/* Hover Border Glow */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500/50 rounded-t-2xl transition-all duration-500"></div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6 space-y-4 bg-gradient-to-b from-gray-900 to-black rounded-b-2xl">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-xl text-white mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        {/* Image Count Indicator */}
        {hasMultipleImages && (
          <div className="flex items-center space-x-2 text-sm text-orange-400">
            <div className="flex space-x-1">
              {[...Array(Math.min(imageCount, 5))].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-orange-500 rounded-full"></div>
              ))}
              {imageCount > 5 && <span className="text-xs ml-1">+{imageCount - 5}</span>}
            </div>
            <span>{imageCount} images</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product.has_magsafe_option && product.price_without_magsafe ? (
              <>
                <span className="text-lg font-bold text-white">
                  From LE {(parseFloat(product.price_without_magsafe) || 0).toLocaleString()}
                </span>
                <span className="text-xs text-orange-400">
                  With MagSafe: LE {(parseFloat(product.price_with_magsafe) || 0).toLocaleString()}
                </span>
              </>
            ) : product.price ? (
              <>
                <span className="text-2xl font-bold text-white">
                  LE {(parseFloat(product.price || 0)).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  LE {(parseFloat(product.price || 0) * 1.2).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-orange-400">
                Price not available
              </span>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/products/${product.id}`);
            }}
            disabled={(product.stock_quantity || 0) === 0}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 rounded-full hover:from-red-600 hover:to-orange-500 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-orange transform hover:scale-110"
            title={(product.stock_quantity || 0) === 0 ? 'Sold Out' : 'View Details'}
          >
            <FiShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
