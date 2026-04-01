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
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-secondary rounded-xl overflow-hidden border border-gray-800 hover:border-accent transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {isAuthenticated && (
              <button
                onClick={handleAddToWishlist}
                className="bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-accent hover:text-primary transition-colors"
              >
                <FiHeart size={18} />
              </button>
            )}
          </div>

          {/* Stock Badge */}
          {product.stock < 10 && product.stock > 0 && (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-4 left-4 bg-gray-600 text-white text-xs px-3 py-1 rounded-full">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-accent">${product.price}</span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-accent text-primary px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart size={18} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
