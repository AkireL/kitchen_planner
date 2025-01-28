<script setup lang="ts">
import {
  VDivider,
  VAppBar,
  VNavigationDrawer,
  VList,
  VListItem,
  VMain,
  VLayout,
  VCard,
  VForm,
  VTextField,
  VContainer,
  VBtn,
  VRow,
  VCol
} from 'vuetify/components'
import { ref } from "vue"
import { onMounted } from 'vue'
import { useRecipes } from "@/composables/store"
import type { Recipe } from '@/types';

const props = defineProps<{
  id: string
}>()

const store = useRecipes();

const recipe = ref<Recipe>({
  id: 0,
  title: "",
  description: "",
  ingredients: [],
  preparation: ""
});

const loading = ref<boolean>(false);

onMounted(() => {
  recipe.value = {...store.getById(props.id)}
});

const submit = async (event) => {
  console.log(event);
  loading.value = true;
  await event;
  store.updateRecipe(recipe.value);
  loading.value = false;
}
</script>
<template>
  <v-layout class="rounded rounded-md">
    <v-app-bar title="Application bar"></v-app-bar>
    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      <v-container>
        <v-btn @click="() => $router.push({ name: 'home' })" icon="mdi-home" color="primary" class="m-2" size="x-small">
        </v-btn>
        <v-card>
          <v-form @submit.prevent="submit">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <div class="text-subtitle-1 text-medium-emphasis">Nombre de la receta</div>
                  <v-text-field v-model="recipe.title" required density="compact"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <div class="text-subtitle-1 text-medium-emphasis">Fecha de preparación</div>
                  <v-text-field v-model="recipe.schedule_at" required density="compact" type="date">
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <div class="text-subtitle-1 text-medium-emphasis p-0">Ingredientes</div>
                  <v-list style="width: 50%;" class="p-0">
                    <v-list-item v-for="(ingredient, index) in recipe.ingredients" :key="index" class="p-0 m-0">
                      <v-text-field v-model="recipe.ingredients[index]" class="p-0 m-0"
                        density="compact"></v-text-field>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12">
                  <div class="text-subtitle-1 text-medium-emphasis">Preparación</div>
                  <v-text-field v-model="recipe.preparation" required density="compact"></v-text-field>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row justify="end">
              <v-col cols="2">
                  <v-btn :loading="loading" class="mt-2" text="Submit" type="submit" color="success" block></v-btn>
                </v-col>
                </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-container>
    </v-main>
  </v-layout>
</template>
