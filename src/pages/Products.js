import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiGrid } from 'react-icons/fi';
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

        console.log('Fetching products with params:', params); // Debug log
        const response = await api.get('/products', { params });
        console.log('Products fetched:', response.data.length, 'products'); // Debug log
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
    console.log(`Filter changed: ${key} = ${value}`); // Debug log
    console.log('Current searchParams:', Object.fromEntries(searchParams.entries())); // Debug log
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    console.log('New searchParams:', Object.fromEntries(newParams.entries())); // Debug log
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
    { value: 'name_asc', label: 'Name: A to Z' },
    { value: 'name_desc', label: 'Name: Z to A' },
  ];

  const getCategoryTitle = () => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : 'Our Collection';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-black/5 backdrop-blur-sm border border-black/10 rounded-full px-6 py-3 text-sm font-semibold tracking-widest">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              <span className="text-black/80 uppercase">Premium Collection</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-black text-black leading-tight uppercase tracking-wide">
              {getCategoryTitle()}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Premium carbon fiber products for the modern lifestyle
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters Bar */}
        <div className="mb-12">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mb-6 font-medium uppercase tracking-wide"
          >
            <FiFilter size={18} />
            <span>Filters</span>
          </button>

          {/* Filters Container */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 bg-gray-50 p-6 rounded-xl border border-gray-200">
              
              {/* Left Side - Filters */}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Category</label>
                  <div className="custom-select">
                    <select
                      value={category}
                      onChange={(e) => {
                        console.log('Category changed to:', e.target.value);
                        handleFilterChange('category', e.target.value);
                      }}
                      className="w-full md:w-48 bg-white border-2 border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value} className="py-2">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Sort By</label>
                  <div className="custom-select">
                    <select
                      value={sort}
                      onChange={(e) => {
                        console.log('Sort changed to:', e.target.value);
                        handleFilterChange('sort', e.target.value);
                      }}
                      className="w-full md:w-48 bg-white border-2 border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium cursor-pointer"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value} className="py-2">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Side - Results Count */}
              <div className="flex items-center space-x-4">
                <div className="text-gray-600 font-medium">
                  <span className="text-black font-bold">{products.length}</span> {products.length === 1 ? 'product' : 'products'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <FiGrid size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No products found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your filters or browse our full collection to find what you're looking for.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map(product => (
                <div key={product.id} className="transform hover:scale-105 transition-all duration-300">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Load More Button (if needed) */}
            {products.length >= 12 && (
              <div className="text-center pt-12">
                <button className="inline-flex items-center justify-center bg-black text-white px-12 py-4 rounded-lg hover:bg-gray-800 transition-all font-semibold text-lg tracking-wide uppercase">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
