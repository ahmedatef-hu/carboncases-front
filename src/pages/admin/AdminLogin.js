import { useState, useEffect } from 'react';
import { FiLock, FiShield, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../../utils/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if admin is already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      window.location.href = '/admin/dashboard';
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    debugger; // This will pause execution
    console.log('🚀 Form submitted!');
    console.log('📝 Form data:', formData);
    
    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      return;
    }
    
    setLoading(true);
    setError('');

    console.log('🔐 Admin login attempt:', formData.email);

    try {
      const response = await api.post('/auth/admin/login', formData);
      
      console.log('✅ Admin login successful:', response.data);
      
      // Set authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      
      console.log('✅ Admin token saved, redirecting to dashboard...');
      console.log('📍 Current location:', window.location.href);
      
      // Force full page reload to dashboard
      setTimeout(() => {
        window.location.replace('/admin/dashboard');
      }, 100);
      
    } catch (error) {
      console.error('❌ Admin login error:', error);
      console.error('❌ Error details:', error.response?.data);
      setError(error.response?.data?.message || 'Admin login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
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

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-float" style={{animationDuration: '10s'}}></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-float" style={{animationDuration: '15s', animationDelay: '5s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl mb-6 shadow-2xl relative group animate-float"
            style={{
              boxShadow: '0 20px 60px rgba(255, 107, 53, 0.4), 0 0 80px rgba(255, 107, 53, 0.2)',
              animationDuration: '6s'
            }}
          >
            <FiShield size={48} className="text-white relative z-10" />
            {/* Rotating Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-orange-500/50 animate-spin-slow"></div>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl font-black text-white mb-3 animate-fade-in-up" style={{
            textShadow: '0 0 40px rgba(255, 107, 53, 0.4), 0 0 80px rgba(255, 255, 255, 0.1)'
          }}>
            Admin Portal
          </h1>
          
          <p className="text-xl text-white/80 font-light mb-4">Secure access for administrators</p>
          
          {/* Animated Divider */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-orange-400 uppercase tracking-wider font-semibold">Restricted Area</span>
            </div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent via-orange-500 to-transparent"></div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-orange-500/30 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-500/10 to-transparent rounded-full blur-2xl"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-2 border-red-500/50 text-red-300 px-5 py-4 rounded-xl text-sm font-medium flex items-center space-x-3 backdrop-blur-sm animate-fade-in-up">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiLock className="w-5 h-5 text-red-400" />
                </div>
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-3">
              <label htmlFor="email" className="block text-sm font-bold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span>Admin Email</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-orange-500/70 group-focus-within:text-orange-500 transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 font-medium text-white placeholder-white/40 hover:border-orange-500/50"
                  placeholder="admin@carboncases.com"
                  style={{
                    textShadow: '0 0 10px rgba(255, 107, 53, 0.3)'
                  }}
                />
                {/* Glow Effect on Focus */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-red-500/0 group-focus-within:from-orange-500/10 group-focus-within:to-red-500/10 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label htmlFor="password" className="block text-sm font-bold text-orange-400 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span>Password</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-orange-500/70 group-focus-within:text-orange-500 transition-colors duration-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 backdrop-blur-md border-2 border-orange-500/30 rounded-xl pl-12 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 font-medium text-white placeholder-white/40 hover:border-orange-500/50"
                  placeholder="••••••••"
                  style={{
                    textShadow: '0 0 10px rgba(255, 107, 53, 0.3)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-orange-500/70 hover:text-orange-500 transition-all duration-300 z-10 hover:scale-110"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
                {/* Glow Effect on Focus */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-red-500/0 group-focus-within:from-orange-500/10 group-focus-within:to-red-500/10 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-5 rounded-xl hover:from-red-600 hover:to-orange-500 transition-all duration-500 transform hover:scale-105 font-bold text-lg tracking-wider uppercase disabled:opacity-50 disabled:transform-none shadow-xl relative overflow-hidden group"
              style={{
                boxShadow: '0 10px 40px rgba(255, 107, 53, 0.4)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              {loading ? (
                <div className="flex items-center justify-center space-x-3 relative z-10">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3 relative z-10">
                  <FiShield className="w-6 h-6" />
                  <span>Admin Sign In</span>
                </div>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl border-2 border-yellow-500/30 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl"></div>
            
            <div className="flex items-center space-x-3 text-yellow-400 mb-3 relative z-10">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <FiLock className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wide">Security Notice</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed relative z-10">
              This is a restricted area. All access attempts are logged and monitored. 
              Unauthorized access is strictly prohibited.
            </p>
          </div>
        </div>

        {/* Security Indicators */}
        <div className="mt-10 text-center">
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex flex-col items-center space-y-2 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-green-500/30 group-hover:border-green-500/60 transition-all duration-300">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-white/70 font-medium">SSL Secured</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-blue-500/30 group-hover:border-blue-500/60 transition-all duration-300">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
              <span className="text-white/70 font-medium">Encrypted</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-purple-500/30 group-hover:border-purple-500/60 transition-all duration-300">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              <span className="text-white/70 font-medium">Monitored</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
