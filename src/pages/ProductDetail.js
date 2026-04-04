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
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('without_magsafe'); // 'without_magsafe' or 'with_magsafe'

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
      const productToAdd = {
        ...product,
        variant: product.has_magsafe_option ? selectedVariant : null,
        price: product.has_magsafe_option 
          ? (selectedVariant === 'with_magsafe' ? product.price_with_magsafe : product.price_without_magsafe)
          : product.price
      };
      addToCart(productToAdd, quantity);
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
      setAddedToWishlist(true);
      setTimeout(() => setAddedToWishlist(false), 2000);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (error.response?.status === 400) {
        alert('Already in wishlist!');
      } else {
        alert('Failed to add to wishlist. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-float" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-float" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative">
          {/* Enhanced Loading Spinner */}
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full animate-spin" style={{animationDuration: '1.5s', animationDirection: 'reverse'}}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-float" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-float" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
        </div>
        
        <div className="text-center space-y-6 relative z-10">
          <h2 className="text-4xl font-bold text-white" style={{
            textShadow: '0 0 40px rgba(255, 107, 53, 0.4)'
          }}>Product not found</h2>
          <button 
            onClick={() => navigate('/products')} 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg hover:from-red-600 hover:to-orange-500 transition-all duration-500 font-bold shadow-xl"
            style={{
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.4)'
            }}
          >
            <FiArrowLeft />
            <span>Back to Products</span>
          </button>
        </div>
      </div>
    );
  }

  const originalPrice = (parseFloat(product.price) * 1.2).toFixed(2);
  const currentPrice = product.has_magsafe_option 
    ? (selectedVariant === 'with_magsafe' ? product.price_with_magsafe : product.price_without_magsafe)
    : product.price;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="floating-particles">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-float" style={{animationDuration: '10s'}}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-float" style={{animationDuration: '15s', animationDelay: '5s'}}></div>
      </div>

      {/* Back Button */}
      <div className="relative z-10 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-md border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-white/80 hover:text-orange-500 transition-all duration-300 font-medium group"
          >
            <FiArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Image */}
          <div className="relative group">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-2 border-orange-500/30 shadow-2xl relative">
              {/* Image Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 relative z-10"
              />
              
              {/* Floating Particles on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="category-particle"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 20}%`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Stock Badge */}
            {product.stock < 10 && product.stock > 0 && (
              <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg animate-pulse-glow">
                Only {product.stock} left!
              </div>
            )}
            
            {/* Premium Badge */}
            <div className="absolute top-6 right-6 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg"
              style={{
                boxShadow: '0 8px 20px rgba(255, 107, 53, 0.4)'
              }}
            >
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
                    <FiStar key={i} className="w-5 h-5 fill-orange-400 text-orange-400 drop-shadow-glow" />
                  ))}
                </div>
                <span className="text-white/70 font-medium">(4.9) • 127 reviews</span>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl font-black text-white leading-tight" style={{
                textShadow: '0 0 40px rgba(255, 107, 53, 0.3)'
              }}>
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 flex-wrap">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  LE {parseFloat(currentPrice).toLocaleString()}
                </div>
                <div className="text-2xl text-white/40 line-through">
                  LE {parseFloat(originalPrice).toLocaleString()}
                </div>
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse-glow">
                  Save 17%
                </div>
              </div>
            </div>
            
            <p className="text-xl text-white/80 leading-relaxed font-light">
              {product.description}
            </p>

            {/* MagSafe Variant Selector */}
            {product.has_magsafe_option && (
              <div className="space-y-4">
                <label className="text-lg font-semibold text-orange-400 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  <span>Choose Variant</span>
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedVariant('without_magsafe')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedVariant === 'without_magsafe'
                        ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500 shadow-lg'
                        : 'bg-gradient-to-br from-gray-900 to-black border-orange-500/30 hover:border-orange-500/60'
                    }`}
                  >
                    <div className="text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Without MagSafe</span>
                        {selectedVariant === 'without_magsafe' && (
                          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                            <FiCheck className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                        LE {parseFloat(product.price_without_magsafe).toFixed(2)}
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedVariant('with_magsafe')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden ${
                      selectedVariant === 'with_magsafe'
                        ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500 shadow-lg'
                        : 'bg-gradient-to-br from-gray-900 to-black border-orange-500/30 hover:border-orange-500/60'
                    }`}
                  >
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      MagSafe
                    </div>
                    <div className="text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">With MagSafe</span>
                        {selectedVariant === 'with_magsafe' && (
                          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                            <FiCheck className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                        LE {parseFloat(product.price_with_magsafe).toFixed(2)}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-semibold text-orange-400 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  <span>Quantity</span>
                </label>
                <span className="text-white/70 font-medium">{product.stock} available</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gradient-to-br from-gray-900 to-black hover:from-orange-500/20 hover:to-red-500/20 border-2 border-orange-500/30 hover:border-orange-500/60 rounded-lg flex items-center justify-center transition-all duration-300 text-white"
                >
                  <FiMinus size={18} />
                </button>
                
                <div className="w-20 h-12 bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">{quantity}</span>
                </div>
                
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-12 bg-gradient-to-br from-gray-900 to-black hover:from-orange-500/20 hover:to-red-500/20 border-2 border-orange-500/30 hover:border-orange-500/60 rounded-lg flex items-center justify-center transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 transform hover:scale-105 font-bold text-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl relative overflow-hidden group"
                style={{
                  boxShadow: '0 10px 30px rgba(255, 107, 53, 0.4)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                {addedToCart ? (
                  <>
                    <FiCheck size={24} className="relative z-10" />
                    <span className="relative z-10">Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <FiShoppingCart size={24} className="relative z-10" />
                    <span className="relative z-10">{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
              
              {isAuthenticated && (
                <button
                  onClick={handleAddToWishlist}
                  className={`w-16 h-16 backdrop-blur-md border-2 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg relative overflow-hidden group ${
                    addedToWishlist 
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 border-orange-500' 
                      : 'bg-gradient-to-br from-gray-900 to-black hover:from-orange-500/20 hover:to-red-500/20 border-orange-500/30 hover:border-orange-500/60'
                  }`}
                  title={addedToWishlist ? 'Added to Wishlist!' : 'Add to Wishlist'}
                >
                  <FiHeart size={24} className={`transition-all duration-300 relative z-10 ${
                    addedToWishlist ? 'text-white fill-white scale-110' : 'text-white'
                  }`} />
                  {addedToWishlist && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 animate-pulse"></div>
                  )}
                </button>
              )}
            </div>

            {/* Product Features */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-md rounded-2xl p-8 border-2 border-orange-500/30 relative overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-red-500/10 to-transparent rounded-full blur-2xl"></div>
              </div>
              
              <h3 className="font-serif text-2xl font-bold text-white mb-6 flex items-center space-x-2 relative z-10" style={{
                textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'
              }}>
                <FiShield className="text-orange-500" />
                <span>Product Features</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="flex items-start space-x-3 group">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 font-medium group-hover:text-white transition-colors duration-300">Genuine 3K carbon fiber construction</span>
                </div>
                
                <div className="flex items-start space-x-3 group">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 font-medium group-hover:text-white transition-colors duration-300">Precision-engineered for perfect fit</span>
                </div>
                
                <div className="flex items-start space-x-3 group">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 font-medium group-hover:text-white transition-colors duration-300">Scratch and impact resistant</span>
                </div>
                
                <div className="flex items-start space-x-3 group">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 font-medium group-hover:text-white transition-colors duration-300">Wireless charging compatible</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl hover:border-orange-500/60 transition-all duration-300 hover:scale-105 group">
                <FiShield className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-glow" />
                <div className="text-sm font-semibold text-white">Lifetime Warranty</div>
                <div className="text-xs text-white/70">Protected for life</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl hover:border-orange-500/60 transition-all duration-300 hover:scale-105 group">
                <FiZap className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-glow" />
                <div className="text-sm font-semibold text-white">Fast Shipping</div>
                <div className="text-xs text-white/70">Free worldwide</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl hover:border-orange-500/60 transition-all duration-300 hover:scale-105 group">
                <FiStar className="w-8 h-8 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-glow" />
                <div className="text-sm font-semibold text-white">Premium Quality</div>
                <div className="text-xs text-white/70">Certified materials</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
