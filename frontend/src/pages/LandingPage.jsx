import React from 'react';
import { Dumbbell, Apple, Heart, MessageSquare } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const nav = useNavigate();
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,249,61,0.10),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(214,249,61,0.10),transparent_40%)]" />
      <div className="absolute inset-0 opacity-20 bg-[url('/src/assets/noise.png')] bg-repeat" />
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

      {/* Header */}
      <header className="relative flex justify-end items-center p-6 gap-4 animate-slide-in">
        <button 
          onClick={() => nav("/login")}
          className="px-6 py-2.5 bg-[#D6F93D] text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#D6F93D]/40">
          LOGIN
        </button>
        <button 
          onClick={() => nav("/register")}
          className="px-6 py-2.5 bg-[#D6F93D] text-gray-900 font-bold rounded-lg btn-glow relative z-10">
          SIGN UP
        </button>
      </header>

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
      <section className="relative px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="text-[#D6F93D] shine-effect">Unlock Your Full Potential</span>
          <span className="text-white"> with BetterYou AI</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-pink-500 rounded-xl p-6 card-hover border-glow hover:border-pink-400">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-pink-500/50">
              <Dumbbell className="text-white" size={26} />
            </div>
            <h3 className="text-pink-400 font-bold text-xl mb-2">
              Training & Workout personalized plans with AI
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Let the AI design you tailored workout programs based on your goals and fitness level. Adapt your program anytime with the help of AI that tracks your progress!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-cyan-500 rounded-xl p-6 card-hover border-glow hover:border-cyan-400">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/50">
              <Apple className="text-white" size={26} />
            </div>
            <h3 className="text-cyan-400 font-bold text-xl mb-2">
              Smart Nutrition & Meal Guidance
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Get balanced meals ideas, customized for your dietary needs and goals. Our AI-powered nutritionist aligned meal plans to help you achieve your fitness goals!
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-purple-500 rounded-xl p-6 card-hover border-glow hover:border-purple-400">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
              <Heart className="text-white" size={26} />
            </div>
            <h3 className="text-purple-400 font-bold text-xl mb-2">
              Build healthier habits with smart daily routines
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              BetterYou analyzes your lifestyle and creates routines to customize trackable monitor to fit towards your goals, track behavior and adapt of routines.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-green-500 rounded-xl p-6 card-hover border-glow hover:border-green-400">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
              <MessageSquare className="text-white" size={26} />
            </div>
            <h3 className="text-green-400 font-bold text-xl mb-2">
              Personalized advice and Daily coaching
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Get instant answers and recommendations, insights, powered by AI. Real-world feedback, your smart health coach is always nearby!
            </p>
          </div>
        </div>
      </section>

      {/* AI-Powered Workouts Section */}
      <section className="relative px-6 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6 shadow-xl shadow-pink-500/50">
              <Dumbbell className="text-white" size={26} />
            </div>
            <h2 className="text-4xl font-bold text-pink-400 mb-4 text-glow">
              AI-Powered Personalized Workouts
            </h2>
            <p className="text-white/90 mb-6 text-lg leading-relaxed">
              Let our intelligent coach analyze your goals, fitness level, and daily routine to deliver training patterns.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-indigo-900/50 backdrop-blur-sm border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3 hover:border-pink-500 transition-all hover:translate-x-2">
                <Dumbbell className="text-pink-400 mt-1" size={20} />
                <p className="text-white text-sm">
                  Creates personalized workout plans based on your goals and fitness level
                </p>
              </div>
              
              <div className="bg-indigo-900/50 backdrop-blur-sm border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3 hover:border-pink-500 transition-all hover:translate-x-2">
                <Dumbbell className="text-pink-400 mt-1" size={20} />
                <p className="text-white text-sm">
                  Works for home workouts or gym routines
                </p>
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
            <div className="absolute inset-0 bg-pink-500/20 rounded-lg blur-2xl"></div>
            <img 
              src="/src/assets/workout-image.png"
              alt="Person working out"
              className="relative rounded-lg shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Customized Meals Section */}
      <section className="relative px-6 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-2xl"></div>
            <img 
              src="/src/assets/nutrition-image.png" 
              alt="Healthy food"
              className="relative rounded-lg shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="order-1 md:order-2">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/50">
              <Apple className="text-white" size={26} />
            </div>
            <h2 className="text-4xl font-bold text-cyan-400 mb-4 text-glow">
              Customized Meals for Better Results
            </h2>
            <p className="text-white/90 mb-6 text-lg leading-relaxed">
              Receive daily food recommendations crafted according to your body metrics and nutritional needs.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-indigo-900/50 backdrop-blur-sm border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3 hover:border-cyan-500 transition-all hover:translate-x-2">
                <Apple className="text-cyan-400 mt-1" size={20} />
                <p className="text-white text-sm">
                  Provides daily meal suggestions tailored to your body metrics
                </p>
              </div>
              
              <div className="bg-indigo-900/50 backdrop-blur-sm border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3 hover:border-cyan-500 transition-all hover:translate-x-2">
                <Apple className="text-cyan-400 mt-1" size={20} />
                <p className="text-white text-sm">
                  Helps balance calories, proteins, carbs, and fats
                </p>
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
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6 shadow-xl shadow-purple-500/50">
              <Heart className="text-white" size={26} />
            </div>
            <h2 className="text-4xl font-bold text-purple-400 mb-4 text-glow">
              Build Healthy Habits with Smart Daily Routines
            </h2>
            <p className="text-white/90 mb-6 text-lg leading-relaxed">
              BetterYou uses your lifestyle and habits and provides dynamic, trackable routines to improve your daily flexibility, awareness, and lasting habits.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-indigo-900/50 backdrop-blur-sm border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3 hover:border-purple-500 transition-all hover:translate-x-2">
                <Heart className="text-purple-400 mt-1" size={20} />
                <p className="text-white text-sm">
                  Creates simple daily routines to improve your lifestyle
                </p>
              </div>
              
              <div className="bg-indigo-900/50 backdrop-blur-sm border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3 hover:border-purple-500 transition-all hover:translate-x-2">
                <Heart className="text-purple-400 mt-1" size={20} />
                <p className="text-white text-sm">
                  Analyzes your behavior to offer tailored suggestions
                </p>
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
            <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-2xl"></div>
            <img 
              src="/src/assets/habits-image.png" 
              alt="Person exercising"
              className="relative rounded-lg shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* AI Coaching Section */}
      <section className="relative px-6 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <div className="absolute inset-0 bg-green-500/20 rounded-lg blur-2xl"></div>
            <img 
              src="/src/assets/ia-image.png" 
              alt="AI Assistant"
              className="relative rounded-lg shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="order-1 md:order-2">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-lg flex items-center justify-center mb-6 shadow-xl shadow-green-500/50">
              <MessageSquare className="text-white" size={26} />
            </div>
            <h2 className="text-4xl font-bold text-green-400 mb-4 text-glow">
              Your Intelligent Companion for Everyday Coaching
            </h2>
            <p className="text-white/90 mb-6 text-lg leading-relaxed">
              Ask anything, anytime. Your AI coach provides personalized advice, instant recommendations, and motivation based on your progress.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-indigo-900/50 backdrop-blur-sm border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3 hover:border-green-500 transition-all hover:translate-x-2">
                <MessageSquare className="text-green-400 mt-1" size={20} />
                <p className="text-white text-sm">
                  Answers your questions instantly with AI-powered advice
                </p>
              </div>
              
              <div className="bg-indigo-900/50 backdrop-blur-sm border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3 hover:border-green-500 transition-all hover:translate-x-2">
                <MessageSquare className="text-green-400 mt-1" size={20} />
                <p className="text-white text-sm">
                  Gives personalized recommendations for training, nutrition, and lifestyle
                </p>
              </div>
            </div>

            <button 
              onClick={() => nav("/register")}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-green-500/50 transition-all flex items-center gap-2 group hover:scale-105">
              Ask My assistant
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative text-center py-12 px-6">
        <p className="text-white/70 text-sm">
          © 2024 BetterYou. All rights reserved.
        </p>
      </footer>
    </div>
  );
}