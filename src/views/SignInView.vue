<script setup lang="ts">
import { useUserStore } from '@/composables/userStore';
import { signIn } from '@/services/kitchen_api/authService';
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

import { useRouter } from 'vue-router';
import type { userInterface } from '@/types';

const userForm = {
  username: "",
  email: "",
  fullName: "",
  password: "",
}

const loading = ref<boolean>(false);

const form = ref<userInterface>(userForm);

const rules = (value: string | number | Date) => !!value || 'Este campo es obligatorio';

const store = useUserStore();
const router = useRouter();

function submit(data: userInterface) {
  const value = {
    ...data,
    full_name: data.fullName,
  };

  signIn(value)
    .then(({ data }) => {
      store.setToken(data.data.jwt);
      store.setUser(data.data.user);

      router.push({ name: 'homeRecipe' });
    })
    .catch((e) => {
      console.log(e);
    });
}
</script>
<template>
  <v-layout class="rounded rounded-md mt-12">
    <v-container class="w-100">
      <v-card class="mx-auto" max-width="344">
        <v-form validate-on="submit lazy" @submit.prevent="submit(form)">
          <v-sheet class="mx-auto" max-width="300">
            <v-card-title>Sign in</v-card-title>
            <v-text-field v-model="form.username" :rules="[rules]" label="User name" id="username"
              name="username"></v-text-field>

            <v-text-field v-model="form.fullName" :rules="[rules]" label="Your fullname" id="fullname"
              name="fullname"></v-text-field>

            <v-text-field v-model="form.email" :rules="[rules]" label="email" id="email" name="email"></v-text-field>

            <v-text-field v-model="form.password" :rules="[rules]" label="Password" type="password" id="password"
              name="password"></v-text-field>

            <v-btn :loading="loading" class="mt-2 mb-5" color="primary" text="Submit" type="submit" block></v-btn>
          </v-sheet>
        </v-form>

        <v-btn @click="() => $router.push({ name: 'logIn' })" :disabled="loading" class="mb-2 ml-5" variant="plain">Log
          In</v-btn>
      </v-card>
    </v-container>
  </v-layout>
</template>
