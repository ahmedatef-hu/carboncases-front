import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    console.log('🔍 AuthCallback - URL params:', { token: token ? 'exists' : 'missing', error });

    if (error) {
      console.error('❌ OAuth error:', error);
      alert('Authentication failed: ' + error);
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      console.log('✅ Token received from Google OAuth:', token.substring(0, 20) + '...');
      
      // Save token
      localStorage.setItem('token', token);
      console.log('💾 Token saved to localStorage');
      
      // Use correct API URL based on environment
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      console.log('🔄 Fetching user profile from:', `${apiUrl}/user/profile`);
      
      // Fetch user data
      fetch(`${apiUrl}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          console.log('📡 Profile response status:', res.status);
          if (!res.ok) {
            return res.text().then(text => {
              console.error('❌ Response error:', text);
              throw new Error('Failed to fetch user: ' + res.status);
            });
          }
          return res.json();
        })
        .then(data => {
          console.log('✅ User data received:', data);
          if (data.user) {
            // Save user data
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log('✅ User saved to localStorage');
            
            // Check if user needs to complete profile
            if (!data.user.phone || !data.user.address) {
              console.log('📝 User needs to complete profile, redirecting...');
              setTimeout(() => {
                window.location.href = '/complete-profile?token=' + token;
              }, 500);
            } else {
              console.log('✅ Profile complete, redirecting to home...');
              setTimeout(() => {
                window.location.href = '/';
              }, 500);
            }
          } else {
            console.error('❌ No user data in response');
            alert('No user data received');
            navigate('/login');
          }
        })
        .catch(error => {
          console.error('❌ Auth callback error:', error);
          alert('Authentication error: ' + error.message);
          navigate('/login');
        });
    } else {
      console.error('❌ No token received in callback');
      alert('No authentication token received');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
