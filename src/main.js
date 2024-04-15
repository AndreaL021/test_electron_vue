import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Input from "@/components/Input.vue"
import Snackbar from "@/components/Snackbar.vue"

library.add(fas);

createApp(App).use(store).use(router)
.component("fa-i", FontAwesomeIcon)
.component("v-input", Input)
.component("v-snackbar", Snackbar)
.mount('#app');
