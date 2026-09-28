import React, { useState, useEffect } from 'react';
import { getMyConfessions, deleteConfession } from '../services/confessionApi';
import ConfessionCard from '../components/ConfessionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const MyConfessionsPage = () => {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyConfessions = async () => {
    setLoading(true);
    try {
      const data = await getMyConfessions();
      setConfessions(Array.isArray(data) ? data : (data.confessions || []));
      setError(null);
    } catch (err) {
      setError('Failed to load your confessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyConfessions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this confession?')) return;
    
    try {
      await deleteConfession(id);
      setConfessions(confessions.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete confession');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMyConfessions} />;

  return (
    <div className="home-feed-layout my-confessions-page">
      <div className="feed-title-area">
        <h1 className="feed-main-title">My Confessions</h1>
        <p className="feed-tagline">manage your anonymous posts</p>
      </div>
      
      {confessions.length === 0 ? (
        <EmptyState 
          title="No Confessions Found" 
          message="You haven't posted any confessions yet."
          actionLabel="Create One"
          actionLink="/confessions/create"
        />
      ) : (
        <div className="confessions-feed">
          {confessions.map((confession, idx) => (
            <ConfessionCard 
              key={confession._id} 
              confession={confession} 
              onDelete={handleDelete}
              index={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyConfessionsPage;
