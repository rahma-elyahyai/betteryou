// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(214,249,61,0.1),transparent_50%)]" />
      
      <div className="relative text-center max-w-2xl">
        <div className="mb-8 animate-bounce">
          <Search className="text-[#D6F93D] mx-auto" size={80} strokeWidth={1.5} />
        </div>
        
        <h1 className="text-8xl md:text-9xl font-bold text-[#D6F93D] mb-4">
          404
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-white/10 border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-[#D6F93D] text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all flex items-center gap-2 shadow-lg shadow-[#D6F93D]/30"
          >
            <Home size={20} />
            Back to Home
          </button>
        </div>
        
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white/60 hover:text-[#D6F93D] transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/nutrition')}
            className="text-white/60 hover:text-[#D6F93D] transition-colors"
          >
            Nutrition
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="text-white/60 hover:text-[#D6F93D] transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-white/60 hover:text-[#D6F93D] transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
