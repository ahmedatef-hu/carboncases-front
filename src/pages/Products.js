import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiGrid, FiChevronDown } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

// Custom Dropdown Component
const CustomDropdown = ({ label, value, options, onChange, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="text-sm font-semibold text-orange-400 uppercase tracking-wide flex items-center space-x-2">
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
        <span>{label}</span>
      </label>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full md:w-56 bg-black/50 backdrop-blur-md border-2 border-orange-500/30 text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 font-medium cursor-pointer hover:border-orange-500/60 hover:bg-black/70 text-left flex items-center justify-between"
          style={{
            textShadow: '0 0 10px rgba(255, 107, 53, 0.3)'
          }}
        >
          <span>{selectedOption.label}</span>
          <FiChevronDown 
            size={18} 
            className={`text-orange-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute bottom-full md:top-full left-0 right-0 mb-2 md:mb-0 md:mt-2 bg-gradient-to-br from-gray-900 to-black border-2 border-orange-500/40 rounded-lg overflow-hidden shadow-2xl backdrop-blur-xl animate-fade-in-up"
            style={{
              zIndex: 9999,
              minWidth: '14rem'
            }}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-500/20 to-transparent rounded-full blur-xl"></div>
            </div>

            <div className="max-h-64 overflow-y-auto custom-scrollbar relative z-10">
              {options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 transition-all duration-300 border-l-2 ${
                    option.value === value
                      ? 'bg-gradient-to-r from-orange-500/30 to-transparent border-orange-500 text-white font-semibold'
                      : 'border-transparent text-white/80 hover:bg-orange-500/20 hover:border-orange-500/50 hover:text-white'
                  }`}
                  style={{
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {option.value === value && (
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    )}
                    <span className={option.value === value ? 'text-shadow-glow' : ''}>
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="floating-particles">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section with Dark Theme */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Advanced Black Background with Creative Effects */}
        <div className="absolute inset-0">
          {/* Pure Black Base */}
          <div className="absolute inset-0 bg-black"></div>
          
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255, 107, 53, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 107, 53, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
              animation: 'grid-move 15s linear infinite'
            }}></div>
          </div>
          
          {/* Floating Orbs with Glow */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-float" style={{animationDuration: '8s'}}></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-float" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-3 bg-black/40 backdrop-blur-md border border-orange-500/30 rounded-full px-6 py-3 text-sm font-semibold tracking-widest">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
              <span className="text-white/90 uppercase text-xs">Premium Collection</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight uppercase tracking-wide" style={{
              textShadow: '0 0 40px rgba(255, 107, 53, 0.4), 0 0 80px rgba(255, 255, 255, 0.1)'
            }}>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-200 to-white">
                {getCategoryTitle()}
              </span>
            </h1>
            
            {/* Creative Divider */}
            <div className="flex items-center justify-center space-x-8 my-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              <div className="w-24 h-px bg-gradient-to-r from-orange-500 to-red-500 animate-gradient-x"></div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light" style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
            }}>
              Premium carbon fiber products for the modern lifestyle
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Filters Bar with Dark Theme */}
        <div className="mb-12 relative z-20">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-orange-500 transition-all duration-500 mb-6 font-medium uppercase tracking-wide shadow-lg"
            style={{
              boxShadow: '0 10px 25px rgba(255, 107, 53, 0.3)'
            }}
          >
            <FiFilter size={18} />
            <span>Filters</span>
          </button>

          {/* Filters Container with Creative Effects */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-orange-500/30 backdrop-blur-xl">
              
              {/* Background Effects */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-red-500/10 to-transparent rounded-full blur-2xl"></div>
              </div>
              
              {/* Left Side - Filters */}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 relative z-10">
                {/* Category Filter */}
                <CustomDropdown
                  label="Category"
                  value={category}
                  options={categories}
                  onChange={(value) => handleFilterChange('category', value)}
                />

                {/* Sort Filter */}
                <CustomDropdown
                  label="Sort By"
                  value={sort}
                  options={sortOptions}
                  onChange={(value) => handleFilterChange('sort', value)}
                />
              </div>

              {/* Right Side - Results Count */}
              <div className="flex items-center space-x-4 relative z-10">
                <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-md border border-orange-500/30 rounded-lg px-6 py-3">
                  <FiGrid size={20} className="text-orange-500" />
                  <div className="text-white/80 font-medium">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-bold text-xl">{products.length}</span>
                    <span className="ml-2">{products.length === 1 ? 'product' : 'products'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              {/* Enhanced Loading Spinner */}
              <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-500 rounded-full animate-spin" style={{animationDuration: '1.5s', animationDirection: 'reverse'}}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="space-y-6 relative">
              {/* Background Glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative w-24 h-24 bg-gradient-to-br from-gray-900 to-black border-2 border-orange-500/30 rounded-full flex items-center justify-center mx-auto">
                <FiGrid size={32} className="text-orange-500" />
              </div>
              <h3 className="text-3xl font-bold text-white" style={{
                textShadow: '0 0 20px rgba(255, 107, 53, 0.4)'
              }}>No products found</h3>
              <p className="text-white/70 max-w-md mx-auto text-lg">
                Try adjusting your filters or browse our full collection to find what you're looking for.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Products Grid with Enhanced Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map(product => (
                <div key={product.id} className="transform hover:scale-105 transition-all duration-500">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Load More Button with Creative Effects */}
            {products.length >= 12 && (
              <div className="text-center pt-12">
                <button className="group relative inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-4 rounded-lg hover:from-red-600 hover:to-orange-500 transition-all duration-500 font-semibold text-lg tracking-wide uppercase overflow-hidden shadow-xl"
                  style={{
                    boxShadow: '0 10px 30px rgba(255, 107, 53, 0.4)'
                  }}
                >
                  <span className="relative z-10">Load More Products</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
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
