import { apiFetch } from '@/lib/apiClient';
import { useMemo } from 'react';

export const useApi = (token?: string) => {
  return useMemo(
    () => ({
      get: <T>(path: string) => apiFetch<T>(path, { method: 'GET', token }),
      post: <T>(path: string, body: any) =>
        apiFetch<T>(path, { method: 'POST', body, token }),
      put: <T>(path: string, body: any) =>
        apiFetch<T>(path, { method: 'PUT', body, token }),
      delete: <T>(path: string) =>
        apiFetch<T>(path, { method: 'DELETE', token }),
    }),
    [token]
  );
};
