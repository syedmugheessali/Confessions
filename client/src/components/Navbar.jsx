import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, isModerator, role } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Confessions
        </Link>
        
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/confessions" end onClick={closeMenu}>Confessions</NavLink>
          
          {isAuthenticated ? (
            <>
              <NavLink to="/confessions/create" onClick={closeMenu}>Write</NavLink>
              <NavLink to="/confessions/my" onClick={closeMenu}>My Confessions</NavLink>
              {isModerator && (
                <NavLink to="/admin" onClick={closeMenu} className="nav-admin-link">
                  Admin Panel
                </NavLink>
              )}
              <NavLink to="/profile" onClick={closeMenu} className="nav-profile-link">
                Profile
                {role !== 'user' && (
                  <span className={`badge-role badge-${role} nav-role-pill`}>
                    {role === 'admin' ? 'Admin' : 'Mod'}
                  </span>
                )}
              </NavLink>
              <button className="btn-logout" onClick={() => { logout(); closeMenu(); }}>Sign out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>Sign in</NavLink>
              <NavLink to="/register" className="btn-register" onClick={closeMenu}>Sign up</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
