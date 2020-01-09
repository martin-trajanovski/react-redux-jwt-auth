import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import config from '../config';
import { authHeader } from '../helpers/auth-header';
import { authService } from '../services';

const axiosInstance = axios.create({
  baseURL: config.apiEndpoint
});

axiosInstance.interceptors.request.use(
  config => {
    config.headers.Authorization = authHeader().Authorization;

    return config;
  },
  error => {
    return error;
  }
);

// Function that will be called to refresh authorization
const refreshAuthLogic = () => authService.refreshToken();
const onRetry = requestConfig => {
  console.log(requestConfig, 'aaaaaaaaaaaaaaaaa');
};

// Instantiate the interceptor (you can chain it as it returns the axios instance)
createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, { onRetry });

export default axiosInstance;
