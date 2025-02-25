import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user-session', () => {
  const token = ref<string>();
  const isAuthenticated = ref<boolean>(false);
  const user = ref(null);

  function getToken() {
    return token.value;
  }

  function setToken(jwt: string) {
    token.value = jwt;
  }

  function setUser(value) {
    user.value = value;
    isAuthenticated.value = true;
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
  };
});
