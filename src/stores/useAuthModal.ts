import { defineStore } from "pinia";

export const useAuthModal = defineStore("authmoal", {
  state: () => {
    return {
      isOpen: false,
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
