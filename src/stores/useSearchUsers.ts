import { searchUsers } from "@/lib/fetchers";
import { defineStore } from "pinia";

export const useSearchUsers = defineStore("searchusers", {
  state: () => ({
    isOpen: false,
    users: [] as User[],
  }),

  actions: {
    async fetchUsers(input: string) {
      if (input === "") {
        this.isOpen = false;
        return;
      }

      this.isOpen = true;
      const { users } = await searchUsers(input);
      if (users) this.users = users;
    },
  },
});
