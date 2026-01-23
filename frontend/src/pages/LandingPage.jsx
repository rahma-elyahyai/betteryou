import React, { useState } from 'react';
import { Dumbbell, Apple, Heart, MessageSquare, Check, Star, ArrowRight, Mail, Instagram, Twitter, Facebook, Youtube, Shield, Award, Users, TrendingUp, ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [email, setEmail] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  const testimonials = [
    {
      name: "Sarah Martinez",
      role: "Fitness Enthusiast",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      rating: 5,
      text: "BetterYou transformed my fitness journey! The AI coach understands my needs perfectly and adapts my workouts every week."
    },
    {
      name: "Michael Chen",
      role: "Busy Professional",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      rating: 5,
      text: "Finally, a fitness app that fits my hectic schedule. The meal plans are realistic and delicious!"
    },
    {
      name: "Emma Thompson",
      role: "Health Coach",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      rating: 5,
      text: "I recommend BetterYou to all my clients. The personalization level is incredible and results speak for themselves."
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      features: [
        "Basic workout plans",
        "3 meal suggestions per week",
        "Progress tracking",
        "Community access"
      ],
      notIncluded: [
        "AI personalization",
        "Unlimited meal plans",
        "Priority support"
      ],
      popular: false,
      cta: "Get Started"
    },
    {
      name: "Premium",
      price: "19",
      period: "per month",
      features: [
        "Full AI personalization",
        "Unlimited custom workouts",
        "Daily meal plans & recipes",
        "Advanced analytics",
        "Priority support",
        "Habit tracking",
        "1-on-1 coaching sessions"
      ],
      notIncluded: [],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Elite",
      price: "49",
      period: "per month",
      features: [
        "Everything in Premium",
        "Weekly video consultations",
        "Custom supplement plans",
        "Injury prevention programs",
        "Exclusive community",
        "Early access to features"
      ],
      notIncluded: [],
      popular: false,
      cta: "Contact Us"
    }
  ];

  const faqs = [
    {
      question: "How does the AI personalization work?",
      answer: "Our AI analyzes your goals, fitness level, dietary preferences, and daily routine to create fully customized workout and nutrition plans. It continuously learns from your progress and adapts recommendations in real-time."
    },
    {
      question: "Can I use BetterYou without gym equipment?",
      answer: "Absolutely! BetterYou creates workout plans for both home and gym environments. You can specify your available equipment, and the AI will design effective workouts accordingly."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! Premium users get a 14-day free trial with full access to all features. No credit card required to start."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. No questions asked, no hidden fees."
    },
    {
      question: "Does BetterYou work with dietary restrictions?",
      answer: "Yes! Our AI supports all dietary preferences including vegan, vegetarian, keto, paleo, gluten-free, and more. You can also exclude specific ingredients."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "2M+", label: "Workouts Completed", icon: Dumbbell },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
    { number: "4.9/5", label: "User Rating", icon: Star }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,249,61,0.10),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(214,249,61,0.10),transparent_40%)]" />
      
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

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-slide-in { animation: slideIn 0.8s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        
        .shine-effect {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
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
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Header */}
      <header className="relative flex justify-between items-center p-6 animate-slide-in">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#D6F93D] rounded-lg flex items-center justify-center">
            <Dumbbell className="text-gray-900" size={24} />
          </div>
          <span className="text-2xl font-bold text-white">BetterYou</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-white/80 hover:text-[#D6F93D] transition-colors">Features</a>
          <a href="#pricing" className="text-white/80 hover:text-[#D6F93D] transition-colors">Pricing</a>
          <a href="#testimonials" className="text-white/80 hover:text-[#D6F93D] transition-colors">Testimonials</a>
          <a href="#faq" className="text-white/80 hover:text-[#D6F93D] transition-colors">FAQ</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={handleLogin} className="px-6 py-2.5 bg-transparent border-2 border-[#D6F93D] text-[#D6F93D] font-bold rounded-lg hover:bg-[#D6F93D] hover:text-gray-900 transition-all duration-300">
            LOGIN
          </button>
          <button onClick={handleSignUp} className="px-6 py-2.5 bg-[#D6F93D] text-gray-900 font-bold rounded-lg btn-glow relative z-10">
            SIGN UP
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden relative bg-gray-900/95 backdrop-blur-lg p-6 animate-slide-in">
          <nav className="flex flex-col gap-4">
            <a href="#features" className="text-white hover:text-[#D6F93D] transition-colors py-2">Features</a>
            <a href="#pricing" className="text-white hover:text-[#D6F93D] transition-colors py-2">Pricing</a>
            <a href="#testimonials" className="text-white hover:text-[#D6F93D] transition-colors py-2">Testimonials</a>
            <a href="#faq" className="text-white hover:text-[#D6F93D] transition-colors py-2">FAQ</a>
            <button onClick={handleLogin} className="px-6 py-2.5 bg-transparent border-2 border-[#D6F93D] text-[#D6F93D] font-bold rounded-lg mt-4">
              LOGIN
            </button>
            <button onClick={handleSignUp} className="px-6 py-2.5 bg-[#D6F93D] text-gray-900 font-bold rounded-lg">
              SIGN UP
            </button>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative text-center px-6 py-20 max-w-4xl mx-auto animate-slide-in">
        <div className="inline-block bg-purple-500/20 border border-purple-500/50 rounded-full px-4 py-2 mb-6">
          <span className="text-purple-300 text-sm font-semibold">🎉 New: AI Voice Coaching Now Available!</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Transform <span className="text-[#D6F93D] text-glow shine-effect">your body</span> with a smart,
          <br />
          fully personalized <span className="text-[#D6F93D] text-glow shine-effect">AI Coach.</span>
        </h1>
        <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          BetterYou is your all-in-one wellness partner — custom workouts, tailored meal plans,
          nutritious recipes, progress tracking, and daily guidance designed just for you
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onClick={handleSignUp} className="px-10 py-4 bg-[#D6F93D] text-gray-900 font-bold text-lg rounded-lg btn-glow hover:scale-105 transition-transform relative z-10">
            Start Free Trial
          </button>
          
        </div>
        <p className="text-white/60 text-sm mt-6">✨ No credit card required • 14-day free trial</p>
      </section>

      {/* Stats Section */}
      <section className="relative px-6 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:border-[#D6F93D]/50 transition-all">
                <Icon className="text-[#D6F93D] mx-auto mb-3" size={32} />
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="relative px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="text-[#D6F93D] shine-effect">Unlock Your Full Potential</span>
        </h2>
        <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">
          Everything you need to achieve your fitness goals in one intelligent platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-pink-500 rounded-xl p-6 card-hover hover:border-pink-400">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-pink-500/50">
              <Dumbbell className="text-white" size={26} />
            </div>
            <h3 className="text-pink-400 font-bold text-xl mb-2">
              AI-Powered Workouts
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Personalized training programs that adapt to your progress and fitness level in real-time
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-cyan-500 rounded-xl p-6 card-hover hover:border-cyan-400">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/50">
              <Apple className="text-white" size={26} />
            </div>
            <h3 className="text-cyan-400 font-bold text-xl mb-2">
              Smart Nutrition Plans
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Custom meal plans and recipes tailored to your dietary needs and fitness goals
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-purple-500 rounded-xl p-6 card-hover hover:border-purple-400">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-purple-500/50">
              <Heart className="text-white" size={26} />
            </div>
            <h3 className="text-purple-400 font-bold text-xl mb-2">
              Habit Building System
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Track and build lasting healthy habits with intelligent reminders and insights
            </p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-green-500 rounded-xl p-6 card-hover hover:border-green-400">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
              <MessageSquare className="text-white" size={26} />
            </div>
            <h3 className="text-green-400 font-bold text-xl mb-2">
              24/7 AI Coaching
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Get instant answers and personalized advice from your intelligent fitness companion
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="text-white">How </span>
          <span className="text-[#D6F93D] shine-effect">BetterYou Works</span>
        </h2>
        <p className="text-white/70 text-center mb-12">Get started in just 3 simple steps</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-pink-500/50 mx-auto">
              <span className="text-white font-bold text-2xl">1</span>
            </div>
            <h3 className="text-white font-bold text-xl mb-3 text-center">Set Your Goals</h3>
            <p className="text-white/70 text-center">
              Tell us about your fitness level, goals, and preferences. Our AI analyzes your profile to create your perfect plan
            </p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-cyan-500/50 mx-auto">
              <span className="text-white font-bold text-2xl">2</span>
            </div>
            <h3 className="text-white font-bold text-xl mb-3 text-center">Follow Your Plan</h3>
            <p className="text-white/70 text-center">
              Get daily workouts and meal suggestions personalized just for you. Track your progress with ease
            </p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/50 mx-auto">
              <span className="text-white font-bold text-2xl">3</span>
            </div>
            <h3 className="text-white font-bold text-xl mb-3 text-center">See Results</h3>
            <p className="text-white/70 text-center">
              Watch your transformation unfold. Our AI adapts your plan as you progress to maximize results
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="text-white">What Our </span>
          <span className="text-[#D6F93D] shine-effect">Users Say</span>
        </h2>
        <p className="text-white/70 text-center mb-12">Join thousands of satisfied users transforming their lives</p>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 card-hover">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="text-white">Choose Your </span>
          <span className="text-[#D6F93D] shine-effect">Plan</span>
        </h2>
        <p className="text-white/70 text-center mb-12">Start free, upgrade when you're ready</p>

        <div className="grid md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-gray-900/80 backdrop-blur-sm rounded-xl p-8 card-hover relative ${
                plan.popular ? 'border-2 border-[#D6F93D] shadow-2xl shadow-[#D6F93D]/20' : 'border border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#D6F93D] text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <h3 className="text-white font-bold text-2xl mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-white/60 text-sm ml-2">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80 text-sm">
                    <Check className="text-green-400 flex-shrink-0 mt-0.5" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/40 text-sm line-through">
                    <X className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  plan.popular 
                    ? 'bg-[#D6F93D] text-gray-900 hover:scale-105 shadow-lg shadow-[#D6F93D]/30' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="text-white">Frequently Asked </span>
          <span className="text-[#D6F93D] shine-effect">Questions</span>
        </h2>
        <p className="text-white/70 text-center mb-12">Everything you need to know about BetterYou</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-[#D6F93D]/50 transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-6 flex justify-between items-center text-left"
              >
                <h3 className="text-white font-bold text-lg pr-4">{faq.question}</h3>
                <ChevronDown 
                  className={`text-[#D6F93D] flex-shrink-0 transition-transform ${
                    openFaq === index ? 'rotate-180' : ''
                  }`} 
                  size={24} 
                />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6">
                  <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-20 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 rounded-2xl p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Start Your <span className="text-[#D6F93D] text-glow">Transformation?</span>
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join over 50,000 users who are already achieving their fitness goals with BetterYou
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleSignUp} className="px-10 py-4 bg-[#D6F93D] text-gray-900 font-bold text-lg rounded-lg btn-glow hover:scale-105 transition-transform">
              Start Your Free Trial
            </button>
            <button onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 bg-white/10 text-white font-bold text-lg rounded-lg hover:bg-white/20 transition-all">
              View Pricing
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={16} />
              <span>Award Winning</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>50K+ Users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#D6F93D] rounded-lg flex items-center justify-center">
                  <Dumbbell className="text-gray-900" size={24} />
                </div>
                <span className="text-2xl font-bold text-white">BetterYou</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Your AI-powered wellness companion for achieving your fitness goals through personalized workouts, nutrition plans, and daily coaching.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors">
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors">
                  <Twitter size={24} />
                </a>
                <a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors">
                  <Youtube size={24} />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-white/60 hover:text-[#D6F93D] transition-colors text-sm">Features</a></li>
                <li><a href="#pricing" className="text-white/60 hover:text-[#D6F93D] transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors text-sm">Mobile App</a></li>
                <li><a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors text-sm">API Access</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors text-sm">Help Center</a></li>
                <li><a href="#faq" className="text-white/60 hover:text-[#D6F93D] transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors text-sm">Community</a></li>
                <li><a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors text-sm">Guides</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-bold mb-4">Stay Updated</h4>
              <p className="text-white/60 text-sm mb-4">
                Get the latest fitness tips and updates
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#D6F93D] transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-[#D6F93D] text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
                >
                  Subscribe
                  <Mail size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © 2024 BetterYou. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-[#D6F93D] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}