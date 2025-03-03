import type { AuthInterface } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user-session', () => {
  const token = ref<string | null>(null);
  const user = ref<AuthInterface | null>(null);

  function isAuthenticated() {
    if (token.value && token.value.length > 0) {
      return true;
    }

    const currentToken = localStorage.getItem('kitchen');
    const currentUser = localStorage.getItem('kitchen_user') || '{}';

    if (!currentToken || !currentUser) {
      return false;
    }

    token.value = currentToken;
    user.value = JSON.parse(currentUser);

    return true;
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('kitchen');
    localStorage.removeItem('kitchen_user');
  }

  function getToken() {
    return token.value;
  }

  function setToken(jwt: string) {
    localStorage.setItem('kitchen', jwt);
    token.value = jwt;
  }

  function setUser(value: AuthInterface) {
    user.value = value;
    localStorage.setItem('kitchen_user', JSON.stringify(value));
  }

  function getUser() {
    return user.value;
  }

  return {
    getToken,
    setToken,
    isAuthenticated,
    setUser,
    getUser,
    logout,
  };
});
