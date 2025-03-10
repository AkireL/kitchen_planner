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
  VIcon,
  VMenu,
  VListItem,
  VList,
  VDivider,
  VSpacer,
  VAutocomplete,
} from 'vuetify/components';
import HomeView from '@/views/MainLayout.vue';

import { useRouter } from 'vue-router';
import { computed, ref, onMounted, watch } from 'vue';
import {
  getDayOfDate,
  getDateByString,
  getFirstAndLastDayOfWeek,
  getNextWeek,
  getPreviousWeek,
} from '@/helpers/helpers';
import { useRecipeStore } from '@/composables/recipeStore';
import { useUserStore } from '@/composables/userStore';
import { getWeekDays } from '@/helpers/helpers';
import type { Recipe, RangeDate } from '@/types';
import { retrieveUsers } from '@/services/kitchen_api/userService';
import { sharedRecipes } from '@/services/kitchen_api/recipeService';
import { formatDate } from '@/helpers/helpers';

const router = useRouter();
const store = useRecipeStore();
const userStore = useUserStore();

const sharedUserId = ref<string | null>(null);
const sharedUser = ref<string | null>(null);

const isOpen = ref<boolean>(false);
const recipeSelected = ref<Recipe | null>(null);
const selectedDate = ref<RangeDate>({ firstDate: null, lastDate: null });
const currentDate = ref<RangeDate>({ firstDate: null, lastDate: null });
const users = ref<string[]>([]);
const isLoading = ref<boolean>(false);
const showMenu = ref<boolean>(false);

onMounted(() => {
  const { firstDay, lastDay } = getFirstAndLastDayOfWeek(new Date());
  selectedDate.value.firstDate = firstDay;
  selectedDate.value.lastDate = lastDay;

  currentDate.value.firstDate = firstDay;
  currentDate.value.lastDate = lastDay;

  store.retrieveRecipes(currentDate.value.firstDate, currentDate.value.lastDate);
});

watch(
  currentDate,
  async () => {
    store.retrieveRecipes(currentDate.value.firstDate, currentDate.value.lastDate);
  },
  { deep: true },
);

watch(sharedUserId, (value) => {
  const findUser = users.value.filter((user) => user.id === value);

  if (findUser.length === 0) {
    return;
  }

  sharedUser.value = findUser[0];
});

const recipes = computed(() => {
  if (!currentDate.value.firstDate || !currentDate.value.lastDate) {
    return;
  }

  const newData = getWeekDays(currentDate.value.firstDate, currentDate.value.lastDate);

  for (const recipe of store.recipesList) {
    if (!recipe.schedule_at) {
      continue;
    }

    const day = getDayOfDate(recipe.schedule_at);
    newData[day].date = getDateByString(recipe.schedule_at);
    newData[day].list.push(recipe);
  }

  return newData;
});

const getNextDate = () => {
  if (!currentDate.value.firstDate) {
    return;
  }

  const date = getNextWeek(currentDate.value.firstDate);

  currentDate.value.firstDate = date.start;
  currentDate.value.lastDate = date.end;
};

const getPreviousDate = () => {
  if (!currentDate.value.firstDate) {
    return;
  }

  const date = getPreviousWeek(currentDate.value.firstDate);
  currentDate.value.firstDate = date.start;
  currentDate.value.lastDate = date.end;
};

const goToDetail = (id: number | string) => {
  router.push({ name: 'recipeForm', params: { id: id } });
};

const selectedItemToRemove = (recipe: Recipe) => {
  isOpen.value = !isOpen.value;
  recipeSelected.value = recipe;
};

const removeRecipe = () => {
  if (!recipeSelected.value) {
    return;
  }

  store.removeRecipe(recipeSelected.value.id);
  isOpen.value = false;
  recipeSelected.value = null;
};

const addedRecipe = () => {
  router.push({ name: 'recipeForm' });
};

