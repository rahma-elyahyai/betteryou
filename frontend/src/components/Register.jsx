// src/components/Register.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../Api/authApi';
import { AuthContext } from '../context/AuthContext';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 1 fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');

    // Step 2 fields
    const [heightCm, setHeightCm] = useState('');
    const [initialWeightKg, setInitialWeightKg] = useState('');
    const [targetWeightKg, setTargetWeightKg] = useState('');
    const [goal, setGoal] = useState('');
    const [fitnessLevel, setFitnessLevel] = useState('');
    const [activityLevel, setActivityLevel] = useState('');

    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    const validateStep1 = () => {
        if (!firstName || !lastName || !email || !password || !birthDate || !gender) {
            setError('Veuillez remplir tous les champs');
            return false;
        }
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Veuillez entrer un email valide');
            return false;
        }
        setError('');
        return true;
    };

    const validateStep2 = () => {
        if (!heightCm || !initialWeightKg || !targetWeightKg || !goal || !fitnessLevel || !activityLevel) {
            setError('Veuillez remplir tous les champs');
            return false;
        }
        if (heightCm < 50 || heightCm > 300) {
            setError('La taille doit être entre 50 et 300 cm');
            return false;
        }
        if (initialWeightKg < 20 || initialWeightKg > 500) {
            setError('Le poids initial doit être entre 20 et 500 kg');
            return false;
        }
        if (targetWeightKg < 20 || targetWeightKg > 500) {
            setError('Le poids cible doit être entre 20 et 500 kg');
            return false;
        }
        setError('');
        return true;
    };

    const handleNext = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;

        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            setError('');
        }
    };

    const handleSubmit = async () => {
        // Préparer les données pour l'API backend
        const userData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            birthDate: birthDate, // Format: "YYYY-MM-DD"
            gender: gender, // "MALE" ou "FEMALE"
            heightCm: parseInt(heightCm),
            initialWeightKg: parseFloat(initialWeightKg),
            targetWeightKg: parseFloat(targetWeightKg),
            goal: goal,
            fitnessLevel: fitnessLevel,
            activityLevel: activityLevel
        };

        console.log('📤 Envoi des données d\'inscription:', userData);
        setLoading(true);
        setError('');

        try {
            // Appel API via authApi.js
            const response = await registerApi(userData);

            console.log('✅ Inscription réussie:', response.data);

            // Si le backend retourne un token directement
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
                setIsAuthenticated(true);
            }

            // Message de succès
            alert(`🎉 Inscription réussie!\nBienvenue ${firstName}!`);

            // Rediriger vers la page de login ou dashboard
            navigate('/login');

        } catch (err) {
            console.error('❌ Erreur lors de l\'inscription:', err);

            // Gestion des erreurs
            if (err.response) {
                // Le serveur a répondu avec un code d'erreur
                console.error('Réponse d\'erreur du serveur:', err.response.data);

                const errorData = err.response.data;
                let errorMessage = 'Erreur lors de l\'inscription';

                // Différents types de messages d'erreur du backend
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (errorData.email) {
                    errorMessage = errorData.email;
                } else if (errorData.errors) {
                    // Si c'est un objet d'erreurs de validation
                    errorMessage = Object.values(errorData.errors).join(', ');
                }

                setError(errorMessage);
                alert(`❌ Erreur: ${errorMessage}`);

                // Retourner à l'étape appropriée selon l'erreur
                if (err.response.status === 400) {
                    if (errorMessage.toLowerCase().includes('email') ||
                        errorMessage.toLowerCase().includes('password') ||
                        errorMessage.toLowerCase().includes('gender')) {
                        setStep(1);
                    } else if (errorMessage.toLowerCase().includes('height') ||
                        errorMessage.toLowerCase().includes('weight') ||
                        errorMessage.toLowerCase().includes('goal')) {
                        setStep(2);
                    }
                } else if (err.response.status === 409) {
                    // Email déjà utilisé
                    setError('Cet email est déjà utilisé');
                    alert('❌ Cet email est déjà utilisé');
                    setStep(1);
                }
            } else if (err.request) {
                // La requête a été faite mais pas de réponse
                console.error('Pas de réponse du serveur:', err.request);
                setError('Impossible de contacter le serveur. Vérifiez que le backend est démarré sur http://localhost:3031');
                alert('❌ Impossible de contacter le serveur.\n\nVérifiez que votre backend Spring Boot est démarré sur le port 3031.');
            } else {
                // Autre erreur
                console.error('Erreur:', err.message);
                setError('Une erreur est survenue: ' + err.message);
                alert('❌ Une erreur est survenue: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <h1 className="register-title">BETTER YOU</h1>

                <div className="progress-container">
                    <p className="progress-text">{progress.toFixed(0)}%</p>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div className="navigation-icons">
                    <div className="nav-icon-item">
                        <div className={`nav-icon-circle ${step >= 1 ? 'active' : 'inactive'}`}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <p className="nav-icon-label">Profile</p>
                    </div>

                    <div className="nav-icon-item">
                        <div className={`nav-icon-circle ${step >= 2 ? 'active' : 'inactive'}`}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="nav-icon-label">Objective</p>
                    </div>

                    <div className="nav-icon-item">
                        <div className={`nav-icon-circle ${step >= 3 ? 'active' : 'inactive'}`}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <p className="nav-icon-label">Physique</p>
                    </div>

                    <div className="nav-icon-item">
                        <div className={`nav-icon-circle ${step >= 4 ? 'active' : 'inactive'}`}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="nav-icon-label">Summary</p>
                    </div>
                </div>

                <div className="register-card">
                    {/* Message d'erreur global */}
                    {error && (
                        <div style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            fontSize: '14px',
                            textAlign: 'center'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <h2 className="step-title">Who are YOU ?</h2>

                            <div className="form-row">
                                <div>
                                    <label className="form-label">First name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your first name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="form-input"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Last name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="form-input"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Birth date</label>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Gender</label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="FEMALE"
                                            checked={gender === 'FEMALE'}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="radio-input"
                                            disabled={loading}
                                        />
                                        Female
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="MALE"
                                            checked={gender === 'MALE'}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="radio-input"
                                            disabled={loading}
                                        />
                                        Male
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="step-title">Your Objective</h2>

                            <div className="form-group">
                                <label className="form-label">Height (cm)</label>
                                <input
                                    type="number"
                                    placeholder="Enter your height in cm"
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                    className="form-input"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-row">
                                <div>
                                    <label className="form-label">Initial Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="Current weight"
                                        value={initialWeightKg}
                                        onChange={(e) => setInitialWeightKg(e.target.value)}
                                        className="form-input"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Target Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="Goal weight"
                                        value={targetWeightKg}
                                        onChange={(e) => setTargetWeightKg(e.target.value)}
                                        className="form-input"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Goal</label>
                                <select
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    className="form-select"
                                    disabled={loading}
                                >
                                    <option value="">Select your goal</option>
                                    <option value="LOSE_WEIGHT">Lose Weight</option>
                                    <option value="GAIN_MASS">Gain Muscle</option>
                                    <option value="MAINTAIN">Maintain Weight</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Fitness Level</label>
                                <select
                                    value={fitnessLevel}
                                    onChange={(e) => setFitnessLevel(e.target.value)}
                                    className="form-select"
                                    disabled={loading}
                                >
                                    <option value="">Select fitness level</option>
                                    <option value="BEGINNER">Beginner</option>
                                    <option value="INTERMEDIATE">Intermediate</option>
                                    <option value="ADVANCED">Advanced</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Activity Level</label>
                                <select
                                    value={activityLevel}
                                    onChange={(e) => setActivityLevel(e.target.value)}
                                    className="form-select"
                                    disabled={loading}
                                >
                                    <option value="">Select activity level</option>
                                    <option value="SEDENTARY">Sedentary (little or no exercise)</option>
                                    <option value="MODERATE">Moderately Active (3-5 days/week)</option>
                                    <option value="ACTIVE">Active </option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className="step-title">Physical Assessment</h2>
                            <div className="summary-section">
                                <p className="summary-description">Let's assess your current physical condition</p>
                                <div className="info-card">
                                    <p className="info-title">Body Mass Index (BMI)</p>
                                    <p className="info-value">
                                        {heightCm && initialWeightKg
                                            ? ((initialWeightKg / Math.pow(heightCm / 100, 2)).toFixed(1))
                                            : '--'}
                                    </p>
                                </div>
                                <div className="info-card">
                                    <p className="info-title">Weight to Lose/Gain</p>
                                    <p className="info-value">
                                        {initialWeightKg && targetWeightKg
                                            ? `${Math.abs(targetWeightKg - initialWeightKg).toFixed(1)} kg`
                                            : '--'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h2 className="step-title">Registration Summary</h2>
                            <div className="summary-grid">
                                <div className="summary-card">
                                    <p className="summary-card-title">Personal Info</p>
                                    <p className="summary-card-value">{firstName} {lastName}</p>
                                    <p className="summary-card-detail">{email}</p>
                                    <p className="summary-card-detail">{birthDate} • {gender}</p>
                                </div>
                                <div className="summary-card">
                                    <p className="summary-card-title">Physical Stats</p>
                                    <p className="summary-card-value">Height: {heightCm} cm</p>
                                    <p className="summary-card-detail">Weight: {initialWeightKg} kg → {targetWeightKg} kg</p>
                                </div>
                                <div className="summary-card">
                                    <p className="summary-card-title">Fitness Profile</p>
                                    <p className="summary-card-value">Goal: {goal}</p>
                                    <p className="summary-card-detail">Level: {fitnessLevel}</p>
                                    <p className="summary-card-detail">Activity: {activityLevel}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="button-group">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="btn btn-back"
                                disabled={loading}
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="btn btn-next"
                            disabled={loading}
                            style={{
                                opacity: loading ? 0.6 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? '⏳ Chargement...' : (step === totalSteps ? 'Complete Registration' : 'Next →')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;