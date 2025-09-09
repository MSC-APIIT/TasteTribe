'use client';

import { useSessionTimeout } from '../../../hooks/userSessionTimeout';
import { useAuth } from '../../../hooks/userAuth';
import toast from 'react-hot-toast';

export default function SessionModal() {
  const { showModal, setShowModal, resetSessionTimers, forceLogout } = useSessionTimeout();
  const { logout } = useAuth();

  const handleExtend = async () => {
    try {
      const res = await fetch('/api/auth/refresh', { method: 'POST' });
      const data = await res.json();

      if (res.ok && data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        setShowModal(false);
        resetSessionTimers();
        toast.success('Session extended');
      } else {
        throw new Error(data.error || 'Failed to refresh session');
      }
    } catch (err) {
      toast.error('Session refresh failed');
      forceLogout();
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-2">Session Expiring</h2>
        <p className="text-muted-foreground mb-4">
          Your session is about to expire. Would you like to extend it?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-muted text-primary rounded-md hover:bg-card"
            onClick={handleExtend}
          >
            Extend
          </button>
          <button
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-muted"
            onClick={forceLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
