import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.store'
import './assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
await useAuthStore(pinia).restoreSession()
app.use(router)
app.mount('#app')
