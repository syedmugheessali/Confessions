import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConfession } from '../services/confessionApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useCountdown from '../hooks/useCountdown';

const ConfessionDetailPage = () => {
  const { id } = useParams();
  const [confession, setConfession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfession = async () => {
      try {
        const data = await getConfession(id);
        setConfession(data);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Confession not found or expired.' : 'Failed to load confession.');
      } finally {
        setLoading(false);
      }
    };
    fetchConfession();
  }, [id]);

  const { formatted, isExpired } = useCountdown(confession?.expiresAt);

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="page-container">
      <ErrorMessage message={error} />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/confessions" className="btn-secondary">Back to Feed</Link>
      </div>
    </div>
  );

  return (
    <div className="page-container detail-page">
      <Link to="/confessions" className="back-link">← Back to Feed</Link>
      
      <div className={`detail-card card-layout ${isExpired ? 'expired' : ''}`}>
        <div className="detail-header">
          <span className="author">Anonymous</span>
          <span className="date">
            {new Date(confession.createdAt).toLocaleDateString()} at {new Date(confession.createdAt).toLocaleTimeString()}
          </span>
        </div>
        
        <div className="detail-body">
          <p className="content">{confession.content}</p>
        </div>
        
        <div className="detail-footer">
          <div className={`countdown-large ${isExpired ? 'text-danger' : ''}`}>
            {isExpired ? 'This confession has expired' : `Expires in ${formatted}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfessionDetailPage;
