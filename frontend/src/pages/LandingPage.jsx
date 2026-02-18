import React, { useState } from 'react';
import { Dumbbell, Apple, Heart, MessageSquare, Menu, X, Target, Users, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import habitsImg from "../assets/habits-image.png";
import iaImg from "../assets/ia-image.png";
import nutritionImg from "../assets/nutrition-image.png";
import workoutImg from "../assets/workout-image.png";
import logo from '@/assets/logo.png';


export default function LandingPage() {
  const nav = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,249,61,0.10),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(214,249,61,0.10),transparent_40%)]" />
      <div className="absolute inset-0 opacity-20" />
      
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(214, 249, 61, 0.4); }
          50% { box-shadow: 0 0 35px rgba(214, 249, 61, 0.8), 0 0 50px rgba(214, 249, 61, 0.3); }
        }
        
        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }
        
        .shine-effect {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: shine 3s infinite;
        }
        
        .btn-glow {
          position: relative;
          overflow: hidden;
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .btn-glow::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .btn-glow:hover::before {
          width: 300px;
          height: 300px;
        }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
          filter: brightness(1.1);
        }
        
        .text-glow {
          text-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
        }
        
        .border-glow {
          position: relative;
        }
        
        .border-glow::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(45deg, currentColor, transparent, currentColor);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .border-glow:hover::before {
          opacity: 1;
        }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* ==================== HEADER ==================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-[#D6F93D]/20">
        <nav className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img src={logo} alt="BetterYou" className="h-12 w-auto hover:scale-105 transition-transform cursor-pointer" onClick={() => nav("/")} />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-[#D6F93D] transition-all font-medium relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6F93D] group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#workouts" className="text-gray-300 hover:text-[#D6F93D] transition-all font-medium relative group">
                Workouts
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6F93D] group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#nutrition" className="text-gray-300 hover:text-[#D6F93D] transition-all font-medium relative group">
                Nutrition
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6F93D] group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#about" className="text-gray-300 hover:text-[#D6F93D] transition-all font-medium relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6F93D] group-hover:w-full transition-all duration-300"></span>
              </a>

              {/* ── TEAM LINK ── */}
              <button
                onClick={() => nav("/TeamPage")}
                className="text-gray-300 hover:text-[#D6F93D] transition-all font-medium relative group bg-transparent border-none cursor-pointer p-0"
              >
                Team
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6F93D] group-hover:w-full transition-all duration-300"></span>
              </button>

              <button 
                onClick={() => nav("/login")}
                className="px-5 py-2 text-gray-300 hover:text-white transition-all font-medium"
              >
                Login
              </button>
              <button 
                onClick={() => nav("/register")}
                className="px-7 py-2.5 bg-[#D6F93D] hover:bg-[#c5e835] text-gray-900 font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-[#D6F93D]/40"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-[#D6F93D]/20 pt-4">
              <div className="flex flex-col gap-3">
                <a 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-[#D6F93D] py-2 px-4 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  Features
                </a>
                <a 
                  href="#workouts" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-[#D6F93D] py-2 px-4 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  Workouts
                </a>
                <a 
                  href="#nutrition" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-[#D6F93D] py-2 px-4 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  Nutrition
                </a>
                <a 
                  href="#about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-[#D6F93D] py-2 px-4 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  About
                </a>

                {/* ── TEAM LINK MOBILE ── */}
                <button
                  onClick={() => { nav("/team"); setMobileMenuOpen(false); }}
                  className="text-left text-gray-300 hover:text-[#D6F93D] py-2 px-4 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  Team
                </button>

                <button 
                  onClick={() => nav("/login")}
                  className="text-left text-gray-300 hover:text-white py-2 px-4 hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => nav("/register")}
                  className="px-6 py-3 bg-[#D6F93D] hover:bg-[#c5e835] text-gray-900 font-semibold rounded-full transition-all text-center"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative text-center px-6 py-20 max-w-4xl mx-auto animate-slide-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transform <span className="text-[#D6F93D] text-glow shine-effect">your body</span> with a smart,
            <br />
            fully personalized <span className="text-[#D6F93D] text-glow shine-effect">AI Coach.</span>
          </h1>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            BetterYou is your all-in-one wellness partner — custom workouts, tailored meal plans,
            nutritious recipes, progress tracking,
            <br />
            and daily guidance designed just for you
          </p>
          <button 
            onClick={() => nav("/login")}
            className="px-10 py-3.5 bg-[#D6F93D] text-gray-900 font-bold text-lg rounded-lg btn-glow hover:scale-105 transition-transform relative z-10">
            Start now
          </button>
        </section>

        {/* Features Overview */}
        <section id="features" className="relative px-6 py-16 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-[#D6F93D] shine-effect">Unlock Your Full Potential</span>
            <span className="text-white"> with BetterYou AI</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900/60 backdrop-blur-sm border-2 border-pink-500/50 rounded-2xl p-6 card-hover border-glow hover:border-pink-400">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-pink-500/50">
                <Dumbbell className="text-white" size={26} />
              </div>
              <h3 className="text-pink-400 font-bold text-xl mb-2">Training & Workout Plans</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Let the AI design tailored workout programs based on your goals and fitness level. Adapt your program anytime!
              </p>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-sm border-2 border-cyan-500/50 rounded-2xl p-6 card-hover border-glow hover:border-cyan-400">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/50">
                <Apple className="text-white" size={26} />
              </div>
              <h3 className="text-cyan-400 font-bold text-xl mb-2">Smart Nutrition Plans</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Get balanced meals customized for your dietary needs. AI-powered nutritionist to help you achieve your goals!
              </p>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl p-6 card-hover border-glow hover:border-purple-400">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
                <Heart className="text-white" size={26} />
              </div>
              <h3 className="text-purple-400 font-bold text-xl mb-2">Build Healthy Habits</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Create trackable daily routines customized to fit your lifestyle and goals. Track behavior and adapt!
              </p>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-sm border-2 border-green-500/50 rounded-2xl p-6 card-hover border-glow hover:border-green-400">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
                <MessageSquare className="text-white" size={26} />
              </div>
              <h3 className="text-green-400 font-bold text-xl mb-2">Daily AI Coaching</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Get instant answers and recommendations powered by AI. Your smart health coach is always nearby!
              </p>
            </div>
          </div>
        </section>

        {/* AI-Powered Workouts Section */}
        <section id="workouts" className="relative px-6 py-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-pink-500/50">
                <Dumbbell className="text-white" size={26} />
              </div>
              <h2 className="text-4xl font-bold text-pink-400 mb-4 text-glow">
                AI-Powered Personalized Workouts
              </h2>
              <p className="text-white/90 mb-6 text-lg leading-relaxed">
                Let our intelligent coach analyze your goals, fitness level, and daily routine to deliver training patterns.
              </p>
              <div className="space-y-4 mb-6">
                <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl p-4 flex items-start gap-3 hover:border-pink-500 transition-all hover:translate-x-2">
                  <Dumbbell className="text-pink-400 mt-1 flex-shrink-0" size={20} />
                  <p className="text-white text-sm">Creates personalized workout plans based on your goals and fitness level</p>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl p-4 flex items-start gap-3 hover:border-pink-500 transition-all hover:translate-x-2">
                  <Dumbbell className="text-pink-400 mt-1 flex-shrink-0" size={20} />
                  <p className="text-white text-sm">Works for home workouts or gym routines</p>
                </div>
              </div>
              <button 
                onClick={() => nav("/register")}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-pink-500/50 transition-all flex items-center gap-2 group hover:scale-105">
                Follow My Program
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-pink-500/20 rounded-2xl blur-3xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-pink-500/20">
                <img src={workoutImg} alt="Person working out" className="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </section>

        {/* Customized Meals Section */}
        <section id="nutrition" className="relative px-6 py-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-3xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-cyan-500/20">
                <img src={nutritionImg} alt="Healthy food" className="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/50">
                <Apple className="text-white" size={26} />
              </div>
              <h2 className="text-4xl font-bold text-cyan-400 mb-4 text-glow">
                Customized Meals for Better Results
              </h2>
              <p className="text-white/90 mb-6 text-lg leading-relaxed">
                Receive daily food recommendations crafted according to your body metrics and nutritional needs.
              </p>
              <div className="space-y-4 mb-6">
                <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl p-4 flex items-start gap-3 hover:border-cyan-500 transition-all hover:translate-x-2">
                  <Apple className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
                  <p className="text-white text-sm">Provides daily meal suggestions tailored to your body metrics</p>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl p-4 flex items-start gap-3 hover:border-cyan-500 transition-all hover:translate-x-2">
                  <Apple className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
                  <p className="text-white text-sm">Helps balance calories, proteins, carbs, and fats</p>
                </div>
              </div>
              <button 
                onClick={() => nav("/register")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-cyan-500/50 transition-all flex items-center gap-2 group hover:scale-105">
                Follow My Plan
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* Build Healthy Habits Section */}
        <section className="relative px-6 py-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-purple-500/50">
                <Heart className="text-white" size={26} />
              </div>
              <h2 className="text-4xl font-bold text-purple-400 mb-4 text-glow">
                Build Healthy Habits with Smart Daily Routines
              </h2>
              <p className="text-white/90 mb-6 text-lg leading-relaxed">
                BetterYou uses your lifestyle and habits and provides dynamic, trackable routines to improve your daily flexibility.
              </p>
              <div className="space-y-4 mb-6">
                <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl p-4 flex items-start gap-3 hover:border-purple-500 transition-all hover:translate-x-2">
                  <Heart className="text-purple-400 mt-1 flex-shrink-0" size={20} />
                  <p className="text-white text-sm">Creates simple daily routines to improve your lifestyle</p>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl p-4 flex items-start gap-3 hover:border-purple-500 transition-all hover:translate-x-2">
                  <Heart className="text-purple-400 mt-1 flex-shrink-0" size={20} />
                  <p className="text-white text-sm">Analyzes your behavior to offer tailored suggestions</p>
                </div>
              </div>
              <button 
                onClick={() => nav("/register")}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all flex items-center gap-2 group hover:scale-105">
                See My Routine
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-3xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-500/20">
                <img src={habitsImg} alt="Person exercising" className="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </section>

        {/* AI Coaching Section */}
        <section id="coaching" className="relative px-6 py-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-green-500/20 rounded-2xl blur-3xl"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-green-500/20">
                <img src={iaImg} alt="AI Assistant" className="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/50">
                <MessageSquare className="text-white" size={26} />
              </div>
              <h2 className="text-4xl font-bold text-green-400 mb-4 text-glow">
                Your Intelligent Companion for Everyday Coaching
              </h2>
              <p className="text-white/90 mb-6 text-lg leading-relaxed">
                Ask anything, anytime. Your AI coach provides personalized advice, instant recommendations, and motivation.
              </p>
              <div className="space-y-4 mb-6">
                <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl p-4 flex items-start gap-3 hover:border-green-500 transition-all hover:translate-x-2">
                  <MessageSquare className="text-green-400 mt-1 flex-shrink-0" size={20} />
                  <p className="text-white text-sm">Answers your questions instantly with AI-powered advice</p>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-xl p-4 flex items-start gap-3 hover:border-green-500 transition-all hover:translate-x-2">
                  <MessageSquare className="text-green-400 mt-1 flex-shrink-0" size={20} />
                  <p className="text-white text-sm">Gives personalized recommendations for training, nutrition, and lifestyle</p>
                </div>
              </div>
              <button 
                onClick={() => nav("/register")}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-green-500/50 transition-all flex items-center gap-2 group hover:scale-105">
                Ask My Assistant
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative px-6 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="text-[#D6F93D]">BetterYou</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We combine cutting-edge AI technology with proven fitness science to deliver results that matter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-gray-900/40 backdrop-blur-sm border border-[#D6F93D]/20 rounded-2xl hover:border-[#D6F93D]/50 transition-all">
              <div className="w-16 h-16 bg-[#D6F93D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-[#D6F93D]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Personalized</h3>
              <p className="text-gray-400 leading-relaxed">Every plan is uniquely tailored to your body, goals, and lifestyle. No generic templates.</p>
            </div>

            <div className="text-center p-8 bg-gray-900/40 backdrop-blur-sm border border-[#D6F93D]/20 rounded-2xl hover:border-[#D6F93D]/50 transition-all">
              <div className="w-16 h-16 bg-[#D6F93D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-[#D6F93D]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">AI-Powered</h3>
              <p className="text-gray-400 leading-relaxed">Advanced AI learns from your progress and adapts your plans in real-time for maximum results.</p>
            </div>

            <div className="text-center p-8 bg-gray-900/40 backdrop-blur-sm border border-[#D6F93D]/20 rounded-2xl hover:border-[#D6F93D]/50 transition-all">
              <div className="w-16 h-16 bg-[#D6F93D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-[#D6F93D]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Proven Results</h3>
              <p className="text-gray-400 leading-relaxed">Join 10,000+ users who've achieved their fitness goals with science-backed methods.</p>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-gradient-to-b from-[#1a1625] to-[#0B0B12]">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="relative p-12 bg-gradient-to-br from-lime-400/10 to-purple-500/10 border border-lime-400/20 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Transform Your Life?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of users who've already achieved their health and fitness goals with BetterYou.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => nav('/register')}
                    className="px-8 py-4 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-lime-400/30 flex items-center justify-center gap-2"
                  >
                    Start Now
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => nav('/login')}
                    className="px-8 py-4 bg-transparent border-2 border-gray-700 hover:border-lime-400 text-white font-semibold rounded-full transition-all"
                  >
                    Already have an account?
                  </button>
                </div>
                <p className="text-gray-500 text-sm mt-6">
                  ✓ No credit card required  •  ✓ Free plan available  •  ✓ Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative bg-black/50 backdrop-blur-sm border-t border-[#D6F93D]/20 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <img src={logo} alt="BetterYou" className="h-10 w-auto" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI-powered personal coaching for nutrition and fitness. Transform your health, one day at a time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-[#D6F93D] transition-colors">Features</a></li>
                <li><a href="#workouts" className="text-gray-400 hover:text-[#D6F93D] transition-colors">Workouts</a></li>
                <li><a href="#nutrition" className="text-gray-400 hover:text-[#D6F93D] transition-colors">Nutrition</a></li>
                <li><a href="#coaching" className="text-gray-400 hover:text-[#D6F93D] transition-colors">AI Coach</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="text-gray-400 hover:text-[#D6F93D] transition-colors">About Us</a></li>
                <li><button onClick={() => nav('/team')} className="text-gray-400 hover:text-[#D6F93D] transition-colors">Team</button></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D6F93D] transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D6F93D] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-[#D6F93D] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D6F93D] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D6F93D] transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#D6F93D] transition-colors">Data Protection</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2025 BetterYou. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-[#D6F93D] transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D6F93D] transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D6F93D] transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D6F93D] transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}