'use client';

import { useEffect, useState } from 'react';
import type { UserDto } from '../server/modules/auth/types';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<UserDto | null>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null)
  
  useEffect(() => {
    const loadUser = () => {
      const storedUser = sessionStorage.getItem('user');
      const token = sessionStorage.getItem('accessToken');
      console.log(token)
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        setAccessToken(token);
      } else {
        setUser(null);
        setAccessToken(null);
      }
    };

    loadUser(); // initial load

    window.addEventListener('auth-change', loadUser); // listen for login/logout

    return () => {
      window.removeEventListener('auth-change', loadUser);
    };
  }, []);

  const logout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('sessionStartTime');

    setUser(null);
    setAccessToken(null);
    window.dispatchEvent(new Event('auth-change')); // notify listeners
    toast.success('Logged out successfully'); // toast message
  };

  return { user, accessToken, logout };
}
