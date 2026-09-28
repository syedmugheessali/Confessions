import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { likeConfession, dislikeConfession } from '../services/confessionApi';

const ConfessionCard = ({ confession, onDelete, deleteLabel = 'Delete', index = 0 }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [likesCount, setLikesCount] = useState(confession.likesCount || 0);
  const [dislikesCount, setDislikesCount] = useState(confession.dislikesCount || 0);
  const [reacting, setReacting] = useState(false);

  const handleClick = (e) => {
    if (e.target.closest('.card-actions')) return;
    navigate(`/confessions/${confession._id}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated || reacting) return;
    setReacting(true);
    try {
      const data = await likeConfession(confession._id);
      setLikesCount(data.likesCount);
      setDislikesCount(data.dislikesCount);
    } catch (err) {
      // silently fail
    } finally {
      setReacting(false);
    }
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated || reacting) return;
    setReacting(true);
    try {
      const data = await dislikeConfession(confession._id);
      setLikesCount(data.likesCount);
      setDislikesCount(data.dislikesCount);
    } catch (err) {
      // silently fail
    } finally {
      setReacting(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';
    return 'just now';
  };

  return (
    <div
      className="confession-card"
      onClick={handleClick}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header */}
      <div className="card-header">
        <div className="card-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <span className="card-author">Anonymous</span>
        <span className="card-dot">·</span>
        <span className="card-time">{timeAgo(confession.createdAt)}</span>
      </div>

      {/* Body */}
      <div className="card-body">
        <p className="card-content">{confession.content}</p>
      </div>

      {/* Actions */}
      <div className="card-actions">
        <button
          className={`action-btn like-btn ${!isAuthenticated ? 'disabled' : ''}`}
          onClick={handleLike}
          disabled={reacting || !isAuthenticated}
          title={isAuthenticated ? 'Like' : 'Sign in to react'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 10v12"/>
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
          </svg>
          <span>{likesCount}</span>
        </button>

        <button
          className={`action-btn dislike-btn ${!isAuthenticated ? 'disabled' : ''}`}
          onClick={handleDislike}
          disabled={reacting || !isAuthenticated}
          title={isAuthenticated ? 'Dislike' : 'Sign in to react'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 14V2"/>
            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/>
          </svg>
          <span>{dislikesCount}</span>
        </button>

        {onDelete && (
          <button
            className="action-btn delete-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(confession._id);
            }}
            title="Delete"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            <span>{deleteLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfessionCard;
