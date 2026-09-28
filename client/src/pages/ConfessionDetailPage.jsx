import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConfession, likeConfession, dislikeConfession } from '../services/confessionApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ConfessionDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [confession, setConfession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [reacting, setReacting] = useState(false);

  useEffect(() => {
    const fetchConfession = async () => {
      try {
        const data = await getConfession(id);
        setConfession(data);
        setLikesCount(data.likesCount || 0);
        setDislikesCount(data.dislikesCount || 0);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Confession not found.' : 'Failed to load confession.');
      } finally {
        setLoading(false);
      }
    };
    fetchConfession();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated || reacting) return;
    setReacting(true);
    try {
      const data = await likeConfession(id);
      setLikesCount(data.likesCount);
      setDislikesCount(data.dislikesCount);
    } catch (err) { /* silently fail */ }
    finally { setReacting(false); }
  };

  const handleDislike = async () => {
    if (!isAuthenticated || reacting) return;
    setReacting(true);
    try {
      const data = await dislikeConfession(id);
      setLikesCount(data.likesCount);
      setDislikesCount(data.dislikesCount);
    } catch (err) { /* silently fail */ }
    finally { setReacting(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="page-container">
      <ErrorMessage message={error} />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/" className="btn-secondary">Back to Feed</Link>
      </div>
    </div>
  );

  return (
    <div className="page-container detail-page">
      <Link to="/" className="back-link">← Back to Feed</Link>
      
      <div className="detail-card card-layout">
        <div className="detail-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="card-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="card-author" style={{ fontWeight: 600 }}>Anonymous</span>
          </div>
          <span className="date">
            {new Date(confession.createdAt).toLocaleDateString()} at {new Date(confession.createdAt).toLocaleTimeString()}
          </span>
        </div>
        
        <div className="detail-body">
          <p className="content">{confession.content}</p>
        </div>

        <div className="detail-footer">
          <div className="card-actions" style={{ paddingLeft: 0 }}>
            <button
              className={`action-btn like-btn ${!isAuthenticated ? 'disabled' : ''}`}
              onClick={handleLike}
              disabled={reacting || !isAuthenticated}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10v12"/>
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/>
              </svg>
              <span>{likesCount}</span>
            </button>

            <button
              className={`action-btn dislike-btn ${!isAuthenticated ? 'disabled' : ''}`}
              onClick={handleDislike}
              disabled={reacting || !isAuthenticated}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 14V2"/>
                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/>
              </svg>
              <span>{dislikesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfessionDetailPage;
