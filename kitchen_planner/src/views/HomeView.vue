<script setup lang="ts">
import {
  VAppBar,
  VNavigationDrawer,
  VList,
  VListItem,
  VMain,
  VLayout,
  VContainer,
} from 'vuetify/components';
</script>

<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar title="Recetas de cocina"></v-app-bar>
    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Menu"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="d-flex align-center justify-center" style="min-height: 300px">
      <v-container class="w-100">
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>
