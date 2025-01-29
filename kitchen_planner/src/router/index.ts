import { createRouter, createWebHistory } from 'vue-router'
import RecipesMain from '@/components/RecipesMain.vue'
import CreateRecipe from '@/components/CreateRecipe.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RecipesMain,
    },
    {
      path: '/recipe/:id?',
      name: 'recipeForm',
      props: true,
      component: CreateRecipe,
    },
  ],
})

export default router
