import React, { useState, useEffect } from 'react';
import { getConfessions, deleteConfession } from '../services/confessionApi';
import { useAuth } from '../context/AuthContext';
import ConfessionCard from '../components/ConfessionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const FeedPage = () => {
  const { isModerator } = useAuth();
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
    <div className="page-container feed-page">
      <div className="feed-header">
        <div>
          <h2>Latest Confessions</h2>
          <p className="subtitle-text">Share your secret without getting known.</p>
        </div>
        <button className="btn-secondary" onClick={handleRefresh}>
          Refresh
        </button>
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
          <div className="confessions-grid">
            {confessions.map((confession) => (
              <ConfessionCard 
                key={confession._id} 
                confession={confession} 
                onDelete={isModerator ? handleModeratorDelete : undefined}
                deleteLabel={isModerator ? 'Remove (Mod)' : 'Delete'}
              />
            ))}
          </div>
          
          {hasMore && (
            <div className="load-more-container">
              <button className="btn-secondary" onClick={handleLoadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedPage;
