import { defineStore } from 'pinia'
import { ref } from 'vue'
import { recipesList as data } from '@/__fixture__/MockRecipes'
import type { Recipe } from '@/types';
import { v4 as uuid } from 'uuid';
import { createRecipesService, deleteRecipesService, retrieveRecipesService, updateRecipesService } from '@/services/kitchen_api_service'
import { formatDate } from '@/helpers/helpers';

export const useRecipeStore = defineStore('search-filters', () => {
  const recipesList = ref<Recipe[]>([])

  const retrieveRecipes = (startDate:Date | null = null, endDate:Date | null = null) => {

    const filters = {};
    if (startDate != null && endDate != null) {
        filters['start_date'] = formatDate(startDate);
        filters['end_date'] = formatDate(endDate);
    }

    retrieveRecipesService(filters)
      .then(function ({data}) {
        recipesList.value= data.data;
      })
      .catch(() => {
        recipesList.value= [];
      });
  }

  const getById = (id: number | string) => {
    const recipeTmp = recipesList.value.filter((item) => {
      return item.id == id
    })

    if (recipeTmp) {
      if (recipeTmp[0].schedule_at) {
        const [year, month, day] = recipeTmp[0].schedule_at.split('-')
        const formattedDate = `${year}-${month}-${day}`
        recipeTmp[0].schedule_at = formattedDate
        return recipeTmp[0]
      }

      const date = new Date().toISOString().slice(0, 10)
      const [year, month, day] = date.split('-')
      const formattedDate = `${year}-${month}-${day}`
      recipeTmp[0].schedule_at = formattedDate

      return recipeTmp[0]
    }
  }

  const updateRecipe = (data: Recipe) => {
    const index = recipesList.value.findIndex((item) => {
      return item.id == data.id
    })

    if (index> -1) {
      recipesList.value[index] = data

      updateRecipesService(data.id, data)
        .then(function(response){
          console.log("UPDATE", response);
        })
        .catch(function(error){
          console.log(error);
        });
    }
  }

  const removeRecipe = (id: number | string) => {
    recipesList.value = recipesList.value.filter((item) => {
      return item.id != id
    });

    deleteRecipesService(id)
      .then(function(data){
        console.log("DELETE", data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const addRecipe =  (newItem: Recipe) => {
      newItem.id = uuid();
      recipesList.value.push(newItem);

      const item = {...newItem};

      if(newItem.preparation.length <=0) {
        delete item["preparation"];
      }

      createRecipesService(item)
        .then(function(response) {
          console.log("ADD RECIPE", response)
        })
        .catch(function (error){
          console.log(error);
        });
  }

  return {
    recipesList,
    retrieveRecipes,
    getById,
    addRecipe,
    updateRecipe,
    removeRecipe,
  }
})
