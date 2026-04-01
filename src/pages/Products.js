import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category) params.category = category;
        if (sort) params.sort = sort;

        const response = await api.get('/products', { params });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sort]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const categories = [
    { value: '', label: 'All Products' },
    { value: 'phone-covers', label: 'Phone Cases' },
    { value: 'wallets', label: 'Wallets' },
    { value: 'airpods-covers', label: 'AirPods Cases' },
    { value: 'car-accessories', label: 'Car Accessories' },
  ];

  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ];

  return (
    <div className="min-h-screen py-8 px-4 fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Collection</h1>
          <p className="text-gray-400 text-lg">Premium carbon fiber products for the modern lifestyle</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 bg-secondary px-4 py-2 rounded-lg border border-gray-800 hover:border-accent transition-colors mb-4"
          >
            <FiFilter />
            <span>Filters</span>
          </button>

          <div className={`${showFilters ? 'block' : 'hidden'} md:flex md:items-center md:space-x-4 space-y-4 md:space-y-0`}>
            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full md:w-auto bg-secondary border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-accent transition-colors"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full md:w-auto bg-secondary border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-accent transition-colors"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <div className="text-gray-400 md:ml-auto">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
