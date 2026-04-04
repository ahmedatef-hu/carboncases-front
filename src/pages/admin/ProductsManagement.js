import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';
import ProductFormRestructured from './ProductFormRestructured';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('🔄 Fetching products from server...');
      const response = await api.get('/admin/products');
      console.log('✅ Fetched products:', response.data.length);
      setProducts(response.data);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
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
        
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 transform hover:scale-105 font-semibold shadow-lg relative overflow-hidden group"
          style={{
            boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          <FiPlus size={20} className="relative z-10" />
          <span className="relative z-10">Add Product</span>
        </button>
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

      {/* Product Form */}
      {showForm && (
        <ProductFormRestructured
          existingProduct={editingProduct}
          onSuccess={() => {
            setShowForm(false);
            setEditingProduct(null);
            fetchProducts();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl border border-orange-500/20 overflow-hidden hover:border-orange-500/40 transition-all duration-300 group"
            style={{
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.1)'
            }}
          >
            {/* Product Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Actions */}
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(product)}
                  className="w-8 h-8 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center"
                  title="Edit"
                >
                  <FiEdit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="w-8 h-8 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center"
                  title="Delete"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>

              {/* Stock Badge */}
              {product.stock_quantity !== undefined && product.stock_quantity < 10 && (
                <div className="absolute bottom-2 left-2 bg-red-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                  {product.stock_quantity === 0 ? 'Out of Stock' : `Only ${product.stock_quantity} left`}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-white text-lg line-clamp-2 min-h-[3.5rem]">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-orange-400 font-medium">{product.category}</span>
                <span className="text-white/60">Stock: {product.stock_quantity || product.stock || 0}</span>
              </div>

              {/* Pricing */}
              <div className="pt-2 border-t border-white/10">
                {product.category === 'Phone Covers' && product.price_without_magsafe ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Without MagSafe:</span>
                      <span className="text-white font-bold">LE {parseFloat(product.price_without_magsafe).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">With MagSafe:</span>
                      <span className="text-orange-400 font-bold">LE {parseFloat(product.price_with_magsafe).toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-white/70">Price:</span>
                    <span className="text-white font-bold text-lg">LE {parseFloat(product.price || 0).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-900 to-black border-2 border-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiPackage size={40} className="text-orange-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
          <p className="text-white/70">
            {searchTerm ? 'Try adjusting your search' : 'Add your first product to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
