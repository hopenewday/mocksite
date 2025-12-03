import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'
import './style.css'
import { i18n } from './plugins/i18n'
import { registerSW } from 'virtual:pwa-register'
void registerSW({ immediate: true })
import { initJobsRedirect } from '@/lib/jobsRedirect'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(createHead())
app.mount('#app')

// initialize jobs redirect listeners and expose auth token for cross-site transfer
initJobsRedirect()
const auth = useAuthStore()
auth.init().then(() => { (window as { __APP_AUTH_TOKEN?: string }).__APP_AUTH_TOKEN = auth.session?.access_token || '' })
