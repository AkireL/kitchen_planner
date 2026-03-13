<script setup lang="ts">
import { useUserStore } from '@/composables/userStore';
import { getCurrentUser, logIn } from '@/services/kitchen_api/authService';
import { ref } from 'vue';
import {
  VSheet,
  VForm,
  VTextField,
  VBtn,
  VCard,
  VCardTitle,
  VLayout,
  VDivider,
  VContainer,
} from 'vuetify/components';
import { useRouter } from 'vue-router';
import type { logInInterface } from '@/types';

const loading = ref<boolean>(false);
const error = ref<string>('');

const form = ref<logInInterface>({
  username: '',
  password: '',
  scope: '',
  grant_type: 'password',
  client_id: '',
  client_secret: '',
});

const store = useUserStore();
const router = useRouter();

const rules = (value: string | number | Date) => !!value || 'Este campo es obligatorio.';

function submit(data: logInInterface) {
  if (!data || !data.password || !data.username) {
    error.value = 'Todos los campos son requeridos';
    setTimeout(() => {
      error.value = '';
    }, 2000);
    return;
  }

  loading.value = true;

  logIn(data)
    .then(({ data }) => {
      store.setToken(data.access_token);

      getCurrentUser()
        .then(({ data }) => {
          store.setUser(data);
          router.push({ name: 'homeRecipe' });
        })
        .catch((e) => {
          console.log('ERROR GET USER');
          console.log(e);
        });
    })
    .catch((e) => {
      console.log('Error LogIn');
      console.log(e);
      loading.value = true;

      if (e.response?.data?.detail !== undefined) {
        if (Array.isArray(e.response.data.detail)) {
          error.value = e.response.data.detail.map((element: any) => element.msg).join(', ');
        } else {
          error.value = e.response.data.detail;
        }

        setTimeout(() => {
          error.value = '';
        }, 2000);
        return;
      }

      if (e.response?.data?.message) {
        error.value = 'Credenciales incorrectas.';
        return;
      }
    })
    .finally(() => (loading.value = false));
}
</script>
<template>
  <v-layout class="rounded rounded-md">
    <v-container class="w-100">
      <v-card class="mx-auto" max-width="344">
        <v-form validate-on="submit lazy" @submit.prevent="submit(form)">
          <v-sheet class="mx-auto" max-width="300">
            <v-card-title>Log In</v-card-title>
            <v-text-field
              v-model="form.username"
              :rules="[rules]"
              label="User name"
              name="username"
              id="username"
            ></v-text-field>
            <v-text-field
              v-model="form.password"
              :rules="[rules]"
              label="Password"
              name="password"
              id="password"
              :type="'password'"
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
        <v-divider></v-divider>
        <div class="ml-5 mt-5">
          New to Kitchen planner?
          <v-btn
            @click="() => $router.push({ name: 'signIn' })"
            class="mb-5"
            variant="plain"
            :loading="loading"
            >Create an account</v-btn
          >
        </div>
        <div class="bg-red-accent-1 pa-4 ma-3 text-white" v-if="error">{{ error }}</div>
      </v-card>
    </v-container>
  </v-layout>
</template>
