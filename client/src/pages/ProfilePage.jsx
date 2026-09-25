import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="page-container profile-page">
      <div className="profile-card card-layout">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2>{user.name}</h2>
          <p className="text-secondary">{user.email}</p>
        </div>
        
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Account Role</span>
            <span className="detail-value">
              <span className={`badge-role badge-${user.role || 'user'}`}>
                {(user.role || 'user').toUpperCase()}
              </span>
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Member Since</span>
            <span className="detail-value">{memberSince}</span>
          </div>
        </div>

        <button className="btn-danger full-width mt-4" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
