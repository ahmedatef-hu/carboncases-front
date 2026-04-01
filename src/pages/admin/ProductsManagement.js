import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiPackage, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'phone-covers',
    image_url: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/products', formData);
      setShowAddForm(false);
      setFormData({ name: '', description: '', price: '', stock: '', category: 'phone-covers', image_url: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const product = products.find(p => p.id === id);
      await api.put(`/admin/products/${id}`, product);
      setEditingId(null);
      alert('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
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
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <FiPackage className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="font-serif text-3xl lg:text-4xl font-black text-gray-900">Products Management</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory and details</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-all transform hover:scale-105 font-semibold shadow-lg"
        >
          <FiPlus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 lg:p-8 border border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-black text-gray-900">Add New Product</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Price (LE)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Stock Quantity</label>
              <input
                type="number"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="phone-covers">Phone Covers</option>
                <option value="wallets">Wallets</option>
                <option value="airpods-covers">AirPods Covers</option>
                <option value="car-accessories">Car Accessories</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="3"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              />
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button 
                type="submit" 
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition-all font-semibold shadow-lg"
              >
                Add Product
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Grid/Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block lg:hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Products ({filteredProducts.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredProducts.map(product => (
              <div key={product.id} className="p-4 space-y-4">
                <div className="flex items-start space-x-4">
                  <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                  <div className="flex-1 min-w-0">
                    {editingId === product.id ? (
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold"
                      />
                    ) : (
                      <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                    )}
                    <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</label>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                      />
                    ) : (
                      <p className="font-bold text-gray-900 mt-1">LE {parseFloat(product.price).toLocaleString()}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</label>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => updateProduct(product.id, 'stock', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm mt-1"
                      />
                    ) : (
                      <p className={`font-bold mt-1 ${product.stock < 50 ? 'text-red-600' : 'text-gray-900'}`}>
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
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          fetchProducts();
                        }}
                        className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingId(product.id)}
                        className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm"
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
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Image</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Name</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Price</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Stock</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Category</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                  </td>
                  <td className="py-4 px-6">
                    {editingId === product.id ? (
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 font-semibold"
                      />
                    ) : (
                      <span className="font-semibold text-gray-900">{product.name}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                        className="w-24 bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2"
                      />
                    ) : (
                      <span className="font-bold text-gray-900">LE {parseFloat(product.price).toLocaleString()}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => updateProduct(product.id, 'stock', e.target.value)}
                        className="w-20 bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2"
                      />
                    ) : (
                      <span className={`font-semibold ${product.stock < 50 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600 font-medium">{product.category}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      {editingId === product.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(product.id)}
                            className="w-8 h-8 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center"
                          >
                            <FiSave size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              fetchProducts();
                            }}
                            className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                          >
                            <FiX size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingId(product.id)}
                            className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
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
          <div className="text-center py-12">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first product'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManagement;