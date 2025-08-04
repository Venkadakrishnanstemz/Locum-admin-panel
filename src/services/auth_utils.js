// setupAxios.js

import axios from "axios";

// Constants
const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const API_BASE_URL = "http://192.168.60.118:8000/api"; // Your backend

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  delete axios.defaults.headers.common["Authorization"];
};

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

// Initialize token on app load
export const initAuth = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};

// Refresh logic
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Attach global interceptor to axios
export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      // Skip interceptor for auth endpoints (login/token, refresh)
      const skipRefreshEndpoints = [
        "/auth/token/",
      ];
      const isSkippedEndpoint = skipRefreshEndpoints.some(endpoint =>
        originalRequest.url.includes(endpoint)
      );

      if (isSkippedEndpoint) {
        return Promise.reject(error); // Don't handle with refresh logic
      }

      // 🚨 Handle network/CORS errors separately
      if (!error.response) {
        console.warn("Network error or CORS failure");
        return Promise.reject(error);
      }

      // Refresh logic
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          const refreshToken = getRefreshToken();
          const res = await axios.post(
            `${API_BASE_URL}/auth/refresh/`,
            { refresh: refreshToken },
          );

          const newAccessToken = res.data.access;
          setTokens(newAccessToken, refreshToken);
          processQueue(null, newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (err) {
          processQueue(err, null);
          clearTokens();
          window.location.href = "/#/login";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

