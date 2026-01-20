import { defineStore } from "pinia";
import type { Ticket, TicketPriority, TicketStatus } from "../models/ticket";

const LS_KEY = "ticket_creator_vue_v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function now() {
  return Date.now();
}

function seedTickets(): Ticket[] {
  const t = now();
  return [
    {
      id: uid(),
      title: "Set up project structure",
      description: "Router + store + pages for list/detail/create/edit.",
      status: "open",
      priority: "high",
      createdAt: t - 1000 * 60 * 60 * 24 * 2,
      updatedAt: t - 1000 * 60 * 60 * 12,
    },
    {
      id: uid(),
      title: "Add ticket status filters",
      description: "Counters for Open / In Progress / Done and filter chips.",
      status: "in_progress",
      priority: "medium",
      createdAt: t - 1000 * 60 * 60 * 24,
      updatedAt: t - 1000 * 60 * 40,
    },
    {
      id: uid(),
      title: "Polish UI pills",
      description: "Improve readability for badges and pill typography.",
      status: "done",
      priority: "low",
      createdAt: t - 1000 * 60 * 60 * 36,
      updatedAt: t - 1000 * 60 * 10,
    },
  ];
}

function loadFromStorage(): Ticket[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Ticket[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(list: Ticket[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export const useTicketsStore = defineStore("tickets", {
  state: () => ({
    tickets: [] as Ticket[],
    hydrated: false,
  }),

  getters: {
    counts(state) {
      return {
        all: state.tickets.length,
        open: state.tickets.filter((t) => t.status === "open").length,
        in_progress: state.tickets.filter((t) => t.status === "in_progress").length,
        done: state.tickets.filter((t) => t.status === "done").length,
      };
    },
    byId: (state) => (id: string) => state.tickets.find((t) => t.id === id) ?? null,
  },

  actions: {
    hydrate() {
      if (this.hydrated) return;

      const stored = loadFromStorage();
      this.tickets = stored && stored.length ? stored : seedTickets();
      this.hydrated = true;

      saveToStorage(this.tickets);
    },

    resetSeed() {
      this.tickets = seedTickets();
      saveToStorage(this.tickets);
    },

    clearAll() {
      this.tickets = [];
      saveToStorage(this.tickets);
    },

    createTicket(input: {
      title: string;
      description: string;
      status: TicketStatus;
      priority: TicketPriority;
    }) {
      const t = now();
      const ticket: Ticket = {
        id: uid(),
        title: input.title.trim(),
        description: input.description.trim(),
        status: input.status,
        priority: input.priority,
        createdAt: t,
        updatedAt: t,
      };
      this.tickets = [ticket, ...this.tickets];
      saveToStorage(this.tickets);
      return ticket.id;
    },

    updateTicket(id: string, patch: Partial<Omit<Ticket, "id" | "createdAt">>) {
      const i = this.tickets.findIndex((t) => t.id === id);
      if (i === -1) return false;

      const updated: Ticket = {
        ...this.tickets[i],
        ...patch,
        updatedAt: now(),
      };

      this.tickets.splice(i, 1, updated);
      saveToStorage(this.tickets);
      return true;
    },

    removeTicket(id: string) {
      this.tickets = this.tickets.filter((t) => t.id !== id);
      saveToStorage(this.tickets);
    },
  },
});
