<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTicketsStore } from "../stores/tickets";
import type { TicketStatus } from "../models/ticket";

const route = useRoute();
const router = useRouter();
const store = useTicketsStore();

const id = computed(() => String(route.params.id || ""));
const ticket = computed(() => store.byId(id.value));

function labelStatus(s: TicketStatus) {
  if (s === "in_progress") return "In Progress";
  if (s === "open") return "Open";
  return "Done";
}
</script>

<template>
  <div v-if="!ticket" class="empty">
    Missing ticket. <button class="btn small ghost" @click="router.push('/tickets')">Back</button>
  </div>

  <div v-else>
    <div class="row">
      <div>
        <h1>{{ ticket.title }}</h1>
        <div class="meta">
          <span class="pill" :data-status="ticket.status">{{ labelStatus(ticket.status) }}</span>
          <span class="pill" :data-priority="ticket.priority">{{ ticket.priority }}</span>
          <span class="muted">Updated {{ new Date(ticket.updatedAt).toLocaleString() }}</span>
        </div>
      </div>

      <div class="actions">
        <button class="btn ghost" @click="router.push('/tickets')">Back</button>
        <button class="btn" @click="router.push(`/tickets/${ticket.id}/edit`)">Edit</button>
      </div>
    </div>

    <div class="panel">
      <p class="desc">{{ ticket.description }}</p>
    </div>
  </div>
</template>
