<script setup lang="ts">
import {
  VCard,
  VCardTitle,
  VCardText,
  VBtn,
  VContainer,
  VDialog,
  VCardActions,
  VIcon,
  VChip,
  VList,
  VListItem,
  VDivider,
  VAvatar,
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
  truncateText,
} from '@/helpers/helpers';
import { useRecipeStore } from '@/composables/recipeStore';
import { useUserStore } from '@/composables/userStore';
import { getWeekDays, getDay } from '@/helpers/helpers';
import type { Recipe, RangeDate } from '@/types';

const router = useRouter();
const store = useRecipeStore();
const userStore = useUserStore();

const isOpen = ref<boolean>(false);
const recipeSelected = ref<Recipe | null>(null);
const selectedDate = ref<RangeDate>({ firstDate: null, lastDate: null });
const currentDate = ref<RangeDate>({ firstDate: null, lastDate: null });
const preparedRecipes = ref(new Set<string>());
const expandedDays = ref<Set<number>>(new Set());

const toggleDay = (dayId: number) => {
  if (expandedDays.value.has(dayId)) {
    expandedDays.value.delete(dayId);
  } else {
    expandedDays.value.add(dayId);
  }
};

const isDayExpanded = (dayId: number) => {
  return expandedDays.value.has(dayId);
};

onMounted(() => {
  const { firstDay, lastDay } = getFirstAndLastDayOfWeek(new Date());
  selectedDate.value.firstDate = firstDay;
  selectedDate.value.lastDate = lastDay;

  currentDate.value.firstDate = firstDay;
  currentDate.value.lastDate = lastDay;

  store.retrieveRecipes(currentDate.value.firstDate, currentDate.value.lastDate);

  // Expand today's day by default
  const todayDay = new Date().getDay();
  const dayIndex = todayDay === 0 ? 7 : todayDay;
  expandedDays.value.add(dayIndex);
});

watch(
  currentDate,
  async () => {
    store.retrieveRecipes(currentDate.value.firstDate, currentDate.value.lastDate);
  },
  { deep: true },
);

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

const today = computed(() => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
});

const isToday = (dateStr: string | null) => {
  if (!dateStr) return false;
  return dateStr === today.value;
};

const isPrepared = (recipeId: number | string) => {
  return preparedRecipes.value.has(String(recipeId));
};

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
  isOpen.value = true;
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
</script>

<template>
  <HomeView>
    <div class="d-flex ga-3 bg-grey-lighten-4 py-2 pl-1">
      <v-avatar color="orange" size="30" class="mb-0">
        <v-icon icon="mdi-chef-hat" size="20" color="white" />
      </v-avatar>
      <p class="text-h6 font-weight-black">Mis recetas</p>
    </div>
    <v-container class="pa-2 pa-md-4" fluid>
      <!-- FAB for mobile -->
      <v-btn
        class="week-fab d-md-none"
        color="primary"
        icon="mdi-plus"
        size="large"
        style="bottom: 80px; right: 16px; z-index: 100"
        @click="addedRecipe"
      />

      <!-- Day sections -->
      <v-card
        v-for="item in recipes"
        :key="item.id"
        class="day-card mb-4"
        :class="{ 'day-today': isToday(item.date) }"
        elevation="0"
      >
        <!-- Day header -->
        <v-card-title class="day-header py-2" @click="toggleDay(item.id)">
          <div class="d-flex align-center flex-wrap flex-md-nowrap gap-2">
            <v-icon
              size="small"
              :class="{ 'rotate-90': isDayExpanded(item.id) || isToday(item.date) }"
              class="expand-icon mr-1"
            >
              mdi-chevron-right
            </v-icon>

            <span class="text-body-2 mr-2" :class="{ 'text-today': isToday(item.date) }">
              {{ item.day }}
            </span>
            <span class="text-h4 text-grey-darken-1" :class="{ 'text-today': isToday(item.date) }">
              {{ getDay(item.date) }}
            </span>
            <v-chip v-if="isToday(item.date)" class="today-chip" size="x-small" color="#1D6A54">
              hoy
            </v-chip>
          </div>

          <v-btn
            class="d-none d-md-inline-flex"
            variant="outlined"
            color="primary"
            size="small"
            @click.stop="addedRecipe"
          >
            <v-icon start>mdi-plus</v-icon>
            añadir receta
          </v-btn>
        </v-card-title>

        <!-- Divider -->
        <v-divider class="day-divider" :class="{ 'divider-today': isToday(item.date) }" />

        <!-- Recipes list -->
        <v-expand-transition>
          <v-card-text v-show="isDayExpanded(item.id) || isToday(item.date)" class="pa-0">
            <v-list v-if="item.list.length > 0" density="compact">
              <v-list-item
                v-for="recipe in item.list"
                :key="recipe.id"
                class="recipe-item px-5 border-b-sm"
                :class="{ 'recipe-prepared': isPrepared(recipe.id) }"
                @click="goToDetail(recipe.id)"
              >
                <v-list-item-title
                  class="recipe-title text-subtitle-1"
                  :class="{ 'text-done': isPrepared(recipe.id) }"
                >
                  <p class="font-weight-semibold">{{ recipe.title }}</p>
                  <p class="text-caption pl-3">{{ truncateText(recipe.preparation) }}</p>
                </v-list-item-title>

                <template #append>
                  <v-chip v-if="recipe.duration" size="x-small" variant="outlined" class="mr-2">
                    {{ recipe.duration }}
                  </v-chip>

                  <v-btn
                    v-if="recipe.user_id == userStore.getUser()?.id"
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click.stop="selectedItemToRemove(recipe)"
                  />
                </template>
              </v-list-item>
            </v-list>

            <!-- Empty state -->
            <v-card-text
              v-else
              class="text-center pa-4"
              :class="{ 'text-today': isToday(item.date) }"
            >
              <span class="text-medium-emphasis">Sin recetas</span>
            </v-card-text>
          </v-card-text>
        </v-expand-transition>
      </v-card>
    </v-container>
  </HomeView>

  <!-- Modal -->
  <v-dialog v-model="isOpen" width="auto">
    <v-card title="Confirmación">
      <v-card-text>¿Desea eliminar? </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="flat" @click="removeRecipe">Aceptar</v-btn>
        <v-btn
          color="primary"
          variant="text"
          @click="
            () => {
              isOpen = false;
              recipeSelected = null;
            }
          "
        >
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.day-today {
  border-color: #1d6a54;
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  cursor: pointer;
}

.expand-icon {
  transition: transform 0.2s ease;
}

.rotate-90 {
  transform: rotate(90deg);
}

.day-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.text-today {
  color: #1d6a54 !important;
  font-weight: 500;
}

.today-chip {
  color: white !important;
}

.day-divider {
  opacity: 0.2;
}

.divider-today {
  height: 3px;
  opacity: 1;
  background-color: #1d6a54;
}

.recipe-item {
  min-height: 48px;
  border-radius: 8px;
}

.recipe-prepared {
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.recipe-title {
  font-size: 0.95rem;
}

.text-done {
  text-decoration: line-through;
  color: rgb(var(--v-theme-on-surface)) !important;
  opacity: 0.7;
}

.week-fab {
  position: fixed;
  bottom: 80px;
  right: 16px;
  z-index: 100;
}
</style>
