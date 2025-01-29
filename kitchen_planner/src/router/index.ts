import { createRouter, createWebHistory } from 'vue-router'
import RecipesMain from '@/components/RecipesMain.vue'
import RecipeForm from '@/components/RecipeForm.vue'

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
      component: RecipeForm,
    },
  ],
})

export default router
