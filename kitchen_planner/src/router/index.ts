import { createRouter, createWebHistory } from 'vue-router';
import RecipesMain from '@/components/RecipesMain.vue';
import RecipeForm from '@/components/RecipeForm.vue';
import { useUserStore } from '@/composables/userStore';
import LogInView from '@/views/LogInView.vue';
import SignInView from '@/views/SignInView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import PresentationView from '@/views/PresentationView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PresentationView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/logIn',
      name: 'logIn',
      component: LogInView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: SignInView,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/recipes',
      name: 'homeRecipe',
      component: RecipesMain,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/recipe/:id?',
      name: 'recipeForm',
      props: true,
      component: RecipeForm,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isAuthenticated()) {
    next('/signIn');
    return;
  }
  next();
});

export default router;
