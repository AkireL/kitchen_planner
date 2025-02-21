import axios from 'axios';
import { KITCHEN_API_URL } from '@/config';
import { useUserStore } from '@/composables/userStore';
import type { Recipe, RecipeFiltersParams } from '@/types';

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

export function retrieveRecipesService(params: RecipeFiltersParams | object = {}) {
  return initInstance().get(KITCHEN_API_URL + '/recipes', {
    params: params,
  });
}

export function updateRecipesService(id: number | string, data: Recipe) {
  return initInstance()({
    method: 'put',
    url: KITCHEN_API_URL + '/recipes/' + id,
    data: data,
  });
}

export function deleteRecipesService(id: string | number) {
  return initInstance().delete(KITCHEN_API_URL + '/recipes/' + id);
}

export function createRecipesService(data: Recipe) {
  const userStore = useUserStore();

  const authorization = userStore.getToken();

  const headers = {
    Authorization: 'Bearer ' + authorization,
  };

  return axios({
    method: 'post',
    url: KITCHEN_API_URL + '/recipes',
    headers: headers,
    data: data,
  });
}
