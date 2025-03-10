import type { Recipe, RecipeFiltersParams, sharedRecipesInterface } from '@/types';
import { initInstance } from './client';

export function retrieveRecipesService(params: RecipeFiltersParams | object = {}) {
  return initInstance().get('/recipes', {
    params: params,
  });
}

export function updateRecipesService(id: number | string, data: Recipe) {
  return initInstance()({
    method: 'put',
    url: '/recipes/' + id,
    data: data,
  });
}

export function deleteRecipesService(id: string | number) {
  return initInstance().delete('/recipes/' + id);
}

export function createRecipesService(data: Recipe) {
  return initInstance().post('/recipes', data);
}

export function sharedRecipes(data: sharedRecipesInterface) {
  return initInstance().post('/recipes/share', data);
}
