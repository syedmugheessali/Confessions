import { useEffect, useRef, useCallback } from 'react';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in ms
const STORAGE_KEY = 'lastActivityTimestamp';
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart', 'mousedown'];
// Throttle activity updates to avoid excessive writes
const THROTTLE_MS = 15000; // 15 seconds

/**
 * Hidden inactivity timer hook.
 * Monitors user activity and calls `onTimeout` after 30 minutes of inactivity.
 * Activity timestamps are persisted to localStorage for cross-tab awareness.
 *
 * @param {Function} onTimeout - Callback fired when inactivity threshold is reached
 * @param {boolean} enabled - Whether the timer should be active (only when authenticated)
 */
const useInactivityTimer = (onTimeout, enabled = true) => {
  const timeoutRef = useRef(null);
  const lastWriteRef = useRef(0);
  const onTimeoutRef = useRef(onTimeout);

  // Keep callback ref current without re-running effects
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timeoutRef.current = setTimeout(() => {
      // Double-check against localStorage in case another tab refreshed activity
      const lastActivity = parseInt(localStorage.getItem(STORAGE_KEY), 10);
      const elapsed = Date.now() - lastActivity;

      if (elapsed >= INACTIVITY_TIMEOUT) {
        onTimeoutRef.current();
      } else {
        // Another tab was active — restart timer for remaining time
        timeoutRef.current = setTimeout(() => {
          onTimeoutRef.current();
        }, INACTIVITY_TIMEOUT - elapsed);
      }
    }, INACTIVITY_TIMEOUT);
  }, [clearTimer]);

  const recordActivity = useCallback(() => {
    const now = Date.now();
    // Throttle localStorage writes
    if (now - lastWriteRef.current > THROTTLE_MS) {
      localStorage.setItem(STORAGE_KEY, now.toString());
      lastWriteRef.current = now;
    }
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    if (!enabled) {
      clearTimer();
      return;
    }

    // Initialize
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    startTimer();

    // Attach activity listeners
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, recordActivity, { passive: true });
    });

    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        startTimer(); // Another tab was active, reset our timer
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearTimer();
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, recordActivity);
      });
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [enabled, recordActivity, startTimer, clearTimer]);
};

export default useInactivityTimer;
