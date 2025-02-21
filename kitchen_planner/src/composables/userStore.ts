import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user-session', () => {
  const token = ref<string>();
  const isAuthenticated = ref<boolean>(true);

  function getToken() {
    return token.value;
  }

  return {
    getToken,
    isAuthenticated,
  };
});
