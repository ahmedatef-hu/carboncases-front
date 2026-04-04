import React, { useState } from 'react';
import { FiPlus, FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';

/**
 * Enhanced Product Form Component
 * Handles: Multiple images, Colors, iPhone Models
 */
const ProductFormEnhanced = ({ onSuccess, onCancel, existingProduct = null }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState({
    name: existingProduct?.name || '',
    description: existingProduct?.description || '',
    price: existingProduct?.price || '',
    stock: existingProduct?.stock || '',
    category: existingProduct?.category || 'phone-covers',
    has_magsafe_option: existingProduct?.has_magsafe_option || false,
    price_without_magsafe: existingProduct?.price_without_magsafe || '',
    price_with_magsafe: existingProduct?.price_with_magsafe || '',
  });

  const [images, setImages] = useState(existingProduct?.images || []);
  const [colors, setColors] = useState(existingProduct?.colors || []);
  const [models, setModels] = useState(existingProduct?.models || []);
  
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [newModel, setNewModel] = useState('');

  // Predefined iPhone models
  const iPhoneModels = [
    'iPhone 15 Pro Max',
    'iPhone 15 Pro',
    'iPhone 15 Plus',
    'iPhone 15',
    'iPhone 14 Pro Max',
    'iPhone 14 Pro',
    'iPhone 14 Plus',
    'iPhone 14',
    'iPhone 13 Pro Max',
    'iPhone 13 Pro',
    'iPhone 13',
    'iPhone 12 Pro Max',
    'iPhone 12 Pro',
    'iPhone 12',
    'iPhone 11 Pro Max',
    'iPhone 11 Pro',
    'iPhone 11',
  ];

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (images.length + files.length > 6) {
      alert('Maximum 6 images allowed per product');
      return;
    }

    setUploadingImages(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post('/admin/upload-images', formData, {
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

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addColor = () => {
    if (!newColor.name) {
      alert('Please enter color name');
      return;
    }
    if (colors.some(c => c.name === newColor.name)) {
      alert('Color already exists');
      return;
    }
    setColors([...colors, { ...newColor }]);
    setNewColor({ name: '', hex: '#000000' });
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const addModel = (modelName) => {
    if (!modelName) return;
    if (models.includes(modelName)) {
      alert('Model already added');
      return;
    }
    setModels([...models, modelName]);
    setNewModel('');
  };

  const removeModel = (index) => {
    setModels(models.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    if (formData.category === 'phone-covers' && models.length === 0) {
      alert('Please add at least one iPhone model for phone covers');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        images,
        colors,
        models: formData.category === 'phone-covers' ? models : []
      };

      if (existingProduct) {
        await api.put(`/admin/products/enhanced/${existingProduct.id}`, productData);
      } else {
        await api.post('/admin/products/enhanced', productData);
      }

      alert(existingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      onSuccess();
    } catch (error) {
      console.error('❌ Error saving product:', error);
      alert('Failed to save product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-orange-400 mb-2">Product Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full bg-black/50 border-2 border-orange-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-orange-400 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-black/50 border-2 border-orange-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="phone-covers">Phone Covers</option>
            <option value="wallets">Wallets</option>
            <option value="airpods-covers">AirPods Covers</option>
            <option value="car-accessories">Car Accessories</option>
          </select>
        </div>
      </div>

      {/* Images Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-orange-400">
          Product Images (Max 6)
        </label>
        
        {/* Image Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border-2 border-orange-500/30"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX size={14} className="text-white" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-1 left-1 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
          
          {/* Upload Button */}
          {images.length < 6 && (
            <label className="aspect-square border-2 border-dashed border-orange-500/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 transition-all">
              <FiUpload className="text-orange-400 mb-1" size={24} />
              <span className="text-xs text-white/60">Upload</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImages}
              />
            </label>
          )}
        </div>
        
        {uploadingImages && (
          <p className="text-sm text-orange-400">Uploading images...</p>
        )}
      </div>

      {/* Colors Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-orange-400">Colors</label>
        
        {/* Color List */}
        <div className="flex flex-wrap gap-2 mb-3">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-black/50 border border-orange-500/30 rounded-lg px-3 py-2"
            >
              <div
                className="w-5 h-5 rounded-full border-2 border-white/30"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-white text-sm">{color.name}</span>
              <button
                type="button"
                onClick={() => removeColor(index)}
                className="text-red-400 hover:text-red-300"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Add Color */}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Color name"
            value={newColor.name}
            onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
            className="flex-1 bg-black/50 border-2 border-orange-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="color"
            value={newColor.hex}
            onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
            className="w-12 h-10 bg-black/50 border-2 border-orange-500/30 rounded-lg cursor-pointer"
          />
          <button
            type="button"
            onClick={addColor}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FiPlus size={20} />
          </button>
        </div>
      </div>

      {/* iPhone Models Section (only for phone covers) */}
      {formData.category === 'phone-covers' && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-orange-400">iPhone Models</label>
          
          {/* Model List */}
          <div className="flex flex-wrap gap-2 mb-3">
            {models.map((model, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-black/50 border border-orange-500/30 rounded-lg px-3 py-2"
              >
                <span className="text-white text-sm">{model}</span>
                <button
                  type="button"
                  onClick={() => removeModel(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FiX size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Model */}
          <div className="flex space-x-2">
            <select
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              className="flex-1 bg-black/50 border-2 border-orange-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select iPhone model...</option>
              {iPhoneModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => addModel(newModel)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <FiPlus size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Price & Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-orange-400 mb-2">Price (LE)</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            className="w-full bg-black/50 border-2 border-orange-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-orange-400 mb-2">Stock</label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
            className="w-full bg-black/50 border-2 border-orange-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-orange-400 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows="4"
          className="w-full bg-black/50 border-2 border-orange-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading || uploadingImages}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : existingProduct ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-8 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductFormEnhanced;
