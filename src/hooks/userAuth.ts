'use client';

import { useEffect, useState } from 'react';
import type { UserDto } from '../server/modules/auth/types';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
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
    window.dispatchEvent(new Event('auth-change')); // notify listeners
    toast.success('Logged out successfully'); // toast message
  };

  return { user, logout };
}
