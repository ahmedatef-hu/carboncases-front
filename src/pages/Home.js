import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Engineered for
            <span className="block text-accent mt-2">Excellence</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Premium carbon fiber accessories that combine aerospace-grade materials with timeless design
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-accent text-primary px-8 py-4 rounded-lg hover:bg-accent-hover transition-all transform hover:scale-105 font-semibold text-lg"
          >
            <span>Explore Collection</span>
            <FiArrowRight size={20} />
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-secondary rounded-xl border border-gray-800 hover:border-accent transition-colors">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">Military Grade</h3>
              <p className="text-gray-400">Aerospace-grade carbon fiber provides unmatched protection</p>
            </div>
            
            <div className="text-center p-8 bg-secondary rounded-xl border border-gray-800 hover:border-accent transition-colors">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">Ultra Lightweight</h3>
              <p className="text-gray-400">Incredibly strong yet lighter than traditional materials</p>
            </div>
            
            <div className="text-center p-8 bg-secondary rounded-xl border border-gray-800 hover:border-accent transition-colors">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">Timeless Design</h3>
              <p className="text-gray-400">Minimalist aesthetics that never go out of style</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-400 text-lg">Discover our most popular carbon fiber accessories</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 text-accent hover:text-accent-hover transition-colors font-medium text-lg"
            >
              <span>View All Products</span>
              <FiArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-accent/10 to-accent-hover/10 rounded-2xl p-12 border border-accent/20">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Experience the Carbon Difference
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of satisfied customers who've upgraded to carbon fiber
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-accent text-primary px-8 py-4 rounded-lg hover:bg-accent-hover transition-all transform hover:scale-105 font-semibold"
          >
            <span>Shop Now</span>
            <FiArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
