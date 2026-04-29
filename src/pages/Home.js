import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSeries, setExpandedSeries] = useState(1);
  const featuredCarouselRef = useRef(null);
  const [centerIndex, setCenterIndex] = useState(0);

  // Phone series data
  const phoneSeries = [
    {
      id: 1,
      name: 'IMPACT SERIES 1.0',
      title: 'IMPACT SERIES 1.0',
      rating: 5,
      description: 'A refined take on our signature design, delivering a premium look and feel through a performance build, metal accents, and a smooth touch profile.',
      image: '/IMPACT SERIES 1.0.JPG.jpeg',
      category: 'phone-covers',
      color: 'red'
    },
    {
      id: 2,
      name: 'IMPACT SERIES 2.0',
      title: 'IMPACT SERIES 2.0',
      rating: 5,
      description: 'Enhanced protection with advanced carbon fiber weaving technology. Premium materials meet cutting-edge design for ultimate device security.',
      image: '/IMPACT SERIES 2.0.PNG',
      category: 'phone-covers',
      color: 'blue'
    },
    {
      id: 3,
      name: 'SKELETON SERIES',
      title: 'SKELETON SERIES',
      rating: 5,
      description: 'Minimalist design with maximum protection. Ultra-lightweight carbon fiber construction that showcases your device while keeping it safe.',
      image: '/SKELETON SERIES.JPG.jpeg',
      category: 'phone-covers',
      color: 'teal'
    },
    {
      id: 4,
      name: 'ARAMID SERIES',
      title: 'ARAMID SERIES',
      rating: 5,
      description: 'Military-grade aramid fiber construction. Bulletproof material technology adapted for everyday device protection with premium aesthetics.',
      image: '/ARAMID SERIES.JPG.jpeg',
      category: 'phone-covers',
      color: 'gray'
    }
  ];

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

  // Handle scroll to update center item
  const handleCarouselScroll = () => {
    if (featuredCarouselRef.current) {
      const container = featuredCarouselRef.current;
      const scrollLeft = container.scrollLeft;
      const itemWidth = 320; // 288px width + 24px gap
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCenterIndex(newIndex);
    }
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Fetch real products from database
        const response = await api.get('/products');
        setFeaturedProducts(response.data.slice(0, 4)); // Show only 4 products (1 row)
      } catch (error) {
        console.error('Error fetching products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="fade-in bg-black min-h-screen">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="floating-particles">
          {[...Array(50)].map((_, i) => (
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source 
              src="https://stealthcarbonfiber.com/cdn/shop/videos/c/vp/b4e25e71020b477f98ef3af30a48881d/b4e25e71020b477f98ef3af30a48881d.HD-1080p-7.2Mbps-26814545.mp4?v=0" 
              type="video/mp4" 
            />
            {/* Fallback image if video doesn't load */}
            <img 
              src="https://apexcarbon.ca/cdn/shop/files/4_9820d473-6816-4fa1-86e5-63437f105eaf.jpg?v=1766176324&width=1100"
              alt="Carbon Fiber Background"
              className="w-full h-full object-cover"
            />
          </video>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex items-center justify-center min-h-screen py-20">
            
            {/* Center Content */}
            <div className="text-center space-y-8 max-w-4xl">
              
              {/* Main Title */}
              <div className="space-y-4">
                <h1 className="font-serif font-black leading-none">
                  <span className="block text-4xl md:text-6xl lg:text-7xl text-white mb-1" style={{
                    textShadow: '0 0 30px rgba(0, 0, 0, 0.8), 0 0 60px rgba(255, 255, 255, 0.2)'
                  }}>
                    CARBON
                  </span>
                  <span className="block text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 leading-none -mt-2" style={{
                    textShadow: '0 0 40px rgba(255, 107, 53, 0.4)'
                  }}>
                    CASE
                  </span>
                </h1>
                
                {/* Elegant Divider */}
                <div className="flex items-center justify-center space-x-4 my-4">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent via-white/60 to-transparent"></div>
                </div>
                
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed" style={{
                  textShadow: '0 0 20px rgba(0, 0, 0, 0.8)'
                }}>
                  Premium Carbon Fiber Protection
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Link
                  to="/products"
                  className="group relative w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 text-white px-10 py-3.5 text-base font-bold uppercase transition-all duration-500 hover:scale-105 rounded-lg text-center overflow-hidden shadow-xl backdrop-blur-sm"
                  style={{
                    boxShadow: '0 10px 25px rgba(255, 107, 53, 0.3)'
                  }}
                >
                  <span className="relative z-10">SHOP NOW</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </Link>
                
                <Link
                  to="/products?category=phone-covers"
                  className="group w-full sm:w-auto bg-black/30 backdrop-blur-md border border-white/30 text-white px-10 py-3.5 text-base font-bold uppercase hover:bg-white/10 hover:border-orange-500/50 hover:text-orange-300 transition-all duration-500 rounded-lg text-center"
                >
                  <span className="flex items-center justify-center">
                    VIEW COLLECTION
                    <FiArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center animate-bounce">
            <div className="w-1 h-3 bg-gradient-to-b from-orange-500 to-red-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
      {/* Categories Carousel */}
      <section className="py-32 px-4 relative overflow-hidden bg-black">
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
          
          {/* Scanning Light Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent animate-scan-horizontal"></div>
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-red-500/50 to-transparent animate-scan-vertical"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-black mb-10 text-white relative" style={{
              textShadow: '0 0 40px rgba(255, 107, 53, 0.4), 0 0 80px rgba(255, 255, 255, 0.1)'
            }}>
              <span className="relative z-10">SHOP BY CATEGORY</span>
            </h2>
            
            {/* Creative Divider */}
            <div className="flex items-center justify-center space-x-8 mb-10">
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
            
            <p className="text-white/90 text-lg md:text-xl font-light tracking-wider uppercase" style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
            }}>
              Discover Premium Carbon Fiber Excellence
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-5 gap-8">
            {/* Phone Cases */}
            <Link to="/products?category=phone-covers" className="group">
              <div className="category-card-creative rounded-2xl w-full h-80 relative">
                {/* Floating Particles */}
                <div className="category-particles">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="category-particle"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 20}%`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Border Animation */}
                <div className="category-border-animation rounded-2xl"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="relative mb-6 transform transition-all duration-700">
                    <img 
                      src="/Forged Carbon Fiber Max 2.0.jpg.jpeg" 
                      alt="Phone Cases" 
                      className="category-image-glow w-32 h-40 object-cover rounded-xl shadow-2xl"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="category-text-glow font-bold text-xl text-white uppercase tracking-wide">
                      PHONE SERIES
                    </h3>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Wallets */}
            <Link to="/products?category=wallets" className="group">
              <div className="category-card-creative rounded-2xl w-full h-80 relative">
                <div className="category-particles">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="category-particle"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 20}%`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
                <div className="category-border-animation rounded-2xl"></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="relative mb-6 transform transition-all duration-700">
                    <img 
                      src="/Wallet.JPG.jpeg" 
                      alt="Wallets" 
                      className="category-image-glow w-32 h-40 object-cover rounded-xl shadow-2xl"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="category-text-glow font-bold text-xl text-white uppercase tracking-wide">
                      WALLETS
                    </h3>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                  </div>
                </div>
              </div>
            </Link>

            {/* AirPods Cases */}
            <Link to="/products?category=airpods-covers" className="group">
              <div className="category-card-creative rounded-2xl w-full h-80 relative">
                <div className="category-particles">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="category-particle"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 20}%`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
                <div className="category-border-animation rounded-2xl"></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="relative mb-6 transform transition-all duration-700">
                    <img 
                      src="https://apexcarbon.ca/cdn/shop/files/Product_photos_bloc_section_store_846620da-5359-40b5-9acc-2d11e0044418.jpg?v=1765416707" 
                      alt="AirPods Cases" 
                      className="category-image-glow w-32 h-40 object-cover rounded-xl shadow-2xl"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="category-text-glow font-bold text-xl text-white uppercase tracking-wide">
                      AIRPODS CASES
                    </h3>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Watch Cases */}
            <Link to="/products?category=watch-cases" className="group">
              <div className="category-card-creative rounded-2xl w-full h-80 relative">
                <div className="category-particles">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="category-particle"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 20}%`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
                <div className="category-border-animation rounded-2xl"></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="relative mb-6 transform transition-all duration-700">
                    <img 
                      src="/Watch Case.jpeg" 
                      alt="Watch Cases" 
                      className="category-image-glow w-32 h-40 object-cover rounded-xl shadow-2xl"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="category-text-glow font-bold text-xl text-white uppercase tracking-wide">
                      WATCH CASES
                    </h3>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Car Accessories */}
            <Link to="/products?category=car-accessories" className="group">
              <div className="category-card-creative rounded-2xl w-full h-80 relative">
                <div className="category-particles">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="category-particle"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 20}%`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
                <div className="category-border-animation rounded-2xl"></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="relative mb-6 transform transition-all duration-700">
                    <img 
                      src="/Car Accessories .jpeg" 
                      alt="Car Accessories" 
                      className="category-image-glow w-32 h-40 object-cover rounded-xl shadow-2xl"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="category-text-glow font-bold text-xl text-white uppercase tracking-wide">
                      CAR ACCESSORIES
                    </h3>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile/Tablet Grid */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
            {/* Mobile category cards */}
            {[
              { name: 'PHONE SERIES', img: '/Forged Carbon Fiber Max 2.0.jpg.jpeg', link: '/products?category=phone-covers' },
              { name: 'WALLETS', img: '/Wallet.JPG.jpeg', link: '/products?category=wallets' },
              { name: 'AIRPODS CASES', img: 'https://apexcarbon.ca/cdn/shop/files/Product_photos_bloc_section_store_846620da-5359-40b5-9acc-2d11e0044418.jpg?v=1765416707', link: '/products?category=airpods-covers' },
              { name: 'WATCH CASES', img: '/Watch Case.jpeg', link: '/products?category=watch-cases' },
              { name: 'CAR ACCESSORIES', img: '/Car Accessories .jpeg', link: '/products?category=car-accessories' }
            ].map((category, index) => (
              <Link key={index} to={category.link} className="group">
                <div className="category-card-creative rounded-2xl w-full h-80 relative">
                  {/* Floating Particles */}
                  <div className="category-particles">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="category-particle"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + (i % 2) * 20}%`,
                          animationDelay: `${i * 0.5}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Border Animation */}
                  <div className="category-border-animation rounded-2xl"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="relative mb-6 transform transition-all duration-700">
                      <img 
                        src={category.img}
                        alt={category.name}
                        className="category-image-glow w-32 h-40 object-cover rounded-xl shadow-2xl"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="category-text-glow font-bold text-lg text-white uppercase tracking-wide">
                        {category.name}
                      </h3>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="py-32 px-4 relative overflow-hidden bg-black">
        {/* Advanced Creative Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute inset-0 opacity-8">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                radial-gradient(circle at 50px 50px, rgba(255, 107, 53, 0.15) 2px, transparent 2px),
                radial-gradient(circle at 100px 100px, rgba(255, 107, 53, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px, 50px 50px',
              animation: 'hexagon-drift 25s linear infinite'
            }}></div>
          </div>
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-energy-float" style={{animationDuration: '10s'}}></div>
            <div className="absolute bottom-32 right-32 w-60 h-60 bg-gradient-to-r from-red-500/15 to-orange-500/15 rounded-full blur-3xl animate-energy-float" style={{animationDuration: '15s', animationDelay: '5s'}}></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20">
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-black mb-8 text-white text-center" style={{
              textShadow: '0 0 50px rgba(255, 107, 53, 0.6), 0 0 100px rgba(255, 255, 255, 0.1)'
            }}>
              OUR PRODUCTS
            </h2>
            
            <div className="flex items-center justify-center space-x-8 mb-12">
              <div className="flex space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
              <div className="w-32 h-px bg-gradient-to-r from-orange-500 to-red-500 animate-gradient-x"></div>
              <div className="flex space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.9s'}}></div>
                <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '1.2s'}}></div>
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
              </div>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:block">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-gray-800 border-t-orange-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-red-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="relative group"
                    style={{animationDelay: `${index * 0.2}s`}}
                  >
                    <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    <div className="relative transform transition-all duration-700 group-hover:scale-105 group-hover:-translate-y-4">
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/60 text-xl">No products available yet</p>
              </div>
            )}
          </div>

          {/* Mobile Carousel */}
          <div className="lg:hidden relative">
            <button 
              onClick={scrollFeaturedLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full"
              style={{ boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)' }}
            >
              <FiChevronLeft size={20} />
            </button>
            
            <button 
              onClick={scrollFeaturedRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full"
              style={{ boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)' }}
            >
              <FiChevronRight size={20} />
            </button>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-16 h-16 border-4 border-gray-800 border-t-orange-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div 
                ref={featuredCarouselRef}
                onScroll={handleCarouselScroll}
                className="flex overflow-x-auto scrollbar-hide gap-6 py-8 scroll-smooth snap-x snap-mandatory"
                style={{
                  paddingLeft: 'calc(50% - 140px)',
                  paddingRight: 'calc(50% - 140px)'
                }}
              >
                {featuredProducts.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="flex-shrink-0 w-72 snap-center transition-all duration-300"
                    style={{
                      transform: centerIndex === index ? 'scale(1)' : 'scale(0.85)',
                      opacity: centerIndex === index ? '1' : '0.5'
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center mt-24">
            <div className="relative inline-block group">
              <div className="absolute -inset-3 bg-gradient-to-r from-orange-500/40 to-red-500/40 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              <Link
                to="/products"
                className="relative inline-flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-14 py-5 font-black text-lg tracking-widest uppercase transition-all duration-500 transform group-hover:scale-105 overflow-hidden rounded-xl"
                style={{ boxShadow: '0 15px 40px rgba(255, 107, 53, 0.4)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative z-10 mr-3">VIEW ALL PRODUCTS</span>
                <FiArrowRight size={22} className="relative z-10 transform group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Phone Series */}
      <section className="py-32 px-4 relative overflow-hidden bg-black">
        {/* Advanced Creative Background */}
        <div className="absolute inset-0">
          {/* Pure Black Base */}
          <div className="absolute inset-0 bg-black"></div>
          
          {/* Animated Circuit Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(255, 107, 53, 0.2) 1px, transparent 1px),
                linear-gradient(rgba(255, 107, 53, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
              animation: 'grid-move 20s linear infinite'
            }}></div>
          </div>
          
          {/* Radial Glow Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-orange-500/15 to-red-500/15 rounded-full blur-3xl animate-energy-float" style={{animationDuration: '12s'}}></div>
            <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-energy-float" style={{animationDuration: '18s', animationDelay: '6s'}}></div>
          </div>
          
          {/* Spotlight Beams */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-full bg-gradient-to-b from-orange-500/40 via-transparent to-transparent blur-2xl"></div>
            <div className="absolute top-0 right-1/4 w-64 h-full bg-gradient-to-b from-red-500/30 via-transparent to-transparent blur-2xl"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white uppercase tracking-wide" style={{
              textShadow: '0 0 50px rgba(255, 107, 53, 0.6), 0 0 100px rgba(255, 255, 255, 0.1)'
            }}>
              PHONE SERIES
            </h2>
            
            {/* Animated Divider */}
            <div className="flex items-center justify-center space-x-6 mb-8">
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-gradient-x"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
              <div className="w-20 h-px bg-gradient-to-l from-transparent via-red-500 to-transparent animate-gradient-x"></div>
            </div>
            
            <p className="text-white/90 text-lg md:text-xl uppercase tracking-widest font-light" style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
            }}>
              Choose Your Perfect Match
            </p>
          </div>

          {/* Enhanced Series Accordion */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 lg:h-96">
            {phoneSeries.map((series, index) => (
              <div
                key={series.id}
                onMouseEnter={() => setExpandedSeries(series.id)}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-700 ease-in-out cursor-pointer 
                  w-full h-96 lg:h-auto lg:w-auto
                  ${expandedSeries === series.id ? 'lg:flex-[2]' : 'lg:flex-[0.5]'}
                `}
              >
                {/* Floating Particles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-30">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-float-product-particle"
                      style={{
                        left: `${10 + i * 10}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        animationDelay: `${i * 0.4}s`,
                        animationDuration: `${3 + i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Glow Border Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-red-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 blur-sm animate-pulse-glow"></div>
                
                {/* Layer 1: Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={series.image}
                    alt={series.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-700"></div>
                </div>

                {/* Layer 2: Enhanced Gradient Overlay */}
                <div className={`absolute inset-0 z-10 transition-opacity duration-700 ${
                  index === 0 ? 'bg-gradient-to-br from-black/60 via-gray-900/50 to-orange-900/40' :
                  index === 1 ? 'bg-gradient-to-br from-black/60 via-gray-900/50 to-red-900/40' :
                  index === 2 ? 'bg-gradient-to-br from-black/60 via-gray-800/50 to-orange-800/40' :
                  'bg-gradient-to-br from-black/60 via-gray-800/50 to-gray-900/40'
                } group-hover:opacity-70`}></div>

                {/* Layer 3: Collapsed State - Vertical Text (Desktop only) */}
                <div className={`absolute inset-0 z-20 hidden lg:flex items-center justify-center transition-opacity duration-500 ${
                  expandedSeries === series.id ? 'opacity-0' : 'opacity-100'
                }`}>
                  <h3 className="font-black text-2xl text-white uppercase tracking-widest transform -rotate-90 whitespace-nowrap" style={{
                    textShadow: '0 0 30px rgba(255, 107, 53, 0.8), 0 0 60px rgba(255, 255, 255, 0.2)'
                  }}>
                    {series.name}
                  </h3>
                </div>

                {/* Layer 4: Expanded State - Full Content */}
                <div className={`absolute inset-0 z-20 p-8 lg:p-10 flex flex-col justify-between transition-opacity duration-500 ${
                  expandedSeries === series.id ? 'opacity-100' : 'lg:opacity-0 opacity-100'
                }`}>
                  
                  {/* Header */}
                  <div>
                    <h3 className="font-black text-2xl lg:text-3xl text-white uppercase tracking-wide mb-4 leading-tight transform group-hover:scale-105 transition-transform duration-500" style={{
                      textShadow: '0 0 30px rgba(255, 107, 53, 0.6), 0 0 60px rgba(0, 0, 0, 0.8)'
                    }}>
                      {series.title}
                    </h3>
                    
                    {/* Enhanced Rating */}
                    <div className="flex items-center mb-6 lg:mb-8">
                      {[...Array(series.rating)].map((_, i) => (
                        <span 
                          key={i} 
                          className="text-orange-400 text-xl lg:text-2xl mr-1 transform group-hover:scale-110 transition-transform duration-300"
                          style={{
                            filter: 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.8))',
                            animationDelay: `${i * 0.1}s`
                          }}
                        >★</span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex-1 flex items-center">
                    <p className="text-gray-200 text-base lg:text-lg leading-relaxed max-w-md group-hover:text-white transition-colors duration-500" style={{
                      textShadow: '0 0 10px rgba(0, 0, 0, 0.8)'
                    }}>
                      {series.description}
                    </p>
                  </div>

                  {/* Enhanced CTA Button */}
                  <div className="mt-6 lg:mt-8">
                    <Link
                      to={`/products?category=${series.category}`}
                      className="group/btn relative inline-flex items-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 lg:px-10 lg:py-5 text-sm lg:text-base font-black uppercase tracking-widest transition-all duration-500 rounded-xl shadow-2xl transform hover:scale-110 overflow-hidden"
                      style={{ boxShadow: '0 15px 40px rgba(255, 107, 53, 0.4)' }}
                    >
                      {/* Button Sweep Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left"></div>
                      
                      {/* Button Shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                      
                      <span className="relative z-10">Shop Series</span>
                    </Link>
                  </div>
                </div>

                {/* Spotlight Effect on Hover */}
                <div className="absolute inset-0 z-25 bg-gradient-radial from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
