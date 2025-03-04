import { useUserStore } from '@/composables/userStore';
import axios from 'axios';
import { KITCHEN_API_URL } from '@/config';
import { KitchenAPIException } from './kitchen_api_exception';

export function initInstance() {
  const userStore = useUserStore();

  const headers = {
    Authorization: 'Bearer ' + userStore.getToken(),
  };

  const api = axios.create({
    baseURL: KITCHEN_API_URL,
    timeout: 1000,
    headers: headers,
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const authStore = useUserStore();

      if (error.response?.status === 401) {
        authStore.logout();
        return Promise.reject(new KitchenAPIException(401, 'Unauthorized'));
      }

      return Promise.reject(error);
    },
  );
  return api;
}

export function initInstanceWithOutBearer() {
  return axios.create({
    baseURL: KITCHEN_API_URL,
    timeout: 1000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
