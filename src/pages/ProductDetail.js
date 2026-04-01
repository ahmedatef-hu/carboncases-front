import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiMinus, FiPlus, FiCheck, FiShield, FiZap, FiStar } from 'react-icons/fi';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await api.post('/wishlist', { productId: product.id });
      alert('Added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-black">Product not found</h2>
          <button 
            onClick={() => navigate('/products')} 
            className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiArrowLeft />
            <span>Back to Products</span>
          </button>
        </div>
      </div>
    );
  }

  const originalPrice = (parseFloat(product.price) * 1.2).toFixed(2);

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-black transition-colors font-medium"
          >
            <FiArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-xl">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Stock Badge */}
            {product.stock < 10 && product.stock > 0 && (
              <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                Only {product.stock} left!
              </div>
            )}
            
            {/* Premium Badge */}
            <div className="absolute top-6 right-6 bg-black text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
              Premium Quality
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">(4.9) • 127 reviews</span>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl font-black text-black leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-black text-black">
                  LE {parseFloat(product.price).toLocaleString()}
                </div>
                <div className="text-2xl text-gray-400 line-through">
                  LE {parseFloat(originalPrice).toLocaleString()}
                </div>
                <div className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">
                  Save 17%
                </div>
              </div>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-semibold text-black">Quantity</label>
                <span className="text-gray-600 font-medium">{product.stock} available</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center transition-colors"
                >
                  <FiMinus size={18} />
                </button>
                
                <div className="w-20 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-black">{quantity}</span>
                </div>
                
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <FiPlus size={18} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105 font-bold text-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
              >
                {addedToCart ? (
                  <>
                    <FiCheck size={24} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <FiShoppingCart size={24} />
                    <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
              
              {isAuthenticated && (
                <button
                  onClick={handleAddToWishlist}
                  className="w-16 h-16 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl flex items-center justify-center transition-all hover:scale-105 shadow-lg"
                >
                  <FiHeart size={24} />
                </button>
              )}
            </div>

            {/* Product Features */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="font-serif text-2xl font-bold text-black mb-6 flex items-center space-x-2">
                <FiShield className="text-orange-500" />
                <span>Product Features</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Genuine 3K carbon fiber construction</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Precision-engineered for perfect fit</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Scratch and impact resistant</span>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Wireless charging compatible</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
                <FiShield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-semibold text-black">Lifetime Warranty</div>
                <div className="text-xs text-gray-600">Protected for life</div>
              </div>
              
              <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
                <FiZap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-semibold text-black">Fast Shipping</div>
                <div className="text-xs text-gray-600">Free worldwide</div>
              </div>
              
              <div className="text-center p-4 bg-white border border-gray-200 rounded-xl">
                <FiStar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-sm font-semibold text-black">Premium Quality</div>
                <div className="text-xs text-gray-600">Certified materials</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
