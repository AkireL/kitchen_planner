<script setup lang="ts">
import {
  VCard,
  VCardTitle,
  VCardSubtitle,
  VCardText,
  VDataIterator,
  VBtn,
  VRow,
  VCol,
  VContainer,
  VAppBar,
  VNavigationDrawer,
  VList,
  VListItem,
  VMain,
  VLayout,
  VDialog,
  VCardActions,
} from 'vuetify/components'
import { useRouter } from 'vue-router'
import { computed, ref } from "vue"
import { getDayOfDate } from "@/helpers/helpers"
import { useRecipes } from "@/composables/store"
import { initData } from "@/helpers/days"
import { getColor } from "@/helpers/color"

const router = useRouter();
const store = useRecipes();

const isOpen = ref<boolean>(false);
const recipeSelected = ref<Recipe | null>(null);

const recipes = computed(() => {
const newData = initData();

  for (const recipe of store.recipesList) {
    if (! recipe.schedule_at) {
      continue;
    }

    const day = getDayOfDate(recipe.schedule_at)
    newData[day].list.push(recipe)
  }

  return newData;
});

const goToDetail = (id: number) => {
  router.push({ name: 'detail', params: { id: id }});
}

const selectedItemToRemove = (recipe: Recipe) => {
  isOpen.value = ! isOpen.value;
  recipeSelected.value = recipe;
}

const removeRecipe = () => {
  store.removeRecipe(recipeSelected.value.id);
  isOpen.value = false;
  recipeSelected.value = null;
}
</script>

<template> <v-layout class="rounded rounded-md">
    <v-app-bar title="Recetas de cocina"></v-app-bar>
    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Menu"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
      <v-container class="w-100">
        <v-card>
          <v-data-iterator :items="recipes" :items-per-page="3">
            <template v-slot:default="{ items }">
              <v-container class="pa-2" fluid>
                <v-row dense>
                  <v-col v-for="item in items" :key="item.title" cols="auto" md="4">
                    <v-card class="pb-5 overflow-auto" border flat style=" max-height: 500px;" >
                      <v-card-title :class="'bg-' + getColor(item.raw.id)">
                        {{ item.raw.day }}
                      </v-card-title>
                      <!-- Content or body -->
                      <v-card v-for="(recipe, index) in item.raw.list" class="mb-2" :key="index">
                        <v-card-subtitle class="pt-2">
                          <div class="d-flex justify-space-between align-center">
                            <div>
                              {{ recipe.title }}
                            </div>
                            <v-btn
                              @click="() => selectedItemToRemove(recipe)"
                              icon="mdi-delete"
                              size="md"
                              color="red"
                              variant="text"
                              style="z-index: 1;"
                            ></v-btn>
                          </div>
                        </v-card-subtitle>
                        <v-card-text @click="() => goToDetail(recipe.id)">
                          <div class="text-truncate">
                            {{ recipe.preparation }}
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </template>

            <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
              <div class="d-flex align-center justify-center pa-4">
                <v-btn :disabled="page === 1" density="comfortable" icon="mdi-arrow-left" variant="tonal" rounded
                  @click="prevPage"></v-btn>

                <div class="mx-2 text-caption">
                  Página {{ page }} de {{ pageCount }}
                </div>

                <v-btn :disabled="page >= pageCount" density="comfortable" icon="mdi-arrow-right" variant="tonal"
                  rounded @click="nextPage"></v-btn>
              </div>
            </template>
          </v-data-iterator>
        </v-card>
      </v-container>
    </v-main>
  </v-layout>

  <!-- Modal -->
  <v-dialog v-model="isOpen" width="auto">
        <v-card title="Confirmación">
            <v-card-text>¿Desea eliminar? </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="removeRecipe">Aceptar</v-btn>
                <v-btn color="primary" @click="() => { isOpen = false; recipeSelected = null }">Cancelar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.v-card:has(>.v-card-text:hover) {
  background-color: #E0E0E0;
  cursor: pointer;
}
</style>
