import './assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/app/App.vue'

import router from '@/router/router'

import VueFeather from 'vue-feather'

const app = createApp(App)

app.component('VueFeather', VueFeather)
app.use(createPinia())
app.use(router)

app.mount('#app')
