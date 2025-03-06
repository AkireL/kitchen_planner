import { KITCHEN_API_URL } from '@/config';
import { initInstance, initInstanceWithOutBearer } from './client';

export function signIn(data: object = {}) {
  return initInstance()({
    method: 'post',
    url: KITCHEN_API_URL + '/register',
    data: data,
  });
}

export function logIn(data: object = {}) {
  return initInstanceWithOutBearer().post(KITCHEN_API_URL + '/token', data);
}

export function getCurrentUser() {
  return initInstance().get(KITCHEN_API_URL + '/users/me');
}
