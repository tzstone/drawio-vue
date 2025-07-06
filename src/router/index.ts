import Vue from "vue";
import Router from "vue-router";
import homeRouters from "./modules/home";
// import routes from './config';

// eslint-disable-next-line no-debugger
const routes = [...homeRouters];

Vue.use(Router);

const router = new Router({
  mode: "hash",
  routes: routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
