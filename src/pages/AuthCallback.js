import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=' + error);
      return;
    }

    if (token) {
      // Save token
      localStorage.setItem('token', token);
      
      // Fetch user data
      fetch('https://carboncases-back.vercel.app/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch user');
          return res.json();
        })
        .then(data => {
          if (data.user) {
            // Save user data
            localStorage.setItem('user', JSON.stringify(data.user));
            // Update auth context
            window.location.href = '/';
          } else {
            console.error('No user data received');
            navigate('/login');
          }
        })
        .catch(error => {
          console.error('Auth callback error:', error);
          navigate('/login');
        });
    } else {
      console.error('No token received');
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
