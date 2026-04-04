import React, { useState, useEffect } from 'react';
import { FiPlus, FiX, FiUpload, FiCheck } from 'react-icons/fi';
import api from '../../utils/api';

/**
 * RESTRUCTURED Product Form Component
 * Matches new requirements exactly
 */
const ProductFormRestructured = ({ onSuccess, onCancel, existingProduct = null }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Phone Covers',
    price_without_magsafe: '',
    price_with_magsafe: '',
    price: '', // For non-phone-cover products
    stock_quantity: '',
  });

  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [colors, setColors] = useState([]);
  const [models, setModels] = useState([]);
  
  const [newColor, setNewColor] = useState('');
  const [newModel, setNewModel] = useState('');

  // Categories
  const categories = [
    'Phone Covers',
    'Wallets',
    'AirPods Covers',
    'Car Accessories'
  ];

  // Predefined iPhone models (for Phone Covers only)
  const iPhoneModels = [
    'iPhone 11',
    'iPhone 11 Pro',
    'iPhone 11 Pro Max',
    'iPhone 12',
    'iPhone 12 Pro',
    'iPhone 12 Pro Max',
    'iPhone 13',
    'iPhone 13 Pro',
    'iPhone 13 Pro Max',
    'iPhone 14',
    'iPhone 14 Plus',
    'iPhone 14 Pro',
    'iPhone 14 Pro Max',
    'iPhone 15',
    'iPhone 15 Plus',
    'iPhone 15 Pro',
    'iPhone 15 Pro Max',
    'iPhone 16',
    'iPhone 16 Plus',
    'iPhone 16 Pro',
    'iPhone 16 Pro Max',
    'iPhone 17',
    'iPhone 17 Air',
    'iPhone 17 Pro',
    'iPhone 17 Pro Max',
  ];

  // Load existing product data
  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || '',
        description: existingProduct.description || '',
        category: existingProduct.category || 'Phone Covers',
        price_without_magsafe: existingProduct.price_without_magsafe || '',
        price_with_magsafe: existingProduct.price_with_magsafe || '',
        price: existingProduct.price || '',
        stock_quantity: existingProduct.stock_quantity || existingProduct.stock || '',
      });
      setImages(existingProduct.images || []);
      setColors(existingProduct.colors || []);
      setModels(existingProduct.models || []);
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ============================================
  // IMAGE HANDLING
  // ============================================
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);

    try {
      const formDataUpload = new FormData();
      files.forEach(file => {
        formDataUpload.append('images', file);
      });

      const response = await api.post('/admin/upload-images', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setImages([...images, ...response.data.urls]);
      console.log('✅ Images uploaded:', response.data.urls);
    } catch (error) {
      console.error('❌ Error uploading images:', error);
      alert('Failed to upload images: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploadingImages(false);
    }
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    if (!imageUrl.startsWith('http')) {
      alert('Please enter a valid URL starting with http:// or https://');
      return;
    }
    setImages([...images, imageUrl.trim()]);
    setImageUrl('');
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // ============================================
  // COLOR HANDLING
  // ============================================
  const addColor = () => {
    if (!newColor.trim()) {
      alert('Please enter color name');
      return;
    }
    if (colors.includes(newColor.trim())) {
      alert('Color already exists');
      return;
    }
    setColors([...colors, newColor.trim()]);
    setNewColor('');
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // ============================================
  // MODEL HANDLING
  // ============================================
  const toggleModel = (modelName) => {
    if (models.includes(modelName)) {
      setModels(models.filter(m => m !== modelName));
    } else {
      setModels([...models, modelName]);
    }
  };

  const selectAllModels = () => {
    setModels([...iPhoneModels]);
  };

  const deselectAllModels = () => {
    setModels([]);
  };

  const addCustomModel = () => {
    if (!newModel.trim()) {
      alert('Please enter model name');
      return;
    }
    if (models.includes(newModel.trim())) {
      alert('Model already exists');
      return;
    }
    setModels([...models, newModel.trim()]);
    setNewModel('');
  };

  const removeModel = (index) => {
    setModels(models.filter((_, i) => i !== index));
  };

  // ============================================
  // FORM SUBMISSION
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter product name');
      return;
    }

    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    if (formData.category === 'Phone Covers') {
      if (!formData.price_without_magsafe || !formData.price_with_magsafe) {
        alert('Please enter both MagSafe prices for Phone Covers');
        return;
      }
    } else {
      if (!formData.price) {
        alert('Please enter product price');
        return;
      }
    }

    if (!formData.stock_quantity) {
      alert('Please enter stock quantity');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        stock_quantity: parseInt(formData.stock_quantity),
        images,
        colors,
        models,
      };

      // Add pricing based on category
      if (formData.category === 'Phone Covers') {
        productData.price_without_magsafe = parseFloat(formData.price_without_magsafe);
        productData.price_with_magsafe = parseFloat(formData.price_with_magsafe);
      } else {
        productData.price = parseFloat(formData.price);
      }

      if (existingProduct) {
        await api.put(`/admin/products/enhanced/${existingProduct.id}`, productData);
        alert('Product updated successfully!');
      } else {
        await api.post('/admin/products/enhanced', productData);
        alert('Product created successfully!');
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('❌ Error saving product:', error);
      alert('Failed to save product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const isPhoneCover = formData.category === 'Phone Covers';
  const isAirPodsCover = formData.category === 'AirPods Covers';

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl p-6 lg:p-8 border border-orange-500/20 shadow-lg relative overflow-hidden" style={{
      boxShadow: '0 20px 60px rgba(255, 107, 53, 0.2)'
    }}>
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-red-500/10 to-transparent rounded-full blur-2xl"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="font-serif text-2xl font-black text-white" style={{textShadow: '0 0 20px rgba(255, 107, 53, 0.3)'}}>
          {existingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-gradient-to-br from-gray-800/80 to-black/80 hover:from-red-600/80 hover:to-red-500/80 rounded-lg flex items-center justify-center transition-all duration-300 text-white border border-white/10 hover:border-red-500/50"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 relative z-10">
        {/* Product Name */}
        <div className={`space-y-2 ${isPhoneCover ? 'md:col-span-2' : ''}`}>
          <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span>Product Name *</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Pricing */}
        {isPhoneCover ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price Without MagSafe (LE) *
              </label>
              <input
                type="number"
                name="price_without_magsafe"
                value={formData.price_without_magsafe}
                onChange={handleChange}
                step="0.01"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price With MagSafe (LE) *
              </label>
              <input
                type="number"
                name="price_with_magsafe"
                value={formData.price_with_magsafe}
                onChange={handleChange}
                step="0.01"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price (LE) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
        )}

        {/* Stock Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Stock Quantity *
          </label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Product Images * (Multiple images allowed)
          </label>
          
          {/* Upload Button */}
          <div className="mb-4">
            <label className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition-colors">
              <FiUpload className="mr-2" />
              {uploadingImages ? 'Uploading...' : 'Upload Images'}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImages}
              />
            </label>
          </div>

          {/* Add Image URL */}
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste image URL"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiPlus />
            </button>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Available Colors
          </label>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Enter color name"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
            />
            <button
              type="button"
              onClick={addColor}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <FiPlus /> Add
            </button>
          </div>

          {colors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 bg-gray-800 text-white px-3 py-1 rounded-full"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Models */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {isPhoneCover ? 'iPhone Models *' : isAirPodsCover ? 'AirPods Models' : 'Models (Optional)'}
          </label>

          {isPhoneCover ? (
            // Checkbox list for Phone Covers
            <div>
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={selectAllModels}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={deselectAllModels}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Deselect All
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto bg-gray-800 p-4 rounded-lg">
                {iPhoneModels.map((model) => (
                  <label
                    key={model}
                    className="flex items-center gap-2 text-white cursor-pointer hover:bg-gray-700 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={models.includes(model)}
                      onChange={() => toggleModel(model)}
                      className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm">{model}</span>
                  </label>
                ))}
              </div>

              {models.length > 0 && (
                <div className="mt-2 text-sm text-gray-400">
                  Selected: {models.length} model{models.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          ) : (
            // Manual input for AirPods Covers and others
            <div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  placeholder="Enter model name"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomModel())}
                />
                <button
                  type="button"
                  onClick={addCustomModel}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <FiPlus /> Add
                </button>
              </div>

              {models.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {models.map((model, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 bg-gray-800 text-white px-3 py-1 rounded-full"
                    >
                      {model}
                      <button
                        type="button"
                        onClick={() => removeModel(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Saving...' : existingProduct ? 'Update Product' : 'Create Product'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductFormRestructured;
