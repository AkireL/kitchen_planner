import { defineStore } from 'pinia'
import { ref } from 'vue'
import { recipesList as data } from '@/__fixture__/MockRecipes'
import type { Recipe } from '@/types'
import { v4 as uuid } from 'uuid';

export const useRecipes = defineStore('search-filters', () => {
  const recipesList = ref<Recipe[]>([])

  const retrieveRecipes = (startDate:Date | null = null, endDate:Date | null = null) => {

    recipesList.value = data
    return data;
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
      // TODO: update data in database
    }
  }

  const removeRecipe = (id: number | string) => {
    recipesList.value = recipesList.value.filter((item) => {
      return item.id != id
    });
  }

  const addRecipe =  (newItem: Recipe) => {
      newItem.id = uuid();
      recipesList.value.push(newItem);
      // TODO: store in database
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
