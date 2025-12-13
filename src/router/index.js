import { createRouter, createWebHistory } from "vue-router";

// Views
import LoginView from "../views/LoginView.vue";
import DashBoard from "../views/DashBoard.vue";
import RegisterView from "../views/RegisterView.vue";
import DoadoresView from "../views/DoadoresView.vue";
import NovoDoador from "../views/NovoDoador.vue";
import DonationsView from "../views/DonationsView.vue";
import ApplicationsView from "../views/ApplicationsView.vue";

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
  // DOAÇÕES
  {
    path: "/doacoes",
    name: "doacoes",
    component: DonationsView,
  },

  //Aplicações
  {
    path: "/aplicacoes",
    name: "aplicacoes",
    component: ApplicationsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
