import { createRouter, createWebHistory } from "vue-router";

// Views
import LoginView from "../views/LoginView.vue";
import DashBoard from "../views/DashBoard.vue";
import RegisterView from "../views/RegisterView.vue";
import DoadoresView from "../views/DoadoresView.vue";
import NovoDoador from "../views/NovoDoador.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },

  // LOGIN
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },

  // CADASTRO DE USUÁRIO
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },

  // DASHBOARD
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashBoard,
  },

  // DOADORES
  {
    path: "/doadores",
    name: "doadores",
    component: DoadoresView,
  },
  {
    path: "/doadores/novo",
    name: "novo-doador",
    component: NovoDoador,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
