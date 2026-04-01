import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import api from '../../utils/api';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-4xl font-bold">Products Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-accent text-primary px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors font-semibold"
        >
          <FiPlus />
          <span>Add Product</span>
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-secondary rounded-xl p-6 border border-gray-800 mb-8">
          <h2 className="font-serif text-2xl font-bold mb-6">Add New Product</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
            />
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
              className="bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent"
            >
              <option value="phone-covers">Phone Covers</option>
              <option value="wallets">Wallets</option>
              <option value="airpods-covers">AirPods Covers</option>
              <option value="car-accessories">Car Accessories</option>
            </select>
            <input
              type="url"
              placeholder="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent md:col-span-2"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="3"
              className="bg-primary border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-accent md:col-span-2"
            />
            <div className="md:col-span-2 flex space-x-4">
              <button type="submit" className="flex-1 bg-accent text-primary py-3 rounded-lg hover:bg-accent-hover transition-colors font-semibold">
                Add Product
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-secondary rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Image</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Name</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Price</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Stock</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Category</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className="py-4 px-4">
                    <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                  </td>
                  <td className="py-4 px-4">
                    {editingId === product.id ? (
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                        className="bg-primary border border-gray-800 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span className="font-medium">{product.name}</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                        className="bg-primary border border-gray-800 rounded px-2 py-1 w-24"
                      />
                    ) : (
                      <span className="text-accent font-semibold">${product.price}</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => updateProduct(product.id, 'stock', e.target.value)}
                        className="bg-primary border border-gray-800 rounded px-2 py-1 w-20"
                      />
                    ) : (
                      <span className={product.stock < 50 ? 'text-red-500' : ''}>{product.stock}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-400">{product.category}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      {editingId === product.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(product.id)}
                            className="text-green-500 hover:text-green-400 transition-colors"
                          >
                            <FiSave size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              fetchProducts();
                            }}
                            className="text-gray-400 hover:text-gray-300 transition-colors"
                          >
                            <FiX size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingId(product.id)}
                            className="text-accent hover:text-accent-hover transition-colors"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            <FiTrash2 size={18} />
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
      </div>
    </div>
  );
};

export default ProductsManagement;
