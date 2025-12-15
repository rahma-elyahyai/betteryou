// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const handleStartNow = () => {
        // À configurer plus tard selon vos besoins
        window.location.href = '/register';
    };

    return (
        <div className="home-container">
            {/* Header avec LOGIN/SIGN UP en haut à DROITE */}
            <header className="home-header">
                <div className="home-auth-buttons">
                    <Link to="/login" className="auth-btn auth-btn-login">
                        LOGIN
                    </Link>
                    <Link to="/register" className="auth-btn auth-btn-signup">
                        SIGN UP
                    </Link>
                </div>
            </header>

            {/* Contenu principal centré */}
            <main className="home-main-content">
                <div className="home-hero">
                    <h1 className="home-title">
                        Transform your body with a smart,
                        <span className="highlighted-line">fully personalized AI Coach.</span>
                    </h1>

                    <p className="home-description">
                        BetterYou is your all-in-one wellness partner — custom workouts,
                        tailored meal plans, nutritious recipes, progress tracking,
                        and daily guidance designed just for you.
                    </p>
                </div>
            </main>

            {/* Bouton Start now en bas, centré */}
            <footer className="home-footer">
                <button
                    onClick={handleStartNow}
                    className="home-start-button"
                >
                    Start now
                </button>
            </footer>
        </div>
    );
};

export default Home;