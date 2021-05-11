import Vue from "vue";
import VueRouter from "vue-router";
import Search from "../views/Search.vue";
import FindCustomer from "../views/FindCustomer.vue";
import GetLastSO from "../views/GetLastSO.vue";
import CreateSO from "../views/CreateSO.vue";
import About from "../views/About.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Search",
    component: Search,
  },
  {
    path: "/findCustomer",
    name: "Search",
    component: FindCustomer,
  },
  {
    path: "/getLastSO",
    name: "GetLastSO",
    component: GetLastSO,
  },
  {
    path: "/createSO",
    name: "CreateSO",
    component: CreateSO,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
