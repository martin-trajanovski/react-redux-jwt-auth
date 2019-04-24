import axios from 'axios';

import config from '../config';
import { authHeader } from '../helpers/auth-header';

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

export default axiosInstance;
