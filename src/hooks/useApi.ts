'use client';

import { apiFetch } from '@/lib/apiClient';

export const useApi = (token?: string) => ({
  get: <T>(path: string) => apiFetch<T>(path, { method: 'GET', token }),
  post: <T>(path: string, body: any) => apiFetch<T>(path, { method: 'POST', body, token }),
  put: <T>(path: string, body: any) => apiFetch<T>(path, { method: 'PUT', body, token }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE', token }),
});
