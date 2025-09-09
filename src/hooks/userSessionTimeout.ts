'use client';

import { useEffect, useState, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { useAuth } from './userAuth';

type DecodedToken = { exp: number };

export function useSessionTimeout() {
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const warnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (warnTimeoutRef.current) clearTimeout(warnTimeoutRef.current);
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    warnTimeoutRef.current = null;
    logoutTimeoutRef.current = null;
    console.log('[SessionTimeout] Cleared timers.');
  };

  const resetSessionTimers = () => {
    clearTimers();

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    let decoded: DecodedToken;
    try {
      decoded = jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error('[SessionTimeout] Invalid token:', err);
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

    warnTimeoutRef.current = setTimeout(() => {
      setShowModal(true);
    }, timeUntilExpiry - 2 * 60 * 1000);

    logoutTimeoutRef.current = setTimeout(() => {
      forceLogout();
      toast.error('Session expired. You’ve been logged out.');
    }, timeUntilExpiry);
  };

  const forceLogout = () => {
    console.log('[SessionTimeout] Force logout triggered');
    clearTimers();
    setShowModal(false);
    logout();
  };

  useEffect(() => {
    resetSessionTimers();
    return clearTimers;
  }, []);

  return { showModal, setShowModal, resetSessionTimers, forceLogout };
}
