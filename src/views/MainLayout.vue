<script setup lang="ts">
import { useUserStore } from '@/composables/userStore';
import { useRouter } from 'vue-router';
import {
  VAppBar,
  VAppBarTitle,
  VList,
  VListItem,
  VMain,
  VLayout,
  VContainer,
  VBtn,
  VMenu,
  VAvatar,
  VListItemTitle,
  VIcon,
  VCard,
} from 'vuetify/components';

const store = useUserStore();
const router = useRouter();

function logout() {
  store.logout();
  router.push({ name: 'logIn' });
}
</script>

<template>
  <v-layout class="">
    <v-app-bar :elevation="0">
      <v-app-bar-title>
        <div class="d-flex align-center">
          <a href="/recipes" class="mr-2"><v-icon icon="mdi-home"></v-icon></a>
          <span>Recetas de cocina</span>
        </div>
      </v-app-bar-title>
      <v-list>
        <v-list-item :subtitle="store.getUser()?.email" :title="store.getUser()?.username">
          <template v-slot:prepend>
            <v-avatar color="light-green-darken-3">
              <v-icon icon="mdi-home"></v-icon>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"> </v-btn>
        </template>
        <v-card class="mx-auto" max-width="300">
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title>
                <v-btn color="primary" @click="logout"> Log Out </v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-main class="d-flex align-center justify-center" style="min-height: 301px">
      <v-container class="">
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>
<style scoped>
.container {
  display: grid;
  place-items: center; /* centra vertical y horizontal */
}
</style>
