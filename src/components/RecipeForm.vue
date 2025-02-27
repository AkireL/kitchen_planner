<script setup lang="ts">
import {
  VDivider,
  VCard,
  VForm,
  VTextField,
  VContainer,
  VBtn,
  VRow,
  VCol,
} from 'vuetify/components';
import HomeView from '@/views/MainLayout.vue';

import { ref } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRecipeStore } from '@/composables/recipeStore';
import { getTodayDate } from '@/helpers/helpers';
import type { Recipe } from '@/types';
import Ingredients from '@/components/Ingredients.vue';

const props = defineProps<{
  id?: string | null;
}>();

const store = useRecipeStore();
const router = useRouter();

const recipe = ref<Recipe>({
  id: 0,
  title: '',
  duration: '',
  schedule_at: getTodayDate(),
  ingredients: [],
  preparation: '',
});

onMounted(() => {
  if (props.id) {
    recipe.value = { ...store.getById(props.id) } as Recipe;
  }
});

const rules = (value: string | number | Date) => !!value || 'Este campo es obligatorio';

const loading = ref<boolean>(false);

const submit = async () => {
  if (!recipe.value.title || !recipe.value.schedule_at) {
    return 0;
  }

  loading.value = true;

  if (props.id) {
    store.updateRecipe(recipe.value);
    loading.value = false;
    router.push({ name: 'homeRecipe' });

    return;
  }

  store.addRecipe(recipe.value);
  loading.value = false;
  router.push({ name: 'homeRecipe' });
};

const addMoreIngredients = () => {
  if (recipe.value.ingredients.length <= 50) {
    recipe.value.ingredients.push('');
    return;
  }
  alert('No more items');
};
</script>
<template>
  <HomeView>
    <v-btn
      @click="() => $router.push({ name: 'homeRecipe' })"
      icon="mdi-home"
      color="primary"
      class="m-2"
      size="x-small"
      density="comfortable"
    >
    </v-btn>
    <v-card>
      <v-form @submit.prevent="submit">
        <v-container>
          <v-row>
            <v-col cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Nombre de la receta</div>
              <v-text-field
                v-model="recipe.title"
                :rules="[rules]"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Fecha de preparación</div>
              <v-text-field
                v-model="recipe.schedule_at"
                :rules="[rules]"
                density="compact"
                type="date"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <div class="text-subtitle-1 text-medium-emphasis p-0">
                Ingredientes
                <v-btn
                  @click="addMoreIngredients"
                  icon="mdi-plus"
                  size="x-small"
                  density="comfortable"
                ></v-btn>
              </div>
              <Ingredients v-model="recipe.ingredients" />
            </v-col>
            <v-col cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">Preparación</div>
              <v-text-field v-model="recipe.preparation" required density="compact"></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row justify="end">
            <v-col cols="2">
              <v-btn
                :loading="loading"
                class="mt-2"
                text="Guardar"
                type="submit"
                color="success"
                block
              ></v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </HomeView>
</template>
