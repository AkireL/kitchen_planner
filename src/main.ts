import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { createPinia } from 'pinia'

const vuetify = createVuetify({})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
  .use(vuetify)
  .use(pinia)
  .mount('#app')
