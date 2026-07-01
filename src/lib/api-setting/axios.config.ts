// lib/api/axios.config.ts
import { BASE_URL } from '@/config/url.config';
import Axios from 'axios';
// Note: avoid importing server-only modules here; this file runs in the browser.

// Simple axios instance - Better Auth handles token injection
const axios = Axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Request Interceptor - Let Better Auth handle token injection
axios.interceptors.request.use(async (config) => {
  // Add workspace context
  const workspaceId = getWorkspaceId();
  if (workspaceId && !config.params?.workspaceId) {
    config.params = {
      ...config.params,
      workspaceId
    };
  }

  config.headers['X-Request-ID'] = generateRequestId();

  return config;
});

// Response Interceptor - return full Axios response for blob downloads,
// otherwise return `response.data` for convenience.
axios.interceptors.response.use(
  (response) => {
    try {
      if (response?.config?.responseType === 'blob') return response;
    } catch (e) {
      // ignore
    }

    return response.data;
  },
  (error) => {
    const originalRequest = (error.config || {}) as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Don't retry auth endpoints
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error);
      }

      // Session expired or unauthorized: clear local workspace and redirect.
      clearWorkspaceData();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Simple helper functions
function getWorkspaceId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('WORKSPACE_ID');
  }
  return null;
}

function clearWorkspaceData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('WORKSPACE_ID');
  }
}

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export { axios };
