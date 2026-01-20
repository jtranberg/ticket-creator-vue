<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { onMounted } from "vue";
import { useTicketsStore } from "./stores/tickets";

const route = useRoute();
const store = useTicketsStore();

onMounted(() => store.hydrate());
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <div class="brand">
        <div class="logo">🎫</div>
        <div>
          <div class="title">Ticket Creator (Vue)</div>
          <div class="sub">No backend • Pinia + LocalStorage</div>
        </div>
      </div>

      <nav class="nav">
        <RouterLink class="navLink" to="/tickets" :class="{ active: route.path.startsWith('/tickets') }">
          Tickets
        </RouterLink>
        <RouterLink class="btn" to="/tickets/new">+ New</RouterLink>
      </nav>
    </header>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>
