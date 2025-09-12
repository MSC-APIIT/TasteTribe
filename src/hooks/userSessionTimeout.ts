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
    if (!token) return;

    let decoded: DecodedToken;
    try {
      decoded = jwtDecode<DecodedToken>(token);
    } catch (err) {
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

    warnTimeoutRef.current = setTimeout(
      () => {
        setShowModal(true);
      },
      timeUntilExpiry - 2 * 60 * 1000
    );

    logoutTimeoutRef.current = setTimeout(() => {
      forceLogout();
      toast.error('Session expired. You’ve been logged out.');
    }, timeUntilExpiry);
  }, [clearTimers, forceLogout, setShowModal]);

  useEffect(() => {
    resetSessionTimers();
    return clearTimers;
  }, [clearTimers, resetSessionTimers]);

  return { showModal, setShowModal, resetSessionTimers, forceLogout };
}
