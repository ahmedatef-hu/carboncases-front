import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bestsellers');
  const [expandedSeries, setExpandedSeries] = useState(1);
  const carouselRef = useRef(null);
  const featuredCarouselRef = useRef(null);

  // Phone series data
  const phoneSeries = [
    {
      id: 1,
      name: 'IMPACT SERIES 1.0',
      title: 'IMPACT SERIES 1.0',
      rating: 5,
      description: 'A refined take on our signature design, delivering a premium look and feel through a performance build, metal accents, and a smooth touch profile.',
      image: 'https://apexcarbon.ca/cdn/shop/files/PHONE_CASE_4e4e503f-be04-4c3e-8c8a-8c559d521b9c.jpg?v=1765354734',
      category: 'impact-series-1',
      color: 'red'
    },
    {
      id: 2,
      name: 'IMPACT SERIES 2.0',
      title: 'IMPACT SERIES 2.0',
      rating: 5,
      description: 'Enhanced protection with advanced carbon fiber weaving technology. Premium materials meet cutting-edge design for ultimate device security.',
      image: 'https://apexcarbon.ca/cdn/shop/files/PHONE_CASE_4e4e503f-be04-4c3e-8c8a-8c559d521b9c.jpg?v=1765354734',
      category: 'impact-series-2',
      color: 'blue'
    },
    {
      id: 3,
      name: 'SKELETON SERIES',
      title: 'SKELETON SERIES',
      rating: 5,
      description: 'Minimalist design with maximum protection. Ultra-lightweight carbon fiber construction that showcases your device while keeping it safe.',
      image: 'https://apexcarbon.ca/cdn/shop/files/PHONE_CASE_4e4e503f-be04-4c3e-8c8a-8c559d521b9c.jpg?v=1765354734',
      category: 'skeleton-series',
      color: 'teal'
    },
    {
      id: 4,
      name: 'ARAMID SERIES',
      title: 'ARAMID SERIES',
      rating: 5,
      description: 'Military-grade aramid fiber construction. Bulletproof material technology adapted for everyday device protection with premium aesthetics.',
      image: 'https://apexcarbon.ca/cdn/shop/files/PHONE_CASE_4e4e503f-be04-4c3e-8c8a-8c559d521b9c.jpg?v=1765354734',
      category: 'aramid-series',
      color: 'gray'
    }
  ];

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollFeaturedLeft = () => {
    if (featuredCarouselRef.current) {
      featuredCarouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollFeaturedRight = () => {
    if (featuredCarouselRef.current) {
      featuredCarouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products?sort=newest');
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(https://apexcarbon.ca/cdn/shop/files/cosmic_orange_HP_Banner_V5.jpg?v=1771901380)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }} />
        </div>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex items-center justify-start min-h-screen py-20">
            
            {/* Left Content */}
            <div className="text-left space-y-12 animate-fade-in max-w-xl">
              {/* New Collection Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-xs font-semibold tracking-widest">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span className="text-white">NEW COLLECTION</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="font-serif font-black text-white leading-tight">
                  <span className="block text-4xl md:text-6xl mb-2">NEW COSMIC</span>
                  <span className="block text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                    ORANGE
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-md">
                  Premium carbon fiber cases for iPhone 17 Pro Max.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center bg-white text-black px-8 py-4 font-bold text-sm tracking-wide uppercase hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  SHOP NOW
                </Link>
                
                <Link
                  to="/products?category=phone-covers"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 font-bold text-sm tracking-wide uppercase hover:bg-white hover:text-black transition-all duration-300"
                >
                  VIEW COLLECTION
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
      {/* Categories Carousel */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-black">SHOP BY CATEGORY</h2>
            <p className="text-gray-600 text-lg uppercase tracking-wide">
              Discover our premium carbon fiber collection
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-4 gap-10">
            {/* Phone Cases */}
            <Link to="/products?category=phone-covers" className="group category-card">
              <div className="relative overflow-hidden bg-gray-100 rounded-none hover:shadow-xl transition-all duration-300" style={{aspectRatio: '3/4', minHeight: '320px'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://apexcarbon.ca/cdn/shop/files/PHONE_CASE_4e4e503f-be04-4c3e-8c8a-8c559d521b9c.jpg?v=1765354734" 
                    alt="Phone Cases" 
                    className="w-40 h-60 object-cover rounded-lg shadow-2xl category-icon"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-bold text-2xl mb-3 text-white transition-colors uppercase tracking-wide">
                    PHONE CASES
                  </h3>
                  <p className="text-gray-200 transition-colors text-base uppercase tracking-wide">
                    Premium Protection
                  </p>
                </div>
              </div>
            </Link>

            {/* Wallets */}
            <Link to="/products?category=wallets" className="group category-card">
              <div className="relative overflow-hidden bg-gray-100 rounded-none hover:shadow-xl transition-all duration-300" style={{aspectRatio: '3/4', minHeight: '320px'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://www.simplycarbonfiber.com/cdn/shop/products/real-carbon-fiber-cash-card-slim-wallet-wallets-money-clips-carbo-neek-855759.jpg?v=1639005598&width=1080" 
                    alt="Wallets" 
                    className="w-48 h-32 object-cover rounded-lg shadow-2xl category-icon"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-bold text-2xl mb-3 text-white transition-colors uppercase tracking-wide">
                    WALLETS
                  </h3>
                  <p className="text-gray-200 transition-colors text-base uppercase tracking-wide">
                    Slim & Secure
                  </p>
                </div>
              </div>
            </Link>

            {/* AirPods Cases */}
            <Link to="/products?category=airpods-covers" className="group category-card">
              <div className="relative overflow-hidden bg-gray-100 rounded-none hover:shadow-xl transition-all duration-300" style={{aspectRatio: '3/4', minHeight: '320px'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://apexcarbon.ca/cdn/shop/files/Product_photos_bloc_section_store_846620da-5359-40b5-9acc-2d11e0044418.jpg?v=1765416707" 
                    alt="AirPods Cases" 
                    className="w-28 h-36 object-cover rounded-xl shadow-2xl category-icon"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-bold text-2xl mb-3 text-white transition-colors uppercase tracking-wide">
                    AIRPODS CASES
                  </h3>
                  <p className="text-gray-200 transition-colors text-base uppercase tracking-wide">
                    Wireless Ready
                  </p>
                </div>
              </div>
            </Link>

            {/* Car Plate Frames */}
            <Link to="/products?category=car-accessories" className="group category-card">
              <div className="relative overflow-hidden bg-gray-100 rounded-none hover:shadow-xl transition-all duration-300" style={{aspectRatio: '3/4', minHeight: '320px'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://apexcarbon.ca/cdn/shop/files/4_976b0fbd-9dd5-47e9-bc22-af1105475223.jpg?v=1765354755" 
                    alt="Car Plate Frames" 
                    className="w-44 h-28 object-cover rounded-sm shadow-2xl category-icon border-2 border-gray-300"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="font-bold text-2xl mb-3 text-white transition-colors uppercase tracking-wide">
                    CAR PLATE FRAMES
                  </h3>
                  <p className="text-gray-200 transition-colors text-base uppercase tracking-wide">
                    Automotive Style
                  </p>
                </div>
              </div>
            </Link>
          </div>
          {/* Mobile/Tablet Carousel */}
          <div className="lg:hidden relative">
            {/* Navigation Arrows */}
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-3 rounded-full carousel-nav-btn shadow-lg"
            >
              <FiChevronLeft size={24} />
            </button>
            
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-3 rounded-full carousel-nav-btn shadow-lg"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Scrollable Container */}
            <div 
              ref={carouselRef}
              className="flex overflow-x-auto scrollbar-hide gap-6 px-12 py-4 scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {/* Phone Cases */}
              <Link to="/products?category=phone-covers" className="group category-card flex-shrink-0">
                <div className="relative overflow-hidden bg-gray-100 rounded-none hover:shadow-xl transition-all duration-300 w-64 h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="https://apexcarbon.ca/cdn/shop/files/PHONE_CASE_4e4e503f-be04-4c3e-8c8a-8c559d521b9c.jpg?v=1765354734" 
                      alt="Phone Cases" 
                      className="w-32 h-48 object-cover rounded-lg shadow-2xl category-icon"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-bold text-xl mb-2 text-white transition-colors uppercase tracking-wide">
                      PHONE CASES
                    </h3>
                    <p className="text-gray-200 transition-colors text-sm uppercase tracking-wide">
                      Premium Protection
                    </p>
                  </div>
                </div>
              </Link>

              {/* Wallets */}
              <Link to="/products?category=wallets" className="group category-card flex-shrink-0">
                <div className="relative overflow-hidden bg-gray-100 rounded-none hover:shadow-xl transition-all duration-300 w-64 h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="https://www.simplycarbonfiber.com/cdn/shop/products/real-carbon-fiber-cash-card-slim-wallet-wallets-money-clips-carbo-neek-855759.jpg?v=1639005598&width=1080" 
                      alt="Wallets" 
                      className="w-40 h-24 object-cover rounded-lg shadow-2xl category-icon"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-bold text-xl mb-2 text-white transition-colors uppercase tracking-wide">
                      WALLETS
                    </h3>
                    <p className="text-gray-200 transition-colors text-sm uppercase tracking-wide">
                      Slim & Secure
                    </p>
                  </div>
                </div>
              </Link>

              {/* AirPods Cases */}
              <Link to="/products?category=airpods-covers" className="group category-card flex-shrink-0">
                <div className="relative overflow-hidden bg-gray-100 rounded-none hover:shadow-xl transition-all duration-300 w-64 h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="https://apexcarbon.ca/cdn/shop/files/Product_photos_bloc_section_store_846620da-5359-40b5-9acc-2d11e0044418.jpg?v=1765416707" 
                      alt="AirPods Cases" 
                      className="w-20 h-28 object-cover rounded-xl shadow-2xl category-icon"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-bold text-xl mb-2 text-white transition-colors uppercase tracking-wide">
                      AIRPODS CASES
                    </h3>
                    <p className="text-gray-200 transition-colors text-sm uppercase tracking-wide">
                      Wireless Ready
                    </p>
                  </div>
                </div>
              </Link>

              {/* Car Plate Frames */}
              <Link to="/products?category=car-accessories" className="group category-card flex-shrink-0">
                <div className="relative overflow-hidden bg-gray-100 rounded-none hover:shadow-xl transition-all duration-300 w-64 h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src="https://apexcarbon.ca/cdn/shop/files/4_976b0fbd-9dd5-47e9-bc22-af1105475223.jpg?v=1765354755" 
                      alt="Car Plate Frames" 
                      className="w-36 h-20 object-cover rounded-sm shadow-2xl category-icon border-2 border-gray-300"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-bold text-xl mb-2 text-white transition-colors uppercase tracking-wide">
                      CAR PLATE FRAMES
                    </h3>
                    <p className="text-gray-200 transition-colors text-sm uppercase tracking-wide">
                      Automotive Style
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header with Tabs */}
          <div className="mb-12">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8 text-black uppercase tracking-wide">FEATURED</h2>
            
            {/* Tabs */}
            <div className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('bestsellers')}
                className={`pb-4 text-lg font-medium uppercase tracking-wide transition-colors ${
                  activeTab === 'bestsellers'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveTab('newarrivals')}
                className={`pb-4 text-lg font-medium uppercase tracking-wide transition-colors ${
                  activeTab === 'newarrivals'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                New Arrivals
              </button>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:block">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map(product => (
                  <div key={product.id} className="transform hover:scale-105 transition-all duration-300">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile/Tablet Carousel */}
          <div className="lg:hidden relative">
            {/* Navigation Arrows */}
            <button 
              onClick={scrollFeaturedLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-3 rounded-full carousel-nav-btn shadow-lg"
            >
              <FiChevronLeft size={24} />
            </button>
            
            <button 
              onClick={scrollFeaturedRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-3 rounded-full carousel-nav-btn shadow-lg"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Scrollable Container */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            ) : (
              <div 
                ref={featuredCarouselRef}
                className="flex overflow-x-auto scrollbar-hide gap-6 px-12 py-4 scroll-smooth"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {featuredProducts.map(product => (
                  <div key={product.id} className="flex-shrink-0 w-72">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/products"
              className="inline-flex items-center justify-center bg-black text-white px-12 py-4 rounded-none hover:bg-gray-800 transition-all font-semibold text-lg tracking-wide uppercase"
            >
              VIEW ALL PRODUCTS
              <FiArrowRight size={24} className="ml-3" />
            </Link>
          </div>
        </div>
      </section>
      {/* Shop by Phone Series */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-4 text-black uppercase tracking-wide">SHOP BY PHONE SERIES</h2>
          </div>

          {/* Series Accordion - Mobile: vertical cards, Desktop: horizontal accordion */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 lg:h-80">
            {phoneSeries.map((series, index) => (
              <div
                key={series.id}
                onMouseEnter={() => setExpandedSeries(series.id)}
                className={`relative overflow-hidden rounded-xl transition-all duration-700 ease-in-out cursor-pointer 
                  w-full h-80 lg:h-auto lg:w-auto shadow-lg hover:shadow-xl
                  ${expandedSeries === series.id ? 'lg:flex-[2]' : 'lg:flex-[0.5]'}
                `}
              >
                
                {/* Layer 1: Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={series.image}
                    alt={series.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Layer 2: Gradient Overlay - More prominent on mobile */}
                <div className={`absolute inset-0 z-10 ${
                  index === 0 ? 'bg-gradient-to-br from-slate-700/90 to-slate-900/90 lg:from-slate-600/80 lg:to-slate-800/80' :
                  index === 1 ? 'bg-gradient-to-br from-stone-700/90 to-stone-900/90 lg:from-stone-600/80 lg:to-stone-800/80' :
                  index === 2 ? 'bg-gradient-to-br from-zinc-700/90 to-zinc-900/90 lg:from-zinc-600/80 lg:to-zinc-800/80' :
                  'bg-gradient-to-br from-gray-800/90 to-gray-900/90 lg:from-gray-700/80 lg:to-gray-900/80'
                }`}></div>

                {/* Layer 3: Collapsed State - Vertical Text (Desktop only) */}
                <div className={`absolute inset-0 z-20 hidden lg:flex items-center justify-center transition-opacity duration-500 ${
                  expandedSeries === series.id ? 'opacity-0' : 'opacity-100'
                }`}>
                  <h3 className="font-bold text-xl text-white uppercase tracking-wider transform -rotate-90 whitespace-nowrap">
                    {series.name}
                  </h3>
                </div>

                {/* Layer 4: Expanded State - Full Content (Always visible on mobile) */}
                <div className={`absolute inset-0 z-20 p-6 lg:p-8 flex flex-col justify-between transition-opacity duration-500 ${
                  expandedSeries === series.id ? 'opacity-100' : 'lg:opacity-0 opacity-100'
                }`}>
                  
                  {/* Header */}
                  <div>
                    <h3 className="font-bold text-xl lg:text-2xl text-white uppercase tracking-wide mb-3 leading-tight">
                      {series.title}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-4 lg:mb-6">
                      {[...Array(series.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-base lg:text-lg mr-1">★</span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex-1 flex items-center">
                    <p className="text-white text-sm lg:text-base leading-relaxed max-w-md">
                      {series.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-4 lg:mt-6">
                    <Link
                      to={`/products?category=${series.category}`}
                      className="inline-flex items-center bg-white text-black px-5 py-2.5 lg:px-6 lg:py-3 text-xs lg:text-sm font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors rounded-sm shadow-md hover:shadow-lg"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>

                {/* Layer 5: Border Effect */}
                <div className={`absolute inset-0 z-30 border-2 transition-all duration-300 rounded-xl pointer-events-none ${
                  expandedSeries === series.id ? 'border-white/50' : 'border-transparent'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;