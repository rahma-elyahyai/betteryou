// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import './Login.css';
import { loginApi } from '../Api/authApi';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { setIsAuthenticated } = useContext(AuthContext);

    const handleSubmit = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await loginApi({ email, password });

            // 🔐 Stocker le token JWT
            localStorage.setItem('token', response.data.token);

            // 🔄 Mettre à jour le contexte global
            setIsAuthenticated(true);

            // (plus tard) redirection vers dashboard
            console.log('Login success');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        alert('Redirect to password reset page');
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <h1 className="login-title">BETTER YOU</h1>
                <p className="login-subtitle">
                    Log in to access your BetterYou account
                </p>

                <div className="login-card">
                    {error && <p className="error-message">{error}</p>}

                    <div className="input-group">
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            autoComplete="email"
                        />
                    </div>

                    <div className="input-group">
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            autoComplete="current-password"
                        />
                    </div>

                    <p className="password-hint">
                        It must be a combination of password, letters, numbers, and symbols.
                    </p>

                    <div className="forgot-password-container">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="forgot-password-link"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
