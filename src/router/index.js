import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import DashBoard from "../views/DashBoard.vue";
import RegisterView from "../views/RegisterView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashBoard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
