import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiCheck, FiShield, FiZap, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductImage from '../components/ProductImage';

const ProductDetailEnhanced = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Enhanced features state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null); // For MagSafe

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        
        // Set default selections
        if (response.data.colors && response.data.colors.length > 0) {
          setSelectedColor(response.data.colors[0].color_name);
        }
        if (response.data.models && response.data.models.length > 0) {
          setSelectedModel(response.data.models[0].model_name);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Validation
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    
    if (product.models && product.models.length > 0 && !selectedModel) {
      alert('Please select an iPhone model');
      return;
    }

    if (product.has_magsafe_option && !selectedVariant) {
      alert('Please select MagSafe option');
      return;
    }

    // Prepare product data with selections
    const productToAdd = {
      ...product,
      quantity,
      selectedColor,
      selectedModel,
      variant: selectedVariant,
      // Use appropriate price
      price: selectedVariant === 'with-magsafe' 
        ? product.price_with_magsafe 
        : selectedVariant === 'without-magsafe'
        ? product.price_without_magsafe
        : product.price
    };

    addToCart(productToAdd, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
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
      if (error.response?.status === 400) {
        alert('Already in wishlist!');
      }
    }
  };

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
          <button onClick={() => navigate('/products')} className="text-orange-400 hover:text-orange-300">
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
    ? [{ image_url: product.image_url }] 
    : [];

  const currentImage = images[selectedImageIndex];

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-orange-500/20">
              {currentImage ? (
                <ProductImage
                  src={currentImage.image_url || currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/40">No image available</span>
                </div>
              )}
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all border border-white/10"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all border border-white/10"
                  >
                    <FiChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm border border-white/10">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-orange-500 scale-105'
                        : 'border-white/10 hover:border-orange-500/50'
                    }`}
                  >
                    <ProductImage
                      src={img.image_url || img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 text-orange-400 fill-current" />
                  ))}
                </div>
                <span className="text-white/60">(4.8)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {product.has_magsafe_option ? (
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-sm text-orange-400">Without MagSafe:</span>
                    <span className="text-3xl font-bold text-white">
                      LE {parseFloat(product.price_without_magsafe).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-sm text-blue-400">⚡ With MagSafe:</span>
                    <span className="text-3xl font-bold text-white">
                      LE {parseFloat(product.price_with_magsafe).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-4xl font-bold text-white">
                  LE {parseFloat(product.price).toLocaleString()}
                </div>
              )}
              <p className="text-white/60">
                Stock: <span className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </p>
            </div>

            {/* Description */}
            <p className="text-white/70 leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-orange-400 uppercase tracking-wider">
                  Select Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.id || color.color_name}
                      onClick={() => setSelectedColor(color.color_name)}
                      className={`px-6 py-3 rounded-xl border-2 transition-all ${
                        selectedColor === color.color_name
                          ? 'border-orange-500 bg-orange-500/20 text-white'
                          : 'border-white/20 text-white/70 hover:border-orange-500/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {color.color_hex && (
                          <div
                            className="w-5 h-5 rounded-full border-2 border-white/30"
                            style={{ backgroundColor: color.color_hex }}
                          />
                        )}
                        <span>{color.color_name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* iPhone Model Selection */}
            {product.models && product.models.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-orange-400 uppercase tracking-wider">
                  Select iPhone Model
                </label>
                <select
                  value={selectedModel || ''}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">Choose a model...</option>
                  {product.models.map((model) => (
                    <option key={model.id || model.model_name} value={model.model_name}>
                      {model.model_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* MagSafe Selection */}
            {product.has_magsafe_option && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-orange-400 uppercase tracking-wider">
                  MagSafe Option
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedVariant('without-magsafe')}
                    className={`px-6 py-4 rounded-xl border-2 transition-all ${
                      selectedVariant === 'without-magsafe'
                        ? 'border-orange-500 bg-orange-500/20 text-white'
                        : 'border-white/20 text-white/70 hover:border-orange-500/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">Without MagSafe</div>
                      <div className="text-sm text-white/60">LE {parseFloat(product.price_without_magsafe).toFixed(2)}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setSelectedVariant('with-magsafe')}
                    className={`px-6 py-4 rounded-xl border-2 transition-all ${
                      selectedVariant === 'with-magsafe'
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-white/20 text-white/70 hover:border-blue-500/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold flex items-center justify-center space-x-1">
                        <FiZap className="text-blue-400" />
                        <span>With MagSafe</span>
                      </div>
                      <div className="text-sm text-white/60">LE {parseFloat(product.price_with_magsafe).toFixed(2)}</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-orange-400 uppercase tracking-wider">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-white w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedToCart}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 font-bold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addedToCart ? (
                  <>
                    <FiCheck size={24} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <FiShoppingCart size={24} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
              <button
                onClick={handleAddToWishlist}
                className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <FiHeart size={24} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center space-x-3">
                <FiShield className="text-orange-400" size={24} />
                <span className="text-white/70">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiZap className="text-orange-400" size={24} />
                <span className="text-white/70">Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailEnhanced;
