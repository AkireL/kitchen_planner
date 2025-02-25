import axios from 'axios';
import { KITCHEN_API_URL } from '@/config';
import { useUserStore } from '@/composables/userStore';

function initInstance() {
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

export function signIn(data: object = {}) {
  return initInstance()({
    method: 'post',
    url: KITCHEN_API_URL + '/register',
    data: data
  });
}

export function logIn(data: object = {}) {
  return initInstance()({
    url: KITCHEN_API_URL + '/token/' ,
    data: data,
    method: 'post'
  });
}

export function getCurrentUser() {
  return initInstance().get(
    KITCHEN_API_URL + '/users/me' ,
   );
}
