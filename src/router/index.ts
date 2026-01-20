import { createRouter, createWebHistory } from "vue-router";
import TicketsList from "../pages/TicketsList.vue";
import TicketCreate from "../pages/TicketCreate.vue";
import TicketDetail from "../pages/TicketDetail.vue";
import TicketEdit from "../pages/TicketEdit.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/tickets" },
    { path: "/tickets", component: TicketsList },
    { path: "/tickets/new", component: TicketCreate },
    { path: "/tickets/:id", component: TicketDetail },
    { path: "/tickets/:id/edit", component: TicketEdit },
  ],
});
