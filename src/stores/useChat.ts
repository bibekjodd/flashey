import { prepareChat } from "@/lib/chatUtils";
import { defineStore } from "pinia";

export const useChat = defineStore("chats", {
  state: () => ({
    data: [] as Chat[],
  }),

  actions: {
    getChatById(id: string) {
      return this.data.find((chat) => chat._id === id) || null;
    },

    setChat(chats: Chat[]) {
      this.data = prepareChat(chats);
    },

    updateMessages(chat: Chat, messages: Message[]) {
      chat = { ...chat, isMessagesFetched: true };
      this.data = this.data || [];
      const chatExists = this.data.find((item) => item._id === chat._id);
      if (chatExists) {
        this.data = this.data.map((item) => {
          if (item._id === chat._id) {
            return {
              ...chat,
              messages: [...item.messages, ...messages],
            };
          }
          return item;
        });
      }

      this.data = prepareChat(this.data);
    },
  },
});
