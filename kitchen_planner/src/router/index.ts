import { createRouter, createWebHistory } from 'vue-router'
import DetailRecipe from '@/components/DetailRecipe.vue'
import RecipesMain from '@/components/RecipesMain.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RecipesMain,
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: DetailRecipe,
    },
  ],
})

export default router
