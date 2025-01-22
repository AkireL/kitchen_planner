import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

const vuetify = createVuetify({})

const app = createApp(App)

app.use(router)
  .use(vuetify)
  .mount('#app')
