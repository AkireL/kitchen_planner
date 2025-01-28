<script setup lang="ts">
import {
  VAppBar,
  VNavigationDrawer,
  VList,
  VListSubheader,
  VListItem,
  VMain,
  VLayout,
  VCard,
  VForm,
  VTextField,
  VContainer,
  VBtn,
} from 'vuetify/components'
import { ref } from "vue"
import { onMounted } from 'vue'
import { recipesList } from "@/__fixture__/MockRecipes"

const props = defineProps<{
  id: number
  }>()

const recipe = ref({
  id: 0,
  title: "",
  description: "",
  ingredients: [],
  preparation: ""
});

onMounted(() => {
  const recipeTmp = recipesList.filter(item => {
    return item.id == props.id
  });

  if (recipeTmp) {
    recipe.value = recipeTmp[0];
  }
})
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
                @click="() => $router.push({ name: 'home'})"
                icon="mdi-home"
                color="primary"
                class="m-2"
                size="x-small"
            >
            </v-btn>
        <v-card>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <div class="text-subtitle-1 text-medium-emphasis">Nombre de la receta</div>
                  <v-text-field
                    v-model="recipe.title"
                    :counter="10"
                    required
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-list style="width: 50%;">
                    <v-list-subheader>
                      <div class="text-subtitle-1 text-medium-emphasis">Ingredientes</div>
                    </v-list-subheader>
                    <v-list-item v-for="(ingredient, index) in recipe.ingredients" :key="index">
                      <v-text-field v-model="recipe.ingredients[index]"
                        density="compact"></v-text-field>
                    </v-list-item>
                  </v-list>

                </v-col>
                <div class="text-subtitle-1 text-medium-emphasis">Preparación</div>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="recipe.preparation"
                    required
                    density="compact"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-container>
    </v-main>
  </v-layout>
</template>
