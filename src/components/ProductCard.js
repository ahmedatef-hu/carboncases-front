import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onAddToWishlist }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (onAddToWishlist) {
      onAddToWishlist(product.id);
    }
  };

  return (
    <div className="group block featured-product-card">
      <Link to={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {isAuthenticated && (
              <button
                onClick={handleAddToWishlist}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-black hover:text-white transition-all duration-300 shadow-lg"
                title="Add to Wishlist"
              >
                <FiHeart size={16} />
              </button>
            )}
          </div>

          {/* Stock Badge */}
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
              Only {product.stock} left!
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
              Out of Stock
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-lg text-black mb-1 line-clamp-2 group-hover:text-gray-600 transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-black">
              LE {product.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 line-through">
              LE {(product.price * 1.2).toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            title={product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
