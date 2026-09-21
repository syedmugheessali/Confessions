import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <h3 className="error-title">Unable to load content</h3>
      <p className="error-message">{message || 'An unexpected error occurred.'}</p>
      {onRetry && (
        <button className="btn-retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
