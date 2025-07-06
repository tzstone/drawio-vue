import VueCompositionAPI from "@vue/composition-api";
import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import "./styles/reset.css";

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);

/* eslint-disable no-new */
new Vue({
  router,
  components: { App },
  render: (h) => h(App),
}).$mount("#app");
