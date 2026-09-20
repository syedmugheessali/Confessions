import { useState, useEffect } from 'react';

const useCountdown = (expiresAt) => {
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    if (!expiresAt) return;

    const calculateRemaining = () => {
      const now = new Date().getTime();
      const expiration = new Date(expiresAt).getTime();
      const difference = expiration - now;

      if (difference <= 0) {
        setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, formatted: 'Expired' });
        return true; // expired
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      let formatted = '';
      if (days > 0) formatted += `${days}d `;
      if (hours > 0 || days > 0) formatted += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) formatted += `${minutes}m `;
      formatted += `${seconds}s`;

      setRemainingTime({ days, hours, minutes, seconds, isExpired: false, formatted: formatted.trim() });
      return false; // not expired
    };

    // Initial calculation
    const expired = calculateRemaining();
    if (expired) return;

    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return remainingTime || { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false, formatted: '' };
};

export default useCountdown;
