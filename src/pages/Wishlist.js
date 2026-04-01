import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    // Prevent admin from accessing wishlist
    const isAdmin = !!localStorage.getItem('adminToken');
    if (isAdmin) {
      window.location.href = '/admin/dashboard';
      return;
    }
    
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist(wishlist.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 fade-in">
        <div className="text-center">
          <FiHeart size={64} className="mx-auto mb-4 text-gray-600" />
          <h2 className="font-serif text-3xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-8">Save your favorite items for later</p>
          <Link
            to="/products"
            className="inline-block bg-accent text-primary px-8 py-3 rounded-lg hover:bg-accent-hover transition-colors font-semibold"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 fade-in">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl font-bold mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(product => (
            <div key={product.id} className="bg-secondary rounded-xl overflow-hidden border border-gray-800 hover:border-accent transition-all">
              <Link to={`/products/${product.id}`}>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </Link>

              <div className="p-5">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg mb-2 hover:text-accent transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-accent font-bold text-xl mb-4">${product.price}</p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="flex-1 bg-accent text-primary px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <FiShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="bg-primary border border-gray-800 px-4 py-2 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
