<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTicketsStore } from "../stores/tickets";
import type { TicketPriority, TicketStatus } from "../models/ticket";

const route = useRoute();
const router = useRouter();
const store = useTicketsStore();

const id = computed(() => String(route.params.id || ""));
const ticket = computed(() => store.byId(id.value));

const title = ref("");
const description = ref("");
const status = ref<TicketStatus>("open");
const priority = ref<TicketPriority>("medium");

watch(
  ticket,
  (t) => {
    if (!t) return;
    title.value = t.title;
    description.value = t.description;
    status.value = t.status;
    priority.value = t.priority;
  },
  { immediate: true }
);

function save() {
  if (!ticket.value) return;
  const ok = store.updateTicket(ticket.value.id, {
    title: title.value.trim(),
    description: description.value.trim(),
    status: status.value,
    priority: priority.value,
  });
  if (ok) router.push(`/tickets/${ticket.value.id}`);
}
</script>

<template>
  <div v-if="!ticket" class="empty">
    Missing ticket.
    <button class="btn small ghost" @click="router.push('/tickets')">Back</button>
  </div>

  <div v-else>
    <div class="pageHead">
      <h1>Edit Ticket</h1>
      <p class="muted">Update fields and save.</p>
    </div>

    <div class="panel">
      <div class="field">
        <label>Title</label>
        <input v-model="title" />
      </div>

      <div class="field">
        <label>Description</label>
        <textarea v-model="description" rows="5"></textarea>
      </div>

      <div class="row2">
        <div class="field">
          <label>Status</label>
          <select v-model="status">
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div class="field">
          <label>Priority</label>
          <select v-model="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div class="actions">
        <button class="btn ghost" @click="router.push(`/tickets/${ticket.id}`)">Cancel</button>
        <button class="btn" @click="save()">Save</button>
      </div>
    </div>
  </div>
</template>
