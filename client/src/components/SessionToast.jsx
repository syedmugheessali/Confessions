import React from 'react';
import { useAuth } from '../context/AuthContext';

const SessionToast = () => {
  const { sessionExpiredMsg } = useAuth();

  if (!sessionExpiredMsg) return null;

  return (
    <div className="session-toast" role="alert">
      <span className="session-toast-icon">⏱</span>
      <span className="session-toast-msg">{sessionExpiredMsg}</span>
    </div>
  );
};

export default SessionToast;
