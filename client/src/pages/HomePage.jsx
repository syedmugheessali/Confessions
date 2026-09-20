import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1 className="hero-title">Confessions</h1>
        <p className="hero-subtitle">Say what you've never said before.</p>
        <p className="hero-desc">
          Share your secrets, thoughts, and confessions completely anonymously. 
          They vanish forever when time runs out.
        </p>
        <div className="hero-actions">
          <Link to="/confessions" className="btn-primary">Browse Confessions</Link>
          {isAuthenticated ? (
            <Link to="/confessions/create" className="btn-secondary">Create Confession</Link>
          ) : (
            <Link to="/login" className="btn-secondary">Login to Create</Link>
          )}
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🎭</div>
          <h3>Anonymous</h3>
          <p>Your identity is fully protected. No one will ever know it's you.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⏳</div>
          <h3>Temporary</h3>
          <p>Set a timer. Once it hits zero, your confession is gone forever.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure</h3>
          <p>End-to-end peace of mind. A safe space for your truest thoughts.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
