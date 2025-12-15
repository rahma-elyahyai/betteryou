// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import NotFoundPage from './components/NotFoundPage';
import './App.css';

// Home page component with responsive design
// const HomePage = () => (
//     <div className="home-container">
//         <div className="home-content">
//             <div className="home-hero">
//                 <h1 className="home-title">BETTER YOU</h1>
//                 <p className="home-subtitle">Transform Your Life, One Day at a Time</p>
//                 <p className="home-description">
//                     Join thousands of people achieving their fitness and wellness goals.
//                     Start your journey to a healthier, stronger, better you today.
//                 </p>
//             </div>
//
//             <div className="home-buttons">
//                 <Link to="/register" className="btn-primary">
//                     Get Started
//                 </Link>
//                 <Link to="/login" className="btn-secondary">
//                     Sign In
//                 </Link>
//             </div>
//
//             <div className="home-features">
//                 <div className="feature-card">
//                     <div className="feature-icon">🎯</div>
//                     <h3 className="feature-title">Set Goals</h3>
//                     <p className="feature-text">Define and track your fitness objectives</p>
//                 </div>
//                 <div className="feature-card">
//                     <div className="feature-icon">💪</div>
//                     <h3 className="feature-title">Build Habits</h3>
//                     <p className="feature-text">Create sustainable healthy routines</p>
//                 </div>
//                 <div className="feature-card">
//                     <div className="feature-icon">📊</div>
//                     <h3 className="feature-title">Track Progress</h3>
//                     <p className="feature-text">Monitor your journey with detailed analytics</p>
//                 </div>
//             </div>
//         </div>
//     </div>
// );
//
// // 404 Not Found Page
// const NotFoundPage = () => (
//     <div className="error-container">
//         <div className="error-content">
//             <h1 className="error-title">404</h1>
//             <p className="error-subtitle">Page Not Found</p>
//             <p className="error-description">
//                 The page you're looking for doesn't exist or has been moved.
//             </p>
//             <Link to="/" className="btn-primary">
//                 Go Home
//             </Link>
//         </div>
//     </div>
// );

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default App;