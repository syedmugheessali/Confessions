import React, { useState, useEffect } from 'react';
import { getConfessions, deleteConfession } from '../services/confessionApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfessionCard from '../components/ConfessionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const FeedPage = () => {
  const { isAuthenticated, isModerator } = useAuth();
  const navigate = useNavigate();
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleModeratorDelete = async (id) => {
    if (!window.confirm('Moderation action: Are you sure you want to delete this confession?')) return;
    try {
      await deleteConfession(id);
      setConfessions(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to remove confession: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchConfessions = async (pageNum, isRefresh = false) => {
    try {
      if (isRefresh) setLoading(true);
      setError(null);
      const data = await getConfessions(pageNum, 20);
      const items = data.confessions || [];
      
      if (isRefresh) {
        setConfessions(items);
      } else {
        setConfessions(prev => [...prev, ...items]);
      }
      
      setHasMore(data.pagination ? pageNum < data.pagination.pages : items.length >= 20);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load confessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfessions(page, true);
  }, []);

  const handleRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchConfessions(1, true);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchConfessions(nextPage);
  };

  if (loading && page === 1) return <LoadingSpinner />;
  if (error && page === 1) return <ErrorMessage message={error} onRetry={handleRefresh} />;

  return (
    <div className="home-feed-layout">
      <div className="feed-title-area">
        <h1 className="feed-main-title">All Confessions</h1>
        <p className="feed-tagline">the latest anonymous thoughts</p>
      </div>

      {confessions.length === 0 ? (
        <EmptyState 
          title="No Confessions" 
          message="It's too quiet here. Be the first to confess." 
          actionLabel="Create Confession" 
          actionLink="/confessions/create" 
        />
      ) : (
        <>
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
          
          {hasMore && (
            <div className="load-more-container">
              <button className="btn-load-more" onClick={handleLoadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
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
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default FeedPage;
