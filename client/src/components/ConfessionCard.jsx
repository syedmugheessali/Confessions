import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCountdown from '../hooks/useCountdown';

const ConfessionCard = ({ confession, onDelete }) => {
  const navigate = useNavigate();
  const { formatted, isExpired } = useCountdown(confession.expiresAt);

  const handleClick = (e) => {
    // Prevent navigation if clicking on the delete button
    if (e.target.closest('.delete-btn')) return;
    navigate(`/confessions/${confession._id}`);
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className={`confession-card ${isExpired ? 'expired' : ''}`} onClick={handleClick}>
      <div className="card-header">
        <span className="author">Anonymous</span>
        <span className="time-ago">{timeAgo(confession.createdAt)}</span>
      </div>
      <div className="card-body">
        <p className="content">{confession.content}</p>
      </div>
      <div className="card-footer">
        <div className={`countdown ${isExpired ? 'text-danger' : ''}`}>
          {isExpired ? 'Expired' : `Expires in ${formatted}`}
        </div>
        {onDelete && (
          <button 
            className="delete-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(confession._id);
            }}
            aria-label="Delete confession"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfessionCard;
