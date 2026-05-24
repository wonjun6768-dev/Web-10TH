import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (token) {
    const cleanToken = token.replace(/"/g, "");
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshTokenValue = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
            if (!refreshTokenValue) throw new Error("No refresh token");

            const refreshToken = JSON.parse(refreshTokenValue);
            
            // 리프레시 요청: 백엔드 Strategy(fromBodyField('refresh'))에 맞춰 키 이름을 'refresh'로 변경
            const response = await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`, {
              refresh: refreshToken, // 기존 'refreshToken'에서 'refresh'로 수정
            });

            const resultData = response.data.result || response.data.data || response.data;
            const newAccess = resultData.accessToken;
            const newRefresh = resultData.refreshToken;

            if (!newAccess) throw new Error("토큰 추출 실패");

            localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(newAccess));
            localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, JSON.stringify(newRefresh));

            return newAccess;
          } catch (err) {
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
            window.location.href = "/login";
            return Promise.reject(err);
          } finally {
            refreshPromise = null;
          }
        })();
      }

      return refreshPromise.then((newAccessToken) => {
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance.request(originalRequest);
        }
        return Promise.reject(error);
      });
    }
    return Promise.reject(error);
  }
);