import { defineStore } from 'pinia'
import { recipesList as data } from '@/__fixture__/MockRecipes'

export const useRecipes = defineStore('search-filters', () => {
  const recipesList = data

  const getById = (id: number)=> {
    const recipeTmp = recipesList.filter(item => {
      return item.id == id
    });

    if (recipeTmp) {
      if (recipeTmp[0].schedule_at) {
        const [day, month, year] = recipeTmp[0].schedule_at.split("-");
        const formattedDate = `${year}-${month}-${day}`;
        recipeTmp[0].schedule_at = formattedDate
        return recipeTmp[0];
      }

      const date = new Date().toISOString().slice(0, 10)
      const [year, month, day] = date.split("-");
      const formattedDate = `${year}-${month}-${day}`;
        recipeTmp[0].schedule_at = formattedDate
        return recipeTmp[0];
    }
  }
  return {
    recipesList,
    getById
  }
})
