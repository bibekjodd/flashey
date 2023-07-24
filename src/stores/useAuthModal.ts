import { defineStore } from "pinia";

export const useAuthModal = defineStore("authmoal", {
  state: () => {
    return {
      isOpen: true,
    };
  },

  actions: {
    open() {
      this.isOpen = true;
    },

    close() {
      this.isOpen = false;
    },
  },
});
