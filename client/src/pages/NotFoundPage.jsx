import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page page-container">
      <h1 className="text-danger">404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
