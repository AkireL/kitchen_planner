<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
  VApp,
  VMain,
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardText,
  VBtn,
  VIcon,
  VAvatar,
} from 'vuetify/components';

const router = useRouter();

const goToLogin = () => {
  router.push({ name: 'logIn' });
};

const goToSignUp = () => {
  router.push({ name: 'signIn' });
};
</script>

<template>
  <v-app>
    <v-main>
      <!-- Hero Section -->
      <section class="hero-section">
        <v-container class="py-8 py-md-16">
          <v-row align="center" justify="center">
            <v-col cols="12" md="8" class="text-center">
              <div class="mb-6">
                <v-avatar color="orange" size="80" class="mb-4">
                  <v-icon icon="mdi-chef-hat" size="48" color="white" />
                </v-avatar>
              </div>

              <h1 class="hero-title mb-4">Kitchen Planner</h1>

              <p class="text-gray text-subtitle-1 mb-8">
                Organiza tus recetas por semana.<br />
                Planifica, guarda y consulta tus comidas desde una sola vista.
              </p>

              <div class="d-flex flex-column flex-sm-row justify-center gap-4">
                <v-btn color="green" size="large" variant="flat" @click="goToLogin">
                  <v-icon start>mdi-login</v-icon>
                  Iniciar sesión
                </v-btn>

                <v-btn color="green" size="large" variant="outlined" @click="goToSignUp">
                  <v-icon start>mdi-account-plus</v-icon>
                  Crear cuenta
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <v-container class="py-8 py-md-12">
          <v-row justify="center">
            <v-col cols="12" md="10">
              <v-row dense>
                <v-col cols="12" sm="4">
                  <v-card class="feature-card" elevation="0" rounded="lg">
                    <v-card-text class="text-center pa-6">
                      <v-avatar color="orange" size="56" class="mb-4">
                        <v-icon icon="mdi-calendar-week" size="28" color="white" />
                      </v-avatar>
                      <h3 class="text-subtitle-1 mb-2 text-gray">Plan Semanal</h3>

                      <p class="text-body-1">
                        Visualiza toda la semana de un vistazo. Organiza tus comidas por día de
                        forma sencilla.
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-card class="feature-card" elevation="0" rounded="lg">
                    <v-card-text class="text-center pa-6">
                      <v-avatar color="green" size="56" class="mb-4">
                        <v-icon icon="mdi-robot" size="28" color="white" />
                      </v-avatar>

                      <h3 class="text-subtitle-1 mb-2 text-gray">Chat con IA</h3>

                      <p class="text-body-1">
                        Consulta recetas y obtiene sugerencias personalizadas preguntando al modelo.
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-card class="feature-card" elevation="0" rounded="lg">
                    <v-card-text class="text-center pa-6">
                      <v-avatar color="primary" size="56" class="mb-4">
                        <v-icon icon="mdi-food" size="28" color="white" />
                      </v-avatar>

                      <h3 class="text-subtitle-1 mb-2 text-gray">Recetas por Día</h3>

                      <p class="text-body-1">
                        Guarda tus recetas favoritas y asígnalas al día que prefieras prepararlas.
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Footer -->
      <footer class="app-footer">
        <v-container class="py-4">
          <v-row justify="center">
            <v-col cols="12" class="text-center">
              <p class="footer-text">© 2026 Kitchen Planner. Todos los derechos reservados.</p>
            </v-col>
          </v-row>
        </v-container>
      </footer>
    </v-main>
  </v-app>
</template>

<style scoped>
.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.6;
}

.features-section {
  background: rgb(var(--v-theme-surface));
}

.feature-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  height: 100%;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.feature-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.feature-text {
  font-size: 0.9rem;
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.5;
}

.preview-section {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.03),
    rgba(var(--v-theme-primary), 0.06)
  );
}

.preview-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
  background: rgb(var(--v-theme-surface));
}

.preview-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.preview-text {
  font-size: 1rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

.app-footer {
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.footer-text {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

@media (min-width: 960px) {
  .hero-title {
    font-size: 3.5rem;
  }
}
</style>
