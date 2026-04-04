import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiPackage, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';
import ProductFormRestructured from './ProductFormRestructured';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEnhancedForm, setShowEnhancedForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'phone-covers',
    image_url: '',
    has_magsafe_option: false,
    price_without_magsafe: '',
    price_with_magsafe: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('🔄 Fetching products from server...');
      const response = await api.get('/admin/products');
      console.log('✅ Fetched products:', response.data);
      console.log('📊 Total products:', response.data.length);
      
      // Log each product details
      response.data.forEach(p => {
        console.log(`Product ${p.id}: ${p.name}`, {
          price: p.price,
          stock: p.stock,
          has_magsafe: p.has_magsafe_option,
          without_magsafe: p.price_without_magsafe,
          with_magsafe: p.price_with_magsafe
        });
      });
      
      setProducts(response.data);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    // Check if we have an image
    if (!formData.image_url && !imagePreview) {
      alert('Please add a product image');
      return;
    }

    try {
      setUploading(true);
      
      let finalImageUrl = formData.image_url;
      
      // If we have a file to upload, upload it to Supabase via backend
      if (imagePreview && imagePreview.startsWith('data:')) {
        try {
          // Convert base64 to blob
          const response = await fetch(imagePreview);
          const blob = await response.blob();
          
          // Create form data
          const uploadFormData = new FormData();
          uploadFormData.append('image', blob, 'product-image.jpg');
          
          // Upload to backend (which uploads to Supabase)
          console.log('📤 Uploading image to Supabase Storage...');
          const uploadResponse = await api.post('/admin/upload-image', uploadFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          if (uploadResponse.data && uploadResponse.data.url) {
            // Use the Supabase public URL directly
            finalImageUrl = uploadResponse.data.url;
            console.log('✅ Image uploaded successfully:', finalImageUrl);
          } else {
            throw new Error('Upload failed');
          }
        } catch (uploadError) {
          console.error('❌ Image upload error:', uploadError);
          alert('Failed to upload image: ' + (uploadError.response?.data?.message || uploadError.message));
          setUploading(false);
          return;
        }
      }

      // Add product with the image URL
      await api.post('/admin/products', {
        ...formData,
        image_url: finalImageUrl
      });
      
      setShowAddForm(false);
      setFormData({ 
        name: '', 
        description: '', 
        price: '', 
        stock: '', 
        category: 'phone-covers', 
        image_url: '',
        has_magsafe_option: false,
        price_without_magsafe: '',
        price_with_magsafe: ''
      });
      setImagePreview(null);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert('Failed to add product: ' + errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB for faster upload)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB for faster upload');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image_url: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image_url: '' });
  };

  const handleUpdate = async (id) => {
    try {
      const product = products.find(p => p.id === id);
      
      console.log('🔍 Original product from state:', JSON.stringify({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        price_without_magsafe: product.price_without_magsafe,
        price_with_magsafe: product.price_with_magsafe,
        has_magsafe_option: product.has_magsafe_option
      }, null, 2));
      
      // Convert numeric fields to proper types
      const updatedProduct = {
        ...product,
        price: parseFloat(product.price) || 0,
        stock: parseInt(product.stock) || 0,
        price_without_magsafe: product.price_without_magsafe ? parseFloat(product.price_without_magsafe) : null,
        price_with_magsafe: product.price_with_magsafe ? parseFloat(product.price_with_magsafe) : null,
        has_magsafe_option: product.has_magsafe_option || false
      };
      
      console.log('📝 Sending update request for product ID:', id);
      console.log('📦 Product data being sent:', JSON.stringify(updatedProduct, null, 2));
      console.log('🌐 API URL:', `http://localhost:5000/api/admin/products/${id}`);
      
      // Let the interceptor handle the token automatically
      const response = await api.put(`/admin/products/${id}`, updatedProduct);
      console.log('✅ Update response:', response.data);
      
      // Close edit mode first
      setEditingId(null);
      
      // Refresh products list from server
      console.log('🔄 Refreshing products list...');
      await fetchProducts();
      
      console.log('✅ Products refreshed');
    } catch (error) {
      console.error('❌ Error updating product:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      alert('Failed to update product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const updateProduct = (id, field, value) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" style={{
          boxShadow: '0 0 30px rgba(255, 107, 53, 0.4)'
        }}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-orange-500/30" style={{
            boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)'
          }}>
            <FiPackage className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl font-black text-white" style={{
              textShadow: '0 0 40px rgba(255, 107, 53, 0.4)'
            }}>Products Management</h1>
            <p className="text-white/70 mt-1">Manage your product inventory and details</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowEnhancedForm(false);
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-500 transition-all duration-500 transform hover:scale-105 font-semibold shadow-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            <FiPlus size={20} className="relative z-10" />
            <span className="relative z-10">Basic Product</span>
          </button>
          
          <button
            onClick={() => {
              setShowEnhancedForm(!showEnhancedForm);
              setShowAddForm(false);
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 transform hover:scale-105 font-semibold shadow-lg relative overflow-hidden group"
            style={{
              boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            <FiPlus size={20} className="relative z-10" />
            <span className="relative z-10">Enhanced Product</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 border border-orange-500/20 shadow-lg relative overflow-hidden" style={{
        boxShadow: '0 20px 60px rgba(255, 107, 53, 0.2)'
      }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-orange-400" />
          </div>
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
            style={{
              textShadow: '0 0 10px rgba(255, 107, 53, 0.3)'
            }}
          />
        </div>
      </div>

      {/* Enhanced Product Form */}
      {showEnhancedForm && (
        <ProductFormRestructured
          onSuccess={() => {
            setShowEnhancedForm(false);
            fetchProducts();
          }}
          onCancel={() => setShowEnhancedForm(false)}
        />
      )}

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 lg:p-8 border border-orange-500/20 shadow-lg relative overflow-hidden" style={{
          boxShadow: '0 20px 60px rgba(255, 107, 53, 0.2)'
        }}>
          {/* Background Effects */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-red-500/10 to-transparent rounded-full blur-2xl"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="font-serif text-2xl font-black text-white" style={{textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'}}>Add New Product</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="w-10 h-10 bg-gradient-to-br from-gray-800/80 to-black/80 hover:from-red-600/80 hover:to-red-500/80 rounded-lg flex items-center justify-center transition-all duration-300 text-white border border-white/10 hover:border-red-500/50"
            >
              <FiX size={20} />
            </button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 relative z-10">
            <div className={`space-y-2 ${formData.category === 'phone-covers' ? 'md:col-span-2' : ''}`}>
              <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span>Product Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
              />
            </div>
            
            {/* Regular Price - Only for non-phone products */}
            {formData.category !== 'phone-covers' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  <span>Price (LE)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
                />
              </div>
            )}
            
            {/* MagSafe Prices - Only for Phone Covers */}
            {formData.category === 'phone-covers' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    <span>Price Without MagSafe (LE)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price_without_magsafe}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      price_without_magsafe: e.target.value,
                      price: e.target.value, // Set base price to without magsafe
                      has_magsafe_option: true 
                    })}
                    required
                    className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    <span>⚡ Price With MagSafe (LE)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price_with_magsafe}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      price_with_magsafe: e.target.value,
                      has_magsafe_option: true 
                    })}
                    required
                    className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span>Stock Quantity</span>
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span>Category</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white hover:border-orange-500/50"
              >
                <option value="phone-covers">Phone Covers</option>
                <option value="wallets">Wallets</option>
                <option value="airpods-covers">AirPods Covers</option>
                <option value="car-accessories">Car Accessories</option>
              </select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span>Product Image</span>
              </label>
              
              {imagePreview ? (
                <div className="relative group">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-xl border-2 border-orange-500/30"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <FiX size={16} />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <label className="cursor-pointer bg-orange-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all flex items-center space-x-2">
                      <FiEdit2 size={16} />
                      <span className="text-sm font-semibold">Change Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="w-full h-48 bg-black/50 backdrop-blur-md border-2 border-dashed border-orange-500/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 transition-all group">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-600/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FiPackage className="w-8 h-8 text-orange-400" />
                  </div>
                  <p className="text-white font-semibold mb-1">Click to upload image</p>
                  <p className="text-white/40 text-sm">PNG, JPG, GIF up to 2MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              
              <p className="text-xs text-white/50 mt-2">Or paste an image URL below (optional)</p>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imagePreview ? '' : formData.image_url}
                onChange={(e) => {
                  setFormData({ ...formData, image_url: e.target.value });
                  setImagePreview(null);
                }}
                disabled={!!imagePreview}
                className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span>Description</span>
              </label>
              <textarea
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="3"
                className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none text-white placeholder-white/40 hover:border-orange-500/50"
              />
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button 
                type="submit"
                disabled={uploading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 font-semibold shadow-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                style={{boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)'}}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Add Product</span>
                  )}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setImagePreview(null);
                }}
                disabled={uploading}
                className="px-8 py-3 bg-gradient-to-r from-gray-800/80 to-black/80 text-white rounded-xl hover:from-gray-700/80 hover:to-gray-900/80 transition-all duration-300 font-semibold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Grid/Table */}
      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl border border-orange-500/20 shadow-lg overflow-hidden relative" style={{
        boxShadow: '0 20px 60px rgba(255, 107, 53, 0.2)'
      }}>
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
        
        {/* Mobile Cards View */}
        <div className="block lg:hidden relative z-10">
          <div className="p-4 border-b border-orange-500/20 bg-gradient-to-r from-gray-800/50 to-black/50 backdrop-blur-sm">
            <h3 className="font-semibold text-white">Products ({filteredProducts.length})</h3>
          </div>
          <div className="divide-y divide-white/5">
            {filteredProducts.map(product => (
              <div key={product.id} className="p-4 space-y-4 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-orange-500/20" style={{
                    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.2)'
                  }} />
                  <div className="flex-1 min-w-0">
                    {editingId === product.id ? (
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                        className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-lg px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <h4 className="font-semibold text-white truncate">{product.name}</h4>
                    )}
                    <p className="text-sm text-white/50 mt-1">{product.category}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-orange-400 uppercase tracking-wide">Price</label>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                        className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-lg px-3 py-2 text-sm mt-1 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="font-bold text-white mt-1" style={{textShadow: '0 0 15px rgba(255, 107, 53, 0.3)'}}>LE {parseFloat(product.price).toLocaleString()}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-orange-400 uppercase tracking-wide">Stock</label>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => updateProduct(product.id, 'stock', e.target.value)}
                        className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-lg px-3 py-2 text-sm mt-1 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className={`font-bold mt-1 ${product.stock < 50 ? 'text-red-400' : 'text-white'}`}>
                        {product.stock}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {editingId === product.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(product.id)}
                        className="flex-1 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 py-2 rounded-lg hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 font-semibold text-sm border border-green-500/30"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          fetchProducts();
                        }}
                        className="flex-1 bg-gradient-to-r from-gray-800/80 to-black/80 text-white py-2 rounded-lg hover:from-gray-700/80 hover:to-gray-900/80 transition-all duration-300 font-semibold text-sm border border-white/10"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingId(product.id)}
                        className="flex-1 bg-gradient-to-r from-orange-500/20 to-red-600/20 text-orange-400 py-2 rounded-lg hover:from-orange-500/30 hover:to-red-600/30 transition-all duration-300 font-semibold text-sm border border-orange-500/30"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 py-2 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 font-semibold text-sm border border-red-500/30"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto relative z-10">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-800/50 to-black/50 backdrop-blur-sm border-b border-orange-500/20">
              <tr>
                <th className="text-left py-4 px-6 text-orange-400 font-bold text-sm uppercase tracking-wide">Image</th>
                <th className="text-left py-4 px-6 text-orange-400 font-bold text-sm uppercase tracking-wide">Name</th>
                <th className="text-left py-4 px-6 text-orange-400 font-bold text-sm uppercase tracking-wide">Price</th>
                <th className="text-left py-4 px-6 text-orange-400 font-bold text-sm uppercase tracking-wide">Stock</th>
                <th className="text-left py-4 px-6 text-orange-400 font-bold text-sm uppercase tracking-wide">Category</th>
                <th className="text-left py-4 px-6 text-orange-400 font-bold text-sm uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-white/5 transition-all duration-300 group">
                  <td className="py-4 px-6">
                    <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-orange-500/20 group-hover:border-orange-500/40 transition-colors group-hover:scale-110 transform duration-300" style={{
                      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.2)'
                    }} />
                  </td>
                  <td className="py-4 px-6">
                    {editingId === product.id ? (
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                        className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-lg px-3 py-2 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <span className="font-semibold text-white">{product.name}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingId === product.id ? (
                      <div className="space-y-3">
                        {product.has_magsafe_option ? (
                          <>
                            <div>
                              <label className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1 block">Without MagSafe</label>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={product.price_without_magsafe}
                                onChange={(e) => updateProduct(product.id, 'price_without_magsafe', e.target.value)}
                                className="w-32 bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 block">⚡ With MagSafe</label>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={product.price_with_magsafe}
                                onChange={(e) => updateProduct(product.id, 'price_with_magsafe', e.target.value)}
                                className="w-32 bg-black/50 backdrop-blur-md border-2 border-blue-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </>
                        ) : (
                          <input
                            type="number"
                            step="0.01"
                            value={product.price}
                            onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                            className="w-24 bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {product.has_magsafe_option ? (
                          <>
                            <div className="text-sm">
                              <span className="text-orange-400 font-semibold">Without: </span>
                              <span className="font-bold text-white">LE {parseFloat(product.price_without_magsafe).toFixed(2)}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-blue-400 font-semibold">⚡ With: </span>
                              <span className="font-bold text-white">LE {parseFloat(product.price_with_magsafe).toFixed(2)}</span>
                            </div>
                          </>
                        ) : (
                          <span className="font-bold text-white" style={{textShadow: '0 0 15px rgba(255, 107, 53, 0.3)'}}>LE {parseFloat(product.price).toLocaleString()}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => updateProduct(product.id, 'stock', e.target.value)}
                        className="w-20 bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <span className={`font-semibold ${product.stock < 50 ? 'text-red-400' : 'text-white'}`}>
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white/70 font-medium">{product.category}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      {editingId === product.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(product.id)}
                            className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-400 rounded-lg hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 flex items-center justify-center border border-green-500/30 hover:scale-110 transform"
                          >
                            <FiSave size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              fetchProducts();
                            }}
                            className="w-8 h-8 bg-gradient-to-br from-gray-800/80 to-black/80 text-white rounded-lg hover:from-gray-700/80 hover:to-gray-900/80 transition-all duration-300 flex items-center justify-center border border-white/10 hover:scale-110 transform"
                          >
                            <FiX size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingId(product.id)}
                            className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-red-600/20 text-orange-400 rounded-lg hover:from-orange-500/30 hover:to-red-600/30 transition-all duration-300 flex items-center justify-center border border-orange-500/30 hover:scale-110 transform"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="w-8 h-8 bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-400 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 flex items-center justify-center border border-red-500/30 hover:scale-110 transform"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 relative z-10">
            <FiPackage className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No products found</h3>
            <p className="text-white/50">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first product'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManagement;