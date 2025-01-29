import { defineStore } from 'pinia'
import { ref } from 'vue'
import { recipesList as data } from '@/__fixture__/MockRecipes'
import type { Recipe } from '@/types'

export const useRecipes = defineStore('search-filters', () => {
  const recipesList = ref<Recipe[]>(data)

  const getById = (id: number) => {
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

    if (index) {
      recipesList.value[index] = data
      // TODO: update data in database
    }
  }

  const removeRecipe = (id: number) => {
    // TODO: remove data in database
    recipesList.value = recipesList.value.filter((item) => {
      return item.id != id
    });
  }

  return {
    recipesList,
    getById,
    updateRecipe,
    removeRecipe,
  }
})
