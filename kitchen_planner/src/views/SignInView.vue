<script setup lang="ts">
import { ref } from 'vue';
import {
  VSheet,
  VForm,
  VTextField,
  VBtn,
  VCard,
  VCardTitle,
  VLayout,
} from 'vuetify/components';
const loading = ref<boolean>(false);
const userName = ref<string>("");
const email = ref<string>("");
const fullName = ref<string>("");
const password = ref<string>("");
const rules = [];

function submit(event: SubmitEvent)
{
  console.log(event);
}
</script>
<template>
<v-layout class="rounded rounded-md mt-5">
  <v-container class="w-100">
    <v-card class="mx-auto"
      max-width="344">
      <v-form validate-on="submit lazy" @submit.prevent="submit">
      <v-sheet class="mx-auto" max-width="300">
        <v-card-title>Sign in</v-card-title>
      <v-text-field
        v-model="userName"
        :rules="rules"
        label="User name"
      ></v-text-field>

      <v-text-field
        v-model="fullName"
        :rules="rules"
        label="Your fullname"
      ></v-text-field>

      <v-text-field
        v-model="email"
        :rules="rules"
        label="email"
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="rules"
        label="Password"
      ></v-text-field>

      <v-btn
        :loading="loading"
        class="mt-2 mb-5"
        color="primary"
        text="Submit"
        type="submit"
        block
      ></v-btn>
    </v-sheet>
  </v-form>

  <v-btn
        @click="() => $router.push({ name: 'logIn' })"
        class="mb-2 ml-5"
        variant="plain"
      >Log In</v-btn>
    </v-card>
  </v-container>
  </v-layout>
</template>
