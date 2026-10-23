import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import { queryClient } from '@/lib/queryClient'
import '@/lib/icons'
import './style.css'

createApp(App).use(VueQueryPlugin, { queryClient }).mount('#app')
