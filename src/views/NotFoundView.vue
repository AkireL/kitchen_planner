<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/composables/userStore';
import { onMounted } from 'vue';

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  setTimeout(() => {
    router.push(userStore.isAuthenticated() ? '/' : '/signIn');
  }, 2000);
});
</script>

<template>
  <div>
    <h1>No Found</h1>
    <p>You will be redirected in a few seconds...</p>
  </div>
</template>
