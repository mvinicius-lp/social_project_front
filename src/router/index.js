import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashBoard.vue"; 
import DonationsView from "../views/DonationsView.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/dashboard", 
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/doacoes",
    name: "doacoes",
    component: DonationsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
