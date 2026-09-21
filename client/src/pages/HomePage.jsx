import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1 className="hero-title">Confessions</h1>
        <p className="hero-subtitle">Anonymous messages with automatic expiration.</p>
        <p className="hero-desc">
          Share thoughts anonymously. Each post is automatically deleted once its duration expires.
        </p>
        <div className="hero-actions">
          <Link to="/confessions" className="btn-primary">Browse confessions</Link>
          {isAuthenticated ? (
            <Link to="/confessions/create" className="btn-secondary">Write confession</Link>
          ) : (
            <Link to="/login" className="btn-secondary">Sign in to write</Link>
          )}
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>Anonymous</h3>
          <p>No usernames or profile links are attached to public confessions.</p>
        </div>
        <div className="feature-card">
          <h3>Self-expiring</h3>
          <p>Choose an expiration window between 1 hour and 7 days. Posts are removed automatically.</p>
        </div>
        <div className="feature-card">
          <h3>Simple</h3>
          <p>No feeds, algorithms, or engagement metrics. Just plain text notes that disappear.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
