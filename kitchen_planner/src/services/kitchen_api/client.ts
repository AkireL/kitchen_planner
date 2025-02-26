import { useUserStore } from '@/composables/userStore';
import axios from 'axios';
import { KITCHEN_API_URL } from '@/config';

export function initInstance() {
  const userStore = useUserStore();

  const headers = {
    Authorization: 'Bearer ' + userStore.getToken(),
  };

  return axios.create({
    baseURL: KITCHEN_API_URL,
    timeout: 1000,
    headers: headers,
  });
}

export function initInstanceWithOutBearer() {
  return axios.create({
    baseURL: KITCHEN_API_URL,
    timeout: 1000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
