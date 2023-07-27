import { defineStore } from "pinia";
import { suggestedUsers } from "@/lib/fetchers";
import { logout } from "@/lib/auth";
export const useUser = defineStore("user", {
  state: () => ({
    data: null as null | User,
    isLoading: true,
    suggestedUsers: [] as User[],
  }),

  actions: {
    setUser(data: User) {
      this.data = data;
    },

    clearUser() {
      this.data = null;
      this.isLoading = false;
    },

    clearLoading() {
      this.isLoading = false;
    },

    async fetchSuggestedUsers() {
      if (!this.data) return;
      const { users } = await suggestedUsers();
      this.suggestedUsers = users || [];
    },

    async logOut() {
      await logout();
      this.data = null;
    },
  },
});
