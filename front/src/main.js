import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/index.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

// Disable Vue warnings
// app.config.warnHandler = () => {};
// app.config.silent = true;

// Mount the app
app.use(router).use(pinia).mount('#app');