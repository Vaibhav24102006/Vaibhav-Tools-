import React, { useState } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup, signin, loginWithGoogle } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignIn) {
        await signin(form.email, form.password);
      } else {
        await signup(form.email, form.password, form.name);
      }
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black border-2 border-primary-red rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <img 
            className="w-24 h-24 mx-auto mb-4 rounded-full shadow-lg" 
            src="/images/logo.jpg" 
            alt="Vaibhav Tools Logo" 
          />
          <h1 className="text-3xl font-bold text-white mb-2">Vaibhav Tools</h1>
          <p className="text-gray-400">Professional Tools for Professionals</p>
        </div>
        
        <div className="flex mb-6">
          <button
            className={`flex-1 py-3 px-4 font-semibold rounded-l-lg transition-all duration-300 ${
              isSignIn 
                ? 'bg-primary-red text-white shadow-lg' 
                : 'bg-transparent text-gray-400 hover:text-white border-2 border-primary-red border-r-0'
            }`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 px-4 font-semibold rounded-r-lg transition-all duration-300 ${
              !isSignIn 
                ? 'bg-primary-red text-white shadow-lg' 
                : 'bg-transparent text-gray-400 hover:text-white border-2 border-primary-red border-l-0'
            }`}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isSignIn && (
            <div>
              <label className="block mb-2 text-primary-red font-semibold" htmlFor="name">Name</label>
              <input
                className="w-full p-4 bg-black text-white border-2 border-gray-600 rounded-lg focus:border-primary-red focus:outline-none transition-all duration-300 placeholder-gray-400"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label className="block mb-2 text-primary-red font-semibold" htmlFor="email">Email</label>
            <input
              className="w-full p-4 bg-black text-white border-2 border-gray-600 rounded-lg focus:border-primary-red focus:outline-none transition-all duration-300 placeholder-gray-400"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block mb-2 text-primary-red font-semibold" htmlFor="password">Password</label>
            <input
              className="w-full p-4 bg-black text-white border-2 border-gray-600 rounded-lg focus:border-primary-red focus:outline-none transition-all duration-300 placeholder-gray-400"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete={isSignIn ? "current-password" : "new-password"}
            />
          </div>
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-primary-red hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isSignIn ? 'Signing In...' : 'Signing Up...'}
              </div>
            ) : (
              isSignIn ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>
        
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-600" />
          <span className="mx-4 text-gray-400 text-sm font-medium">OR</span>
          <div className="flex-grow h-px bg-gray-600" />
        </div>
        
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 bg-black border-2 border-gray-600 text-white font-semibold py-4 px-6 rounded-lg hover:border-primary-red hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.7 30.77 0 24 0 14.61 0 6.44 5.82 2.69 14.09l7.98 6.2C12.33 13.13 17.68 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.56-.14-3.06-.39-4.5H24v9h12.4c-.54 2.9-2.18 5.36-4.64 7.04l7.19 5.6C43.98 37.13 46.1 31.27 46.1 24.5z"/><path fill="#FBBC05" d="M10.67 28.29c-1.13-3.36-1.13-6.93 0-10.29l-7.98-6.2C.86 16.18 0 19.01 0 22c0 2.99.86 5.82 2.69 8.2l7.98-6.2z"/><path fill="#34A853" d="M24 44c6.77 0 12.68-2.7 17.04-7.35l-7.19-5.6c-2.01 1.35-4.58 2.15-7.85 2.15-6.32 0-11.67-3.63-13.33-8.79l-7.98 6.2C6.44 42.18 14.61 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Auth; 