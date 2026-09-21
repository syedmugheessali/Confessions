import React, { useState, useEffect } from 'react';
import { getConfessions } from '../services/confessionApi';
import ConfessionCard from '../components/ConfessionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const FeedPage = () => {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
        <h2>Latest Confessions</h2>
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
              <ConfessionCard key={confession._id} confession={confession} />
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
