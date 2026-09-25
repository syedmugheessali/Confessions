import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1 className="hero-title">Confessions</h1>
        <p className="hero-subtitle">
          Post confessions anonymously that you're too afraid to admit publicly.
        </p>
        <p className="hero-desc">
          Share your secret without getting known. Every post is completely anonymous and automatically disappears when the timer expires.
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
    </div>
  );
};

export default HomePage;
