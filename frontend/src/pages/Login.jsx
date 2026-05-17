import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { setUser }     = useAuth();
  const navigate        = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      const userData = res.data;
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      // Redirect admin to dashboard, customers to home
      navigate(userData.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-[calc(100vh-128px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white flex-col items-center justify-center p-16">
        <h1 className="text-6xl font-black tracking-tighter mb-4">
          STRIDE<span className="text-yellow-400">X</span>
        </h1>
        <p className="text-gray-400 text-center text-lg leading-relaxed max-w-xs">
          Welcome back. Your performance journey continues here.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-black tracking-tight mb-2">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to your StrideX account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm tracking-wide mt-2"
            >
              {loading ? 'Signing in…' : 'SIGN IN'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-black font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}