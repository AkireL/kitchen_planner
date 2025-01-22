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
  VLayout
} from 'vuetify/components'
import { useRouter } from 'vue-router'

const router = useRouter()
const recipes = [
  {
    day: "Lunes",
    id: 1,
    list: [
      {
        id: 1,
        title: 'Medieval Strategic War Campaigns',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "a preparation",
        duration: '10 minutes',
      },
      {
        id: 2,
        title: 'Underwater VR Exploration Adventure',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
        duration: '11 minutes',
      },
      {
        id: 3,
        title: '1920s Mystery Detective Chronicles',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
        duration: '9 minutes',
      },
    ],
  },
  {
    day: "Martes",
    id: 2,
    list: [
      {
        id: 4,
        title: 'Medieval Strategic War Campaigns',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
        duration: '10 minutes',
      },
      {
        id: 5,
        title: 'Underwater VR Exploration Adventure',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
        duration: '11 minutes',
      },
      {
        id: 6,
        title: '1920s Mystery Detective Chronicles',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
        duration: '9 minutes',
      },
    ]
  },
  {
    day: "Miércoles",
    id: 3,
    list: [
      {
        id: 6,
        title: 'Medieval Strategic War Campaigns',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
        advanced: true,
        duration: '10 minutes',
      },
      {
        id: 7,
        title: 'Underwater VR Exploration Adventure',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
        advanced: true,
        duration: '11 minutes',
      },
      {
        id: 8,
        title: '1920s Mystery Detective Chronicles',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
        advanced: false,
        duration: '9 minutes',
      },
    ],
  },
  {
    day: "Jueves",
    id: 4,
    list: [
      {
        id: 9,
        title: 'Medieval Strategic War Campaigns',
        duration: '10 minutes',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
      },
      {
        id: 10,
        title: 'Underwater VR Exploration Adventure',
        duration: '11 minutes',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
      },
      {
        id: 11,
        title: '1920s Mystery Detective Chronicles',
        duration: '9 minutes',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
      },
    ]
  },
  {
    day: "Viernes",
    id: 5,
    list: [
      {
        id: 12,
        title: 'Medieval Strategic War Campaigns',
        duration: '10 minutes',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
      },
      {
        id: 13,
        title: 'Underwater VR Exploration Adventure',
        duration: '11 minutes',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
      },
      {
        id: 14,
        title: '1920s Mystery Detective Chronicles',
        duration: '9 minutes',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
      },
    ],
  },
  {
    day: "Sábado",
    id: 6,
    list: [
      {
        id: 15,
        title: 'Medieval Strategic War Campaigns',
        duration: '10 minutes',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
      },
      {
        id: 16,
        title: 'Underwater VR Exploration Adventure',
        duration: '11 minutes',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
      },
      {
        id: 17,
        title: '1920s Mystery Detective Chronicles',
        duration: '9 minutes',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
      },
    ],
  },
  {
    day: "Domingo",
    id: 7,
    list: [
      {
        id: 18,
        title: 'Medieval Strategic War Campaigns',
        duration: '10 minutes',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
      },
      {
        id: 19,
        title: 'Underwater VR Exploration Adventure',
        duration: '11 minutes',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
      },
      {
        id: 20,
        title: '1920s Mystery Detective Chronicles',
        duration: '9 minutes',
        ingredients: [
          "tomate", "chiles", "ajo"
        ],
        preparation: "",
      },
    ],
  },
];

const goToDetail = (id: number) => {
  router.push({ name: 'detail', params: { id: id } });
}

const getColor = (index) => {
  console.log(index);
  const colors = [
    "pink-lighten-1",
    "amber-accent-2",
    "lime-darken-2",
    "light-green-darken-3",
    "blue-darken-2",
    "indigo-darken-1",
    "deep-purple-lighten-1"
  ];
  return colors[index - 1];
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
                    <v-card class="pb-5" border flat>
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
                            <v-btn icon="mdi-delete" size="md" color="red" variant="text" style="z-index: 1;"></v-btn>
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

            <!-- footer -->
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
</template>

<style scoped>
.v-card:has(>.v-card-text:hover) {
  background-color: #E0E0E0;
  cursor: pointer;
}
</style>
