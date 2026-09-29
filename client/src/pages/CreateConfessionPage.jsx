import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createConfession } from '../services/confessionApi';

const CreateConfessionPage = () => {
  const [content, setContent] = useState('');
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
      await createConfession(content);
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
        <p className="subtitle-text">Write your note. It will be posted anonymously.</p>
        
        {error && <div className="form-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              className="confession-textarea"
              placeholder="Write your confession anonymously..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              maxLength={1000}
            />
            <div className="char-count">
              {content.length} / 1000
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
