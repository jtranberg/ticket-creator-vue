<script setup lang="ts">
import { ref } from "vue";
import { useTicketsStore } from "../stores/tickets";
import type { TicketPriority, TicketStatus } from "../models/ticket";
import { useRouter } from "vue-router";

const store = useTicketsStore();
const router = useRouter();

const title = ref("");
const description = ref("");
const status = ref<TicketStatus>("open");
const priority = ref<TicketPriority>("medium");

const err = ref<string | null>(null);

function submit() {
  err.value = null;
  if (!title.value.trim()) {
    err.value = "Title is required.";
    return;
  }
  const id = store.createTicket({
    title: title.value,
    description: description.value,
    status: status.value,
    priority: priority.value,
  });
  router.push(`/tickets/${id}`);
}
</script>

<template>
  <div class="pageHead">
    <h1>New Ticket</h1>
    <p class="muted">Create a ticket and track its status.</p>
  </div>

  <div class="panel">
    <div class="field">
      <label>Title</label>
      <input v-model="title" placeholder="e.g., Fix modal layout" />
    </div>

    <div class="field">
      <label>Description</label>
      <textarea v-model="description" rows="5" placeholder="What needs doing?"></textarea>
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

    <div class="error" v-if="err">{{ err }}</div>

    <div class="actions">
      <button class="btn ghost" @click="$router.push('/tickets')">Cancel</button>
      <button class="btn" @click="submit()">Create</button>
    </div>
  </div>
</template>
