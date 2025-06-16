// Importe o tipo 'AxiosInstance' para garantir a tipagem correta
import { AxiosInstance, AxiosError } from "axios"; 
import { useAuthStore } from "@/src/common/stores/useAuthStore";
import { userService } from "@/src/common/services/user.service";

// Remova a importação direta do apiService daqui
// import apiService from "@/src/common/services/api.service"; 

let isAlreadySetup = false;
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// A função agora recebe a instância do Axios como parâmetro
export function setupAxiosInterceptors(apiInstance: AxiosInstance) {
  if (isAlreadySetup) {
    return;
  }

  // Use a 'apiInstance' recebida em vez de 'apiService'
  apiInstance.interceptors.request.use(
    (config) => {
      const { accessToken } = useAuthStore.getState();
      if (accessToken && !config.url?.includes("/login")) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Use a 'apiInstance' recebida em vez de 'apiService'
  apiInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as typeof error.config & { _retry?: boolean };

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
              }
              return apiInstance(originalRequest); // Use a apiInstance aqui
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;
        
        const { refreshToken, actions } = useAuthStore.getState();

        if (!refreshToken) {
            actions.logout();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        try {
          // const { data } = await userService.refreshToken(refreshToken);
          // const newAccessToken = data.access;
          
          // actions.setTokens(newAccessToken, refreshToken);
          
          // if (originalRequest.headers) {
          //   originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          // }
          
          // processQueue(null, newAccessToken);
          // return apiInstance(originalRequest); // E aqui também

        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          actions.logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);

        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  isAlreadySetup = true;
}