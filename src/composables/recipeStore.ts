import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Recipe, RecipeFiltersParams } from '@/types';
import {
  createRecipesService,
  deleteRecipesService,
  retrieveRecipesService,
  updateRecipesService,
} from '@/services/kitchen_api/recipeService';
import { formatDate } from '@/helpers/helpers';
import { useRouter } from 'vue-router';
import { KitchenAPIException } from '@/services/kitchen_api/kitchen_api_exception';

export const useRecipeStore = defineStore('search-filters', () => {
  const recipesList = ref<Recipe[]>([]);

  const router = useRouter();

  const retrieveRecipes = (startDate: Date | null = null, endDate: Date | null = null) => {
    const filters: RecipeFiltersParams = {
      start_date: '',
      end_date: '',
    };

    if (startDate != null && endDate != null) {
      filters['start_date'] = formatDate(startDate);
      filters['end_date'] = formatDate(endDate);
    }

    retrieveRecipesService(filters)
      .then(function ({ data }) {
        recipesList.value = data.data;
      })
      .catch((error) => {
        recipesList.value = [];

        if (error instanceof KitchenAPIException && error.code === 401) {
          router.push({ name: 'logIn' });
        }
      });
  };

  const getById = (id: number | string) => {
    const recipeTmp = recipesList.value.filter((item) => {
      return item.id == id;
    });

    if (recipeTmp) {
      if (recipeTmp[0].schedule_at) {
        const [year, month, day] = recipeTmp[0].schedule_at.split('-');
        const formattedDate = `${year}-${month}-${day}`;
        recipeTmp[0].schedule_at = formattedDate;
        return recipeTmp[0];
      }

      const date = new Date().toISOString().slice(0, 10);
      const [year, month, day] = date.split('-');
      const formattedDate = `${year}-${month}-${day}`;
      recipeTmp[0].schedule_at = formattedDate;

      return recipeTmp[0];
    }
  };

  const updateRecipe = (data: Recipe) => {
    const index = recipesList.value.findIndex((item) => {
      return item.id == data.id;
    });

    if (index > -1) {
      updateRecipesService(data.id, data)
        .then(function () {
          recipesList.value[index] = data;
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const removeRecipe = (id: number | string) => {
    recipesList.value = recipesList.value.filter((item) => {
      return item.id != id;
    });

    deleteRecipesService(id)
      .then(function (data) {
        console.log('DELETE', data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addRecipe = (newItem: Recipe) => {
    const item = { ...newItem };

    if (!newItem.preparation || newItem.preparation.length <= 0) {
      delete item['preparation'];
    }

    createRecipesService(item)
      .then(function ({ data: { data } }) {
        recipesList.value.push(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return {
    recipesList,
    retrieveRecipes,
    getById,
    addRecipe,
    updateRecipe,
    removeRecipe,
  };
});
