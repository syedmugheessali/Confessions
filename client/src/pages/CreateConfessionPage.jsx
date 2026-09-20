import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createConfession } from '../services/confessionApi';

const DURATION_OPTIONS = [
  { label: '1 Hour', value: '1h' },
  { label: '6 Hours', value: '6h' },
  { label: '12 Hours', value: '12h' },
  { label: '24 Hours', value: '24h' },
  { label: '3 Days', value: '3d' },
  { label: '7 Days', value: '7d' },
];

const CreateConfessionPage = () => {
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState('24h');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Confession cannot be empty.');
      return;
    }
    if (content.length > 1000) {
      setError('Confession is too long (max 1000 characters).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createConfession(content, duration);
      navigate('/confessions');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create confession');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container create-page">
      <div className="create-card card-layout">
        <h2>Unburden Yourself</h2>
        <p className="subtitle-text">Write your confession below. It's completely anonymous.</p>
        
        {error && <div className="form-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              className="confession-textarea"
              placeholder="I've been holding onto..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              maxLength={1000}
            />
            <div className="char-count">
              {content.length} / 1000
            </div>
          </div>

          <div className="form-group">
            <label>Auto-delete after:</label>
            <div className="duration-options">
              {DURATION_OPTIONS.map((d) => (
                <button
                  type="button"
                  key={d.value}
                  className={`duration-btn ${duration === d.value ? 'active' : ''}`}
                  onClick={() => setDuration(d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary full-width" disabled={loading || !content.trim()}>
            {loading ? 'Posting...' : 'Confess'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateConfessionPage;
