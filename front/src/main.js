import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/index.css';
import './assets/shepherd-custom.css'; // Import custom Shepherd.js tour guide styles
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

// Import debug tools (they self-register to window)
import './utils/debugTools.js';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

// Disable Vue warnings
// app.config.warnHandler = () => {};
// app.config.silent = true;

app.use(router);
app.use(pinia);

// Setup vue-toastification
const toastOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__bounce",
  maxToasts: 10,
  newestOnTop: true
};
app.use(Toast, toastOptions);

// Mount the app
app.mount('#app');