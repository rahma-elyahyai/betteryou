import React from 'react';
import { Dumbbell, Apple, Heart, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-purple-500">
      {/* Header */}
      <header className="flex justify-end items-center p-6 gap-4">
        <button className="px-6 py-2 bg-[#D6F93D] text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition">
          LOGIN
        </button>
        <button className="px-6 py-2 bg-[#D6F93D] text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition">
          SIGN UP
        </button>
      </header>

      {/* Hero Section */}
      <section className="text-center px-6 py-20 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Transform <span className="text-[#D6F93D]">your body</span> with a smart,
          <br />
          fully personalized <span className="text-[#D6F93D]">AI Coach.</span>
        </h1>
        <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
          BetterYou is your all-in-one wellness partner — custom workouts, tailored meal plans,
          nutritious recipes, progress tracking,
          <br />
          and daily guidance designed just for you
        </p>
        <button className="px-8 py-3 bg-[#D6F93D] text-gray-900 font-bold text-lg rounded-lg hover:bg-yellow-300 transition">
          Start now
        </button>
      </section>

      {/* Features Overview */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="text-[#D6F93D]">Unlock Your Full Potential</span>
          <span className="text-white"> with BetterYou AI</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-gray-900 border-2 border-pink-500 rounded-xl p-6">
            <div className="bg-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Dumbbell className="text-white" size={24} />
            </div>
            <h3 className="text-pink-500 font-bold text-xl mb-2">
              Training & Workout personalized plans with AI
            </h3>
            <p className="text-gray-300 text-sm">
              Let the AI design you tailored workout programs based on your goals and fitness level. Adapt your program anytime with the help of AI that tracks your progress!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900 border-2 border-cyan-500 rounded-xl p-6">
            <div className="bg-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Apple className="text-white" size={24} />
            </div>
            <h3 className="text-cyan-500 font-bold text-xl mb-2">
              Smart Nutrition & Meal Guidance Healthinsured meal recommendations every day
            </h3>
            <p className="text-gray-300 text-sm">
              Get balanced meals ideas, customized for your dietary needs and goals. Our AI-powered nutritionist aligned meal plans to help you achieve your fitness goals, right now!
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900 border-2 border-purple-500 rounded-xl p-6">
            <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Heart className="text-white" size={24} />
            </div>
            <h3 className="text-purple-500 font-bold text-xl mb-2">
              Build healthier habits with smart daily routines
            </h3>
            <p className="text-gray-300 text-sm">
              BetterYou analyze your lifestyle and create routines to customize trackable monitor to fit towards your goals, track behavior and adapt of routines — day or day.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-900 border-2 border-green-500 rounded-xl p-6">
            <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="text-white" size={24} />
            </div>
            <h3 className="text-green-500 font-bold text-xl mb-2">
              GetterYou receives for you personalized advice, and Daily coaching
            </h3>
            <p className="text-gray-300 text-sm">
              With questions, get instant answers and recommendations, insights, powered by AI. Real-world feedback, your smart health coach is always nearby!
            </p>
          </div>
        </div>
      </section>

      {/* AI-Powered Workouts Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Dumbbell className="text-white" size={24} />
            </div>
            <h2 className="text-4xl font-bold text-pink-500 mb-4">
              AI-Powered Personalized Workouts
            </h2>
            <p className="text-white mb-6">
              Let our intelligent coach analyze your goals, fitness level, and daily routine to deliver training patterns.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-indigo-900 border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3">
                <Dumbbell className="text-pink-500 mt-1" size={20} />
                <p className="text-white text-sm">
                  Creates personalized workout plans based on your goals and fitness level
                </p>
              </div>
              
              <div className="bg-indigo-900 border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3">
                <Dumbbell className="text-pink-500 mt-1" size={20} />
                <p className="text-white text-sm">
                  Works for home workouts or gym routines
                </p>
              </div>
            </div>

            <button className="px-6 py-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600 transition flex items-center gap-2">
              Follow My Program
              <span>→</span>
            </button>
          </div>

          <div className="relative">
            <img 
              src="/src/assets/workout-image.png"
              alt="Person working out"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Customized Meals Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <img 
              src="/src/assets/nutrition-image.png" 
              alt="Healthy food"
              className="rounded-lg shadow-2xl"
            />
          </div>

          <div className="order-1 md:order-2">
            <div className="bg-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Apple className="text-white" size={24} />
            </div>
            <h2 className="text-4xl font-bold text-cyan-500 mb-4">
              Customized Meals for Better Results
            </h2>
            <p className="text-white mb-6">
              Receive daily food recommendations crafted according to your body metrics and nutritional needs.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-indigo-900 border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3">
                <Apple className="text-cyan-500 mt-1" size={20} />
                <p className="text-white text-sm">
                  Provides daily meal suggestions tailored to your body metrics
                </p>
              </div>
              
              <div className="bg-indigo-900 border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3">
                <Apple className="text-cyan-500 mt-1" size={20} />
                <p className="text-white text-sm">
                  Helps balance calories, proteins, carbs, and fats
                </p>
              </div>
            </div>

            <button className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition flex items-center gap-2">
              Follow My Plan
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Build Healthy Habits Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <Heart className="text-white" size={24} />
            </div>
            <h2 className="text-4xl font-bold text-purple-500 mb-4">
              Build Healthy Habits with Smart Daily Routines
            </h2>
            <p className="text-white mb-6">
              BetterYou uses your lifestyle and habits and provides dynamic, trackable routines to improve your daily flexibility, awareness, and lasting habits.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-indigo-900 border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3">
                <Heart className="text-purple-500 mt-1" size={20} />
                <p className="text-white text-sm">
                  Creates simple daily routines to improve your lifestyle
                </p>
              </div>
              
              <div className="bg-indigo-900 border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3">
                <Heart className="text-purple-500 mt-1" size={20} />
                <p className="text-white text-sm">
                  Analyzes your behavior to offer tailored suggestions
                </p>
              </div>
            </div>

            <button className="px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition flex items-center gap-2">
              See My Routine
              <span>→</span>
            </button>
          </div>

          <div className="relative">
            <img 
              src="/src/assets/habits-image.png" 
              alt="Person exercising"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* AI Coaching Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
            <img 
                src="/src/assets/ia-image.png" 
                alt="AI Assistant"
                className="rounded-lg shadow-2xl"
            />
            </div>

          <div className="order-1 md:order-2">
            <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
              <MessageSquare className="text-white" size={24} />
            </div>
            <h2 className="text-4xl font-bold text-green-500 mb-4">
              Your Intelligent Companion for Everyday Coaching
            </h2>
            <p className="text-white mb-6">
              Ask anything, anytime. Your AI coach provides personalized advice, instant recommendations, and motivation based on your progress.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-indigo-900 border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3">
                <MessageSquare className="text-green-500 mt-1" size={20} />
                <p className="text-white text-sm">
                  Answers your questions instantly with AI-powered advice
                </p>
              </div>
              
              <div className="bg-indigo-900 border-2 border-indigo-700 rounded-lg p-4 flex items-start gap-3">
                <MessageSquare className="text-green-500 mt-1" size={20} />
                <p className="text-white text-sm">
                  Gives personalized recommendations for training, nutrition, and lifestyle
                </p>
              </div>
            </div>

            <button className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition flex items-center gap-2">
              Ask My assistant
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 px-6">
        <p className="text-white text-sm">
          © 2024 BetterYou. All rights reserved.
        </p>
      </footer>
    </div>
  );
}