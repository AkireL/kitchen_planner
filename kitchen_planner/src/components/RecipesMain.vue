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
  VDialog,
  VCardActions,
} from 'vuetify/components'
import HomeView from '@/views/HomeView.vue';

import { useRouter } from 'vue-router'
import { computed, ref, onMounted, watch } from "vue"
import { getDayOfDate, getDateByString, getFirstAndLastDayOfWeek, getNextWeek, getPreviousWeek } from "@/helpers/helpers"
import { useRecipeStore } from "@/composables/recipeStore"
import { initData } from "@/helpers/days"
import { getColor } from "@/helpers/color"
import type { Recipe, RangeDate } from '@/types'

const router = useRouter();
const store = useRecipeStore();

const isOpen = ref<boolean>(false);
const recipeSelected = ref<Recipe | null>(null);
const selectedDate = ref<RangeDate>({ firstDate: null, lastDate: null });
const currentDate = ref<RangeDate>({ firstDate: null, lastDate: null });

onMounted(() => {
  const { firstDay, lastDay } = getFirstAndLastDayOfWeek(new Date());
  selectedDate.value.firstDate = firstDay;
  selectedDate.value.lastDate = lastDay;

  currentDate.value.firstDate = firstDay;
  currentDate.value.lastDate = lastDay;

  store.retrieveRecipes(currentDate.value.firstDate, currentDate.value.lastDate);
});

watch((currentDate), async () => {
  store.retrieveRecipes(currentDate.value.firstDate, currentDate.value.lastDate);
}, { deep: true });

const recipes = computed(() => {
  const newData = initData();

  for (const recipe of store.recipesList) {
    if (!recipe.schedule_at) {
      continue;
    }

    const day = getDayOfDate(recipe.schedule_at)
    newData[day].date = getDateByString(recipe.schedule_at)
    newData[day].list.push(recipe)
  }

  return newData;
});

const getNextDate = () => {
  if (!currentDate.value.firstDate) {
    return;
  }

  const date = getNextWeek(currentDate.value.firstDate)

  currentDate.value.firstDate = date.start
  currentDate.value.lastDate = date.end
}

const getPreviousDate = () => {
  if (!currentDate.value.firstDate) {
    return;
  }

  const date = getPreviousWeek(currentDate.value.firstDate)
  currentDate.value.firstDate = date.start
  currentDate.value.lastDate = date.end
}

const goToDetail = (id: number) => {
  router.push({ name: 'recipeForm', params: { id: id } });
}

const selectedItemToRemove = (recipe: Recipe) => {
  isOpen.value = !isOpen.value;
  recipeSelected.value = recipe;
}

const removeRecipe = () => {
  if (!recipeSelected.value) {
    return;
  }

  store.removeRecipe(recipeSelected.value.id);
  isOpen.value = false;
  recipeSelected.value = null;
}

const addedRecipe = () => {
  router.push({ name: 'recipeForm' });
}
</script>
<template>
  <HomeView>
    <v-card>
      <v-data-iterator :items="recipes" :items-per-page="3">
        <template v-slot:default="{ items }">
          <v-container class="pa-2" fluid>
            <div class="d-flex justify-space-between align-center pb-2">
              <v-btn @click="() => addedRecipe()" icon="mdi-plus" size="x-small" color="success" density="comfortable">
              </v-btn>
              <div>
                <v-btn @click="getPreviousDate" icon="mdi-arrow-left" size="x-small"></v-btn>
                {{ currentDate.firstDate ? currentDate.firstDate?.toISOString()?.split('T')[0] : "" }} - {{
                  currentDate.lastDate ? currentDate.lastDate.toISOString()?.split('T')[0] : "" }}
                <v-btn @click="getNextDate" icon="mdi-arrow-right" size="x-small">
                </v-btn>
              </div>
            </div>
            <v-row dense>
              <v-col v-for="item in items" :key="item.title" cols="auto" md="4">
                <v-card class="pb-5 overflow-auto" flat style=" max-height: 500px;">
                  <v-card-title :class="'bg-' + getColor(item.raw.id)">
                    {{ item.raw.day }} <span class="text-caption">{{ item.raw.date }} </span>
                  </v-card-title>
                  <!-- Content or body -->
                  <v-card v-for="(recipe, index) in item.raw.list" class="mb-2" :key="index">
                    <v-card-subtitle class="pt-2">
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          {{ recipe.title }}
                        </div>
                        <v-btn @click="() => selectedItemToRemove(recipe)" icon="mdi-delete" size="md" color="red"
                          variant="text" style="z-index: 1;"></v-btn>
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
            <v-btn :disabled="page >= pageCount" density="comfortable" icon="mdi-arrow-right" variant="tonal" rounded
              @click="nextPage"></v-btn>
          </div>
        </template>
      </v-data-iterator>
    </v-card>
  </HomeView>

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
