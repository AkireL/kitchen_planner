<script setup lang="ts">
import {
  VList,
  VListItem,
  VTextField,
  VBtn,
} from 'vuetify/components'

const model = defineModel({
  type: Array<string>,
  required: true,
});

const removeIngredient = (index: string | number) => {
  model.value = model.value.filter((item, i) => index != i);
}
</script>
<template>
  <v-list style="width: 50%" class="p-0">
    <v-list-item v-for="(ingredient, index) in model" :key="index" class="p-0 m-0">
      <div class="d-flex ga-1">
        <v-text-field
          v-model="model[index]"
          required
          hide-details="auto"
          style="align-self: center"
          density="compact"
        >
        </v-text-field>
        <v-btn
          @click="() => removeIngredient(index)"
          icon="mdi-delete"
          size="x-small"
          style="align-self: center"
          density="comfortable"
          class="mr-1"
        ></v-btn>
      </div>
    </v-list-item>
  </v-list>
</template>
