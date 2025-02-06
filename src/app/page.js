// src/app/page.js
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Trying to login with:', email, password); // Debug log
    
    if (email === 'demo@adsguru.ai' && password === 'demo123') {
      console.log('Login successful'); // Debug log
      document.cookie = "isLoggedIn=true; path=/";
      router.push('/dashboard');
    } else {
      alert('Please use:\nEmail: demo@adsguru.ai\nPassword: demo123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-2xl shadow-xl w-96 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to AdsGuru AI360</h1>
          <p className="text-gray-500 mt-2 text-sm">Your AI-powered FB/TikTok marketing assistant</p>
          
          <div className="flex justify-center space-x-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-lg">fb</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
              <span className="text-pink-600 text-lg">tk</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 text-lg">ai</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 ease-in-out font-medium"
          >
            Login
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account? </span>
            <a href="#" className="text-blue-600 hover:underline font-medium">Sign Up</a>
          </div>
        </form>
      </div>
    </div>
  );
}