import { BASE_URL } from '@/config/url.config';
import Axios from 'axios'; // Path to the file you just showed me
import { auth } from '../auth/auth';
import { headers } from 'next/headers';

const axios = Axios.create({
  baseURL: BASE_URL,
  // This is the most important line.
  // It allows the browser to send your Better Auth session cookies to your API.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. Request Interceptor (For "Other APIs" that need a Bearer Token)
axios.interceptors.request.use(async (config) => {
  // If calling an external API that isn't your Better Auth base URL
  if (
    config.url &&
    !config.url.startsWith('/') &&
    !config.url.includes(BASE_URL)
  ) {
    await auth.api
      .getSession({
        query: {
          disableCookieCache: true
        },
        headers: await headers()
      })
      .then((session) => {
        if (session?.session?.token) {
          config.headers.Authorization = `Bearer ${session.session.token}`;
        }
      });
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // 1. Check if the error is 401 (Unauthorized)
    // 2. Ensure we haven't already tried to refresh this specific request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        /**
         * Better Auth Logic:
         * Calling getSession() triggers a background refresh if the session is stale
         * but the refresh token is still valid.
         */
        await auth.api
          .getSession({
            query: {
              disableCookieCache: true
            },
            headers: await headers()
          })
          .then((session) => {
            return axios(originalRequest);
          })
          .catch((error) => {
            window.location.href = '/auth/login';
          });
      } catch (refreshErr) {
        window.location.reload();
      }

      // If we reach here, the refresh failed (user must log in again)
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export { axios };
