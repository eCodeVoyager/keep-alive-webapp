import Cookies from "js-cookie";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}/api/v1`;

// Create the main axios instance
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Track if we're currently refreshing the token to prevent multiple refresh requests
let isRefreshing = false;

// Queue of failed requests to retry after token refresh
let failedRequestsQueue = [];

// Process the queue of failed requests with the new token
const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedRequestsQueue = [];
};

// Request interceptor - adds auth token to requests
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles token refresh on 401 errors
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;

      // If we're not already refreshing a token
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = Cookies.get("refreshToken");

          // If we don't have a refresh token, we can't refresh
          if (!refreshToken) {
            // Force logout by removing cookies
            Cookies.remove("authToken");
            Cookies.remove("refreshToken");

            // Process any queued requests with an error
            processQueue(new Error("No refresh token available"));
            return Promise.reject(error);
          }

          // Attempt to refresh the token
          const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          // If successful, update auth tokens
          if (response.data?.data?.accessToken) {
            const newAccessToken = response.data.data.accessToken;
            const newRefreshToken =
              response.data.data.refreshToken || refreshToken;

            // Set new tokens in cookies
            Cookies.set("authToken", newAccessToken, { expires: 1 }); // 1 day
            Cookies.set("refreshToken", newRefreshToken, { expires: 30 }); // 30 days

            // Update the failed request's authorization header
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Process queued requests with the new token
            processQueue(null, newAccessToken);

            // Retry the original request with the new token
            return instance(originalRequest);
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (refreshError) {
          // If refresh fails, force logout and reject all queued requests
          Cookies.remove("authToken");
          Cookies.remove("refreshToken");

          // Trigger redirect to login on next protected route access
          window.dispatchEvent(new CustomEvent("auth:logout"));

          processQueue(refreshError);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }
    }

    // For non-401 errors or already retried requests, just reject
    return Promise.reject(error);
  }
);

// HTTP methods wrapper
const requests = {
  get: (url, params = {}, headers = {}) =>
    instance.get(url, { params, headers }).then((response) => response.data),

  post: (url, body = {}, headers = {}) =>
    instance.post(url, body, { headers }).then((response) => response.data),

  put: (url, body = {}, headers = {}) =>
    instance.put(url, body, { headers }).then((response) => response.data),

  patch: (url, body = {}, headers = {}) =>
    instance.patch(url, body, { headers }).then((response) => response.data),

  delete: (url, headers = {}) =>
    instance.delete(url, { headers }).then((response) => response.data),
};

export default requests;
