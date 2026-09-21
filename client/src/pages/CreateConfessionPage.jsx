import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createConfession } from '../services/confessionApi';

const DURATION_OPTIONS = [
  { label: '1 hour', value: '1h' },
  { label: '6 hours', value: '6h' },
  { label: '12 hours', value: '12h' },
  { label: '24 hours', value: '24h' },
  { label: '3 days', value: '3d' },
  { label: '7 days', value: '7d' },
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
      setError('Confession is too long (maximum 1000 characters).');
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
        <h2>New Confession</h2>
        <p className="subtitle-text">Write your note. It will be posted anonymously and deleted automatically.</p>
        
        {error && <div className="form-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              className="confession-textarea"
              placeholder="What would you like to say?"
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
            <label>Expiration time:</label>
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
            {loading ? 'Publishing...' : 'Publish confession'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateConfessionPage;
