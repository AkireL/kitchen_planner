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
import { useRouter } from 'vue-router'
import { useRecipes } from "@/composables/store"
import { getTodayDate } from "@/helpers/helpers"
import type { Recipe } from '@/types';
import Ingredients from "@/components/Ingredients.vue"

const props = defineProps<{
  id?: string | null,
}>();

const store = useRecipes();
const router = useRouter();

const recipe = ref<Recipe>({
  id: 0,
  title: "",
  description: "",
  schedule_at: getTodayDate(),
  ingredients: [],
  preparation: "",
});

onMounted(() => {
  if (props.id) {
    recipe.value = {...store.getById(props.id)}
  }
});

const rules = (value) => !!value || "Este campo es obligatorio";

const loading = ref<boolean>(false);

const submit = async (event) => {
  if (!recipe.value.title || !recipe.value.schedule_at) {
    return 0;
  }

  loading.value = true;

  if (props.id) {
    store.updateRecipe(recipe.value);
    loading.value = false;
    router.push({ name: 'home'});
    return;
  }
  await event;
  store.addRecipe(recipe.value);
  loading.value = false;
  router.push({ name: 'home'});
}

const addMoreIngredients = () => {
  if (recipe.value.ingredients.length <= 50) {
    recipe.value.ingredients.push("");
    return;
  }
  alert("No more items");
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
        <v-btn
          @click="() => $router.push({ name: 'home' })"
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
                  <Ingredients
                    v-model="recipe.ingredients"
                    />
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
      </v-container>
    </v-main>
  </v-layout>
</template>
