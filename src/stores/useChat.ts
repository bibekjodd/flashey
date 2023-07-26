import { prepareChat } from "@/lib/chatUtils";
import { accessChat } from "@/lib/fetchers";
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

    async chatExists(
      user: User | null,
      otherUser: User
    ): Promise<string | undefined> {
      if (!user) return undefined;
      const myId = user._id;
      const friendsId = otherUser._id;
      const chat = this.data.find((chat) => {
        if (!chat.isGroupChat) {
          const firstPerson = chat.users[0]?._id;
          const secondPerson = chat.users[1]?._id;
          if (firstPerson === myId && secondPerson === friendsId) {
            return true;
          } else if (firstPerson === friendsId && secondPerson === myId) {
            return true;
          }
        }
      });

      if (!chat) {
        const newChat = await this.addNewChat(otherUser._id);
        return newChat;
      }
      return chat._id;
    },

    async addNewChat(id: string, isChatId?: boolean) {
      const { chat } = await accessChat(id, isChatId);
      if (chat) {
        this.data.push(chat);
      }
      this.data = prepareChat(this.data);
      return chat?._id;
    },
  },
});
