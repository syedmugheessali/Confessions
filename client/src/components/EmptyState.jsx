import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon = '🤫', title = 'Nothing here yet', message = 'There are no items to display.', actionLabel, actionLink }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
