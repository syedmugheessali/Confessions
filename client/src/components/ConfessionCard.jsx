import React from 'react';
import { useNavigate } from 'react-router-dom';

// Curated gradient palette for card accents
const ACCENT_GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #fccb90, #d57eeb)',
  'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
  'linear-gradient(135deg, #f6d365, #fda085)',
  'linear-gradient(135deg, #89f7fe, #66a6ff)',
];

// Generate a stable index from confession ID so same card always gets same color
const getGradientIndex = (id) => {
  if (!id) return 0;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % ACCENT_GRADIENTS.length;
};

const getInitialEmoji = (id) => {
  const emojis = ['🤫', '💭', '🫣', '🤐', '👀', '💬', '🫢', '🙊', '✨', '🌙'];
  return emojis[getGradientIndex(id)];
};

const ConfessionCard = ({ confession, onDelete, deleteLabel = 'Delete', index = 0 }) => {
  const navigate = useNavigate();
  const gradientIndex = getGradientIndex(confession._id);
  const gradient = ACCENT_GRADIENTS[gradientIndex];
  const emoji = getInitialEmoji(confession._id);

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
    <div
      className="confession-card"
      onClick={handleClick}
      style={{ '--card-accent': gradient, animationDelay: `${index * 0.06}s` }}
    >
      <div className="card-accent-bar" />
      <div className="card-inner">
        <div className="card-header">
          <div className="card-author-group">
            <span className="card-emoji">{emoji}</span>
            <span className="author">Anonymous</span>
          </div>
          <span className="time-ago">{timeAgo(confession.createdAt)}</span>
        </div>
        <div className="card-body">
          <span className="quote-mark">"</span>
          <p className="content">{confession.content}</p>
        </div>
        <div className="card-footer">
          <span className="read-more-hint">Tap to read full →</span>
          {onDelete && (
            <button 
              className="delete-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(confession._id);
              }}
              aria-label="Delete confession"
            >
              {deleteLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfessionCard;
