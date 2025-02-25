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
} from 'vuetify/components';
import { useRouter } from 'vue-router';

const loading = ref<boolean>(false);
const userName = ref<string>("");
const password = ref<string>("");
const rules = [];

const store = useUserStore();
const router = useRouter();

function submit()
{
  const data = {
    "password": password.value,
    "username": userName.value,
  }

  logIn(data)
  .then(({data}) => {
      store.setToken(data.access_token);

      getCurrentUser()
      .then(({data})=> {
        store.setUser(data);
        router.push({ name: 'homeRecipe' });
      })
      .catch((e) => {
        console.log("ERROR GET USER")
        console.log(e);
      })
  })
  .catch((e) => {
    console.log("Error LogIn");
    console.log(e);
  });
}
</script>
<template>
  <v-layout class="rounded rounded-md mt-5">
    <v-container class="w-100">
      <v-card class="mx-auto" max-width="344">
        <v-form validate-on="submit lazy" @submit.prevent="submit">
          <v-sheet class="mx-auto" max-width="300">
            <v-card-title>LogIn</v-card-title>
            <v-text-field v-model="userName" :rules="rules" label="User name"></v-text-field>
            <v-text-field v-model="password" :rules="rules" label="Password"></v-text-field>

            <v-btn :loading="loading" class="mt-2 mb-5" color="primary" text="Submit" type="submit" block></v-btn>
          </v-sheet>
        </v-form>
        <v-divider></v-divider>
        <div class="ml-5 mt-5">
          New to Kitchen planner?
          <v-btn @click="() => $router.push({ name: 'signIn' })" class="mb-5" variant="plain">Create an account</v-btn>
        </div>
      </v-card>
    </v-container>
  </v-layout>
</template>
