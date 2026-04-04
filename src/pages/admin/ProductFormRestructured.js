import React, { useState, useEffect } from 'react';
import { FiPlus, FiX, FiUpload, FiPackage, FiEdit2 } from 'react-icons/fi';
import api from '../../utils/api';

const ProductFormStyled = ({ onSuccess, onCancel, existingProduct = null }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Phone Covers',
    price_without_magsafe: '',
    price_with_magsafe: '',
    price: '',
    stock_quantity: '',
  });

  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [colors, setColors] = useState([]);
  const [models, setModels] = useState([]);
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [newModel, setNewModel] = useState('');

  const categories = ['Phone Covers', 'Wallets', 'AirPods Covers', 'Car Accessories'];

  const iPhoneModels = [
    'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max',
    'iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max',
    'iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max',
    'iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
    'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
    'iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max',
    'iPhone 17', 'iPhone 17 Air', 'iPhone 17 Pro', 'iPhone 17 Pro Max',
  ];

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const formDataUpload = new FormData();
      files.forEach(file => formDataUpload.append('images', file));

      const response = await api.post('/admin/upload-images', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setImages([...images, ...response.data.urls]);
    } catch (error) {
      alert('Failed to upload images: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploadingImages(false);
    }
  };

  const addImageUrl = () => {
    if (!imageUrl.trim() || !imageUrl.startsWith('http')) {
      alert('Please enter a valid URL');
      return;
    }
    setImages([...images, imageUrl.trim()]);
    setImageUrl('');
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addColor = () => {
    if (!newColor.name.trim()) {
      alert('Please enter color name');
      return;
    }
    if (colors.some(c => c.name === newColor.name.trim())) {
      alert('Color already exists');
      return;
    }
    setColors([...colors, { name: newColor.name.trim(), hex: newColor.hex }]);
    setNewColor({ name: '', hex: '#000000' });
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const toggleModel = (modelName) => {
    if (models.includes(modelName)) {
      setModels(models.filter(m => m !== modelName));
    } else {
      setModels([...models, modelName]);
    }
  };

  const selectAllModels = () => setModels([...iPhoneModels]);
  const deselectAllModels = () => setModels([]);

  const addCustomModel = () => {
    if (!newModel.trim()) return;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert('Please enter both MagSafe prices');
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
            <span>Product Name</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span>Category</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white hover:border-orange-500/50"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Pricing */}
        {isPhoneCover ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span>Price Without MagSafe (LE)</span>
              </label>
              <input
                type="number"
                name="price_without_magsafe"
                value={formData.price_without_magsafe}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
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
                name="price_with_magsafe"
                value={formData.price_with_magsafe}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                required
                className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              <span>Price (LE)</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              placeholder="0.00"
              required
              className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
            />
          </div>
        )}

        {/* Stock */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span>Stock Quantity</span>
          </label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            placeholder="0"
            required
            className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
          />
        </div>

        {/* Images */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span>Product Images</span>
          </label>
          
          <div className="mb-4">
            <label className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl cursor-pointer hover:from-red-600 hover:to-orange-500 transition-all duration-500 font-semibold shadow-lg" style={{boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)'}}>
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

          <p className="text-xs text-white/50 mb-2">Or paste an image URL below (optional)</p>
          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-500 transition-all duration-300"
            >
              <FiPlus />
            </button>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl border-2 border-orange-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <FiX size={16} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-orange-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span>Description</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="3"
            className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none text-white placeholder-white/40 hover:border-orange-500/50"
          />
        </div>

        {/* Colors */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span>Available Colors</span>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={newColor.name}
              onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
              placeholder="Color name (e.g., Black)"
              className="md:col-span-2 bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
            />
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="color"
                  value={newColor.hex}
                  onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="w-full h-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-orange-500/50 transition-all"
                >
                  <span className="text-white text-sm">{newColor.hex}</span>
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-white/20"
                    style={{ backgroundColor: newColor.hex }}
                  ></div>
                </div>
              </div>
              <button
                type="button"
                onClick={addColor}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 font-semibold flex items-center gap-2 whitespace-nowrap"
              >
                <FiPlus /> Add
              </button>
            </div>
          </div>

          {colors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md border border-orange-500/30 text-white px-3 py-2 rounded-full"
                >
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-white/30"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <span>{color.name}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="text-red-400 hover:text-red-300 ml-1"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Models */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span>{isPhoneCover ? 'iPhone Models' : isAirPodsCover ? 'AirPods Models' : 'Models (Optional)'}</span>
          </label>

          {isPhoneCover ? (
            <div>
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={selectAllModels}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-500 transition-all duration-300 text-sm font-semibold"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={deselectAllModels}
                  className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-600 transition-all duration-300 text-sm font-semibold"
                >
                  Deselect All
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto bg-black/30 backdrop-blur-md border border-orange-500/20 p-4 rounded-xl">
                {iPhoneModels.map((model) => (
                  <label
                    key={model}
                    className="flex items-center gap-2 text-white cursor-pointer hover:bg-white/5 p-2 rounded transition-all"
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
            <div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  placeholder="Enter model name"
                  className="flex-1 bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-white placeholder-white/40 hover:border-orange-500/50"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomModel())}
                />
                <button
                  type="button"
                  onClick={addCustomModel}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 font-semibold flex items-center gap-2"
                >
                  <FiPlus /> Add
                </button>
              </div>

              {models.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {models.map((model, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-md border border-orange-500/30 text-white px-3 py-1 rounded-full"
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

        {/* Buttons */}
        <div className="md:col-span-2 flex space-x-4">
          <button 
            type="submit"
            disabled={loading || uploadingImages}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 font-semibold shadow-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            style={{boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)'}}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            <span className="relative z-10">
              {loading ? 'Saving...' : existingProduct ? 'Update Product' : 'Create Product'}
            </span>
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading || uploadingImages}
              className="px-8 py-3 bg-gradient-to-r from-gray-800/80 to-black/80 text-white rounded-xl hover:from-gray-700/80 hover:to-gray-900/80 transition-all duration-300 font-semibold border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductFormStyled;
