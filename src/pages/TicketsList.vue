<script setup lang="ts">
import { computed, ref } from "vue";
import { useTicketsStore } from "../stores/tickets";
import type { TicketStatus } from "../models/ticket";
import { useRouter } from "vue-router";

type Filter = "all" | TicketStatus;

const store = useTicketsStore();
const router = useRouter();

const filter = ref<Filter>("all");

const visible = computed(() => {
  const f = filter.value;
  if (f === "all") return store.tickets;
  return store.tickets.filter((t) => t.status === f);
});

function labelStatus(s: TicketStatus) {
  if (s === "in_progress") return "In Progress";
  if (s === "open") return "Open";
  return "Done";
}
</script>

<template>
  <div class="row">
    <div>
      <h1>Tickets</h1>
      <p class="muted">Vue 3 + Pinia store (seeded)</p>
    </div>

    <div class="actions">
      <button class="btn ghost" @click="store.resetSeed()">Reset seed</button>
      <button class="btn ghost" @click="store.clearAll()">Clear all</button>
      <button class="btn" @click="router.push('/tickets/new')">+ New Ticket</button>
    </div>
  </div>

  <div class="filters">
    <button class="chip" :class="{ active: filter === 'all' }" @click="filter = 'all'">
      All <span class="badge">{{ store.counts.all }}</span>
    </button>

    <button class="chip" :class="{ active: filter === 'open' }" @click="filter = 'open'">
      Open <span class="badge">{{ store.counts.open }}</span>
    </button>

    <button class="chip" :class="{ active: filter === 'in_progress' }" @click="filter = 'in_progress'">
      In Progress <span class="badge">{{ store.counts.in_progress }}</span>
    </button>

    <button class="chip" :class="{ active: filter === 'done' }" @click="filter = 'done'">
      Done <span class="badge">{{ store.counts.done }}</span>
    </button>
  </div>

  <div class="list">
    <div class="empty" v-if="visible.length === 0">
      No tickets. Create one.
    </div>

    <article class="card" v-for="t in visible" :key="t.id">
      <div class="cardTop">
        <div class="title">
          <router-link :to="`/tickets/${t.id}`">{{ t.title }}</router-link>

          <div class="meta">
            <span class="pill" :data-status="t.status">{{ labelStatus(t.status) }}</span>
            <span class="pill" :data-priority="t.priority">{{ t.priority }}</span>
            <span class="muted">Updated {{ new Date(t.updatedAt).toLocaleString() }}</span>
          </div>
        </div>

        <div class="cardActions">
          <router-link class="btn small ghost" :to="`/tickets/${t.id}/edit`">Edit</router-link>
          <button class="btn small danger" @click="store.removeTicket(t.id)">Delete</button>
        </div>
      </div>

      <p class="desc">{{ t.description }}</p>
    </article>
  </div>
</template>
