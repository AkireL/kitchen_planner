import { createRouter, createWebHistory } from 'vue-router';
import RecipesMain from '@/components/RecipesMain.vue';
import RecipeForm from '@/components/RecipeForm.vue';
import { useUserStore } from '@/composables/userStore';
import { storeToRefs } from 'pinia';
import LogInView from '@/views/LogInVew.vue';
import SignInView from '@/views/SignInView.vue';
import PresentationView from '@/views/PresentationView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PresentationView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/logIn',
      name: 'logIn',
      component: LogInView,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: SignInView,
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
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore();
        const { isAuthenticated } = storeToRefs(userStore);

        if (isAuthenticated.value) {
          next('/');
        } else {
          next('/signIn');
        }
      }
    }
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const { isAuthenticated } = storeToRefs(userStore);

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/signIn');
    return;
  }
  next();
})

export default router;
