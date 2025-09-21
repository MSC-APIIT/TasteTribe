'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { useAuth } from './userAuth';

type DecodedToken = { exp: number };

export function useSessionTimeout() {
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const warnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    warnTimeoutRef.current = null;
    logoutTimeoutRef.current = null;
  }, []);

  const forceLogout = useCallback(() => {
    clearTimers();
    setShowModal(false);
    logout();
  }, [clearTimers, logout]);

  const resetSessionTimers = useCallback(() => {
    clearTimers();

    const token = sessionStorage.getItem('accessToken');
    if (!token) return; // don't force logout if token missing

    let decoded: DecodedToken;
    try {
      decoded = jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error('Invalid token:', err);
      forceLogout();
      return;
    }

    const expiryTime = decoded.exp * 1000;
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    if (timeUntilExpiry <= 0) {
      forceLogout();
      return;
    }

    // Warn 2 minutes before expiry
    if (timeUntilExpiry > 2 * 60 * 1000) {
      warnTimeoutRef.current = setTimeout(
        () => {
          setShowModal(true);
        },
        timeUntilExpiry - 2 * 60 * 1000
      );
    } else {
      // If less than 2 minutes remaining, show modal immediately
      setShowModal(true);
    }

    logoutTimeoutRef.current = setTimeout(() => {
      forceLogout();
      toast.error('Session expired. You’ve been logged out.');
    }, timeUntilExpiry);
  }, [clearTimers, forceLogout]);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) resetSessionTimers();

    // Cleanup on unmount
    return clearTimers;
  }, [clearTimers, resetSessionTimers]);

  return { showModal, setShowModal, resetSessionTimers, forceLogout };
}
