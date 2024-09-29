import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'; // Ensure you're importing createPinia
import './style.css';

const pinia = createPinia(); // Create a Pinia instance

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app');
