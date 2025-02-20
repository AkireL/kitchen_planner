import { createRouter, createWebHistory } from 'vue-router';
import RecipesMain from '@/components/RecipesMain.vue';
import RecipeForm from '@/components/RecipeForm.vue';
import { useUserStore } from '@/composables/userStore';
import PresentationView from '@/views/PresentationView.vue';
import { storeToRefs } from 'pinia';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PresentationView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/recipes',
      name: 'homeRecipe',
      component: RecipesMain,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/recipe/:id?',
      name: 'recipeForm',
      props: true,
      component: RecipeForm,
      meta: {
        requiresAuth: true
      }
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const { isAuthenticated } = storeToRefs(userStore);

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/')
    return;
  }
  next();
})

export default router;
