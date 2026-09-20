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
    if (!window.confirm('Are you sure you want to delete this confession early?')) return;
    
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
    <div className="page-container">
      <h2>My Confessions</h2>
      <p className="subtitle-text mb-4">View and manage your active confessions.</p>
      
      {confessions.length === 0 ? (
        <EmptyState 
          title="No Confessions Found" 
          message="You haven't posted any confessions yet."
          actionLabel="Create One"
          actionLink="/confessions/create"
        />
      ) : (
        <div className="confessions-grid">
          {confessions.map((confession) => (
            <ConfessionCard 
              key={confession._id} 
              confession={confession} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyConfessionsPage;
