import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import bgLogin from '../assets/cpka background.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('=== LOGIN DEBUG START ===');

    try {
      const formData = `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        console.log('✅ Login SUCCESS!');
        
        await login(data.access_token);
        
        console.log('🚀 Navigating to /home');
        
        navigate('/home', { replace: true });
      } else {
        console.log('❌ Login FAILED:', data.detail);
        setError(data.detail || 'Login gagal. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('💥 ERROR:', err);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
      console.log('=== LOGIN DEBUG END ===');
    }
  };

  return (
    <div className="auth-container">
      {/* Background image with maroon overlay */}
      <div className="auth-bg">
        <img src={bgLogin} alt="" className="auth-bg-img" />
        <div className="auth-bg-overlay"></div>
      </div>

      {/* Login box */}
      <div className="auth-box">
        <div className="auth-header">
          <LogIn size={48} className="auth-icon" />
          <h1>Masuk ke Dashboard</h1>
          <p>Silakan login untuk memantau kondisi OST secara real-time.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@cpka.co.id"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={16} />
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="text-muted">
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;