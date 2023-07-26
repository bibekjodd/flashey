import { defineStore } from "pinia";

export const useGroupInfo = defineStore("groupinformodal", {
  state: () => ({
    isOpen: true,
    data: null as Chat | null,
  }),

  actions: {
    open() {
      this.isOpen = true;
    },

    close() {
      this.isOpen = false;
    },

    
  },
});
