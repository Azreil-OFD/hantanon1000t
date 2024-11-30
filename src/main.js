import { createApp } from "vue";
import { createWebHashHistory, createRouter } from "vue-router";
import App from "./App.vue";
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import './index.css'

import SearchPage from "./pages/SearchPage.vue";
import PageTest from "./pages/PageTest.vue";
import ToastService from 'primevue/toastservice';
const app = createApp(App);
app.use(ToastService);
const routes = [
    { path: "/search", component: SearchPage },
    { path: "/", component: PageTest },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.mount("#app");
