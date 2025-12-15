import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <div className="error-container">
        <div className="error-content">
            <h1 className="error-title">404</h1>
            <p className="error-subtitle">Page Not Found</p>
            <p className="error-description">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn-primary">
                Go Home
            </Link>
        </div>
    </div>
);

export default NotFoundPage;