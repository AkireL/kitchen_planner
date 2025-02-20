import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user-session', () => {
  // const token = ref<string>();
  const isAuthenticated = ref<boolean>(true);

  return {
    isAuthenticated,
  }
})