const searchUsers = (value: string) => {
  if (!value) {
    return;
  }

  isLoading.value = true;

  retrieveUsers(value)
    .then(({ data }) => {
      users.value = data.data;
    })
    .catch((error) => {
      console.error('Error retrieve users', error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const shared = () => {
  isLoading.value = true;
  if (
    !sharedUserId.value ||
    !currentDate.value.firstDate ||
    !currentDate.value.lastDate ||
    !sharedUser.value
  ) {
    isLoading.value = false;

    return;
  }

  const data = {
    user_id: sharedUserId.value,
    start_date: formatDate(currentDate.value.firstDate),
    end_date: formatDate(currentDate.value.lastDate),
  };

  sharedRecipes(data)
    .then((data) => {
      console.log('shared recipes', data);
    })
    .catch((e) => {
      console.error('Error shared recipes', e);
    })
    .finally(() => {
      isLoading.value = false;
      showMenu.value = false;
    });
};
</script>
<template>
  <HomeView>
    <v-card>
      <v-data-iterator :items="recipes" :items-per-page="3">
        <template v-slot:default="{ items }">
          <v-container class="pa-2" fluid>
            <div class="d-flex justify-space-between align-center pb-2">
              <v-btn
                @click="() => addedRecipe()"
                icon="mdi-plus"
                size="x-small"
                color="success"
                density="comfortable"
              >
              </v-btn>
              <div>
                <v-btn @click="getPreviousDate" icon="mdi-arrow-left" size="x-small"></v-btn>
                {{
                  currentDate.firstDate ? currentDate.firstDate?.toISOString()?.split('T')[0] : ''
                }}
                -
                {{ currentDate.lastDate ? currentDate.lastDate.toISOString()?.split('T')[0] : '' }}
                <v-btn @click="getNextDate" icon="mdi-arrow-right" size="x-small"> </v-btn>

                <v-menu
                  v-model="showMenu"
                  v-if="store.recipesList.length > 0"
                  :close-on-content-click="false"
                  location="end"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      icon="mdi-share-variant"
                      size="small"
                      color="success"
                      density="comfortable"
                      class="ml-2"
                      v-bind="props"
                    >
                    </v-btn> </template
                  ><v-card min-width="300">
                    <v-list>
                      <v-list-item
                        title="Compartir las receta de la semana"
                        subtitle="Busca el usuario por su 'nombre de usuario'"
                      ></v-list-item>
                    </v-list>

                    <v-divider></v-divider>

                    <v-list>
                      <v-list-item>
                        <v-autocomplete
                          v-model="sharedUserId"
                          :disabled="isLoading"
                          label="Nombre de usuario"
                          item-title="username"
                          item-value="id"
                          :items="users"
                          @update:search="
                            (e) => {
                              searchUsers(e);
                            }
                          "
                        ></v-autocomplete>
                      </v-list-item>

                      <v-list-item>
                        {{ sharedUser?.username }} -
                        <span style="font-size: small; font-style: oblique">{{
                          sharedUser?.email
                        }}</span>
                      </v-list-item>
                    </v-list>

                    <v-card-actions v-if="sharedUserId">
                      <v-spacer></v-spacer>
                      <v-btn @click="shared" :loading="isLoading"> Compartir</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </div>
            </div>
            <v-row dense>
              <v-col v-for="item in items" :key="item.raw.id" cols="auto" md="4">
                <v-card class="pb-5 overflow-auto" flat style="max-height: 500px">
                  <v-card-title :class="'day-' + item.raw.id">
                    {{ item.raw.day }} <span class="text-caption">{{ item.raw.date }} </span>
                  </v-card-title>
                  <!-- When there are not recipes -->
                  <v-card v-if="item.raw.list.length === 0">
                    <v-card-text class="p-0">
                      <v-row align="center" no-gutters>
                        <v-col class="" cols="6">Hoy no tienes recetas</v-col>
                        <v-col class="text-right" cols="6">
                          <v-icon color="warning" icon="mdi-food-off" size="40"></v-icon>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  <!-- Content or body -->
                  <v-card v-for="(recipe, index) in item.raw.list" class="mb-2" :key="index">
                    <v-card-subtitle class="pt-2">
                      <div class="d-flex justify-space-between align-center">
                        <div>
                          {{ recipe.title }}
                        </div>
                        <v-btn
                          v-if="recipe.user_id == userStore.getUser()?.id"
                          @click="() => selectedItemToRemove(recipe)"
                          icon="mdi-delete"
                          size="md"
                          color="red"
                          variant="text"
                          style="z-index: 1"
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
            <v-btn
              :disabled="page === 1"
              density="comfortable"
              icon="mdi-arrow-left"
              variant="tonal"
              rounded
              @click="prevPage"
            ></v-btn>
            <div class="mx-2 text-caption">Página {{ page }} de {{ pageCount }}</div>
            <v-btn
              :disabled="page >= pageCount"
              density="comfortable"
              icon="mdi-arrow-right"
              variant="tonal"
              rounded
              @click="nextPage"
            ></v-btn>
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
        <v-btn
          color="primary"
          @click="
            () => {
              isOpen = false;
              recipeSelected = null;
            }
          "
          >Cancelar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card:has(> .v-card-text:hover) {
  background-color: #e0e0e0;
  cursor: pointer;
}

.day-1 {
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.8), rgba(138, 43, 226, 0.8));
  background-size: 400% 400%;
  animation: gradientAnimation 10s ease infinite;
}

.day-2 {
  background: linear-gradient(45deg, rgba(0, 191, 255, 0.8), rgba(255, 99, 71, 0.8));
  background-size: 400% 400%;
  animation: gradientAnimation 8s ease infinite;
}

.day-3 {
  background: linear-gradient(60deg, rgba(34, 193, 195, 0.8), rgba(253, 187, 45, 0.8));
  background-size: 400% 400%;
  animation: gradientAnimation 12s ease infinite;
}

.day-4 {
  background: linear-gradient(120deg, rgba(255, 215, 0, 0.8), rgba(255, 69, 0, 0.8));
  background-size: 400% 400%;
  animation: gradientAnimation 9s ease infinite;
}

.day-5 {
  background: linear-gradient(90deg, rgba(255, 0, 255, 0.8), rgba(0, 255, 255, 0.8));
  background-size: 400% 400%;
  animation: gradientAnimation 6s ease infinite;
}

.day-6 {
  background: linear-gradient(135deg, rgba(144, 238, 144, 0.8), rgba(255, 69, 0, 0.8));
  background-size: 400% 400%;
  animation: gradientAnimation 11s ease infinite;
}

.day-7 {
  background: linear-gradient(180deg, rgba(255, 165, 0, 0.8), rgba(255, 20, 147, 0.8));
  background-size: 400% 400%;
  animation: gradientAnimation 7s ease infinite;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
