import { defineStore } from "pinia";

export const useChat = defineStore("chats", {
  state: () => ({
    data: [] as Chat[],
  }),

  actions: {
    setChat(chats: Chat[]) {
      this.data = chats;
    },
  },
});
