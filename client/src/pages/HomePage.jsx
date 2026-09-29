import React, { useState, useEffect } from 'react';
import { getConfessions, deleteConfession } from '../services/confessionApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfessionCard from '../components/ConfessionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const HomePage = () => {
  const { isAuthenticated, isModerator } = useAuth();
  const navigate = useNavigate();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleModeratorDelete = async (id) => {
    if (!window.confirm('Moderation action: Are you sure you want to delete this confession?')) return;
    try {
      await deleteConfession(id);
      setConfessions(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to remove confession: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchConfessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getConfessions(1, 100);
      const items = data.confessions || [];
      setConfessions(items);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load confessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfessions();
  }, []);

  const handleRefresh = () => {
    fetchConfessions();
  };

  return (
    <div className="home-feed-layout">
      {/* Header area */}
      <div className="feed-title-area">
        <h1 className="feed-main-title">Confessions</h1>
        <p className="feed-tagline">Post confessions anonymously that youre too afraid to admit publicly</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={handleRefresh} />
      ) : confessions.length === 0 ? (
        <div className="empty-feed">
          <div className="empty-feed-icon">🤫</div>
          <p className="empty-feed-title">No confessions yet</p>
          <p className="empty-feed-sub">Be the first to share something.</p>
        </div>
      ) : (
        <div className="confessions-feed">
          {confessions.map((confession, idx) => (
            <ConfessionCard
              key={confession._id}
              confession={confession}
              onDelete={isModerator ? handleModeratorDelete : undefined}
              deleteLabel={isModerator ? 'Remove (Mod)' : 'Delete'}
              index={idx}
            />
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      {isAuthenticated && (
        <button
          className="fab-create"
          onClick={() => navigate('/confessions/create')}
          aria-label="Create confession"
          title="Write a confession"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default HomePage;
