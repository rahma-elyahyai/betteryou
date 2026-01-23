// src/pages/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]" />
      
      <div className="relative text-center max-w-2xl">
        <div className="mb-8 animate-pulse">
          <ShieldAlert className="text-red-500 mx-auto" size={80} strokeWidth={1.5} />
        </div>
        
        <h1 className="text-8xl md:text-9xl font-bold text-red-500 mb-4">
          401
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Unauthorized Access
        </h2>
        
        <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
          You don't have permission to access this page. Please log in with an authorized account.
        </p>
        
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 max-w-md mx-auto">
          <p className="text-red-400 text-sm">
            <strong>Access Denied:</strong> This page requires authentication or special permissions.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-white/10 border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <Home size={20} />
            Back to Home
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-[#D6F93D] text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all flex items-center gap-2 shadow-lg shadow-[#D6F93D]/30"
          >
            <LogIn size={20} />
            Login
          </button>
        </div>
        
        <div className="mt-12">
          <p className="text-white/50 text-sm mb-4">Need help?</p>
          <div className="flex gap-6 justify-center text-sm">
            <button className="text-white/60 hover:text-[#D6F93D] transition-colors">
              Contact Support
            </button>
            <button className="text-white/60 hover:text-[#D6F93D] transition-colors">
              FAQ
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-white/60 hover:text-[#D6F93D] transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}