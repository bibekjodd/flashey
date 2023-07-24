import { defineStore } from "pinia";
export const useUser = defineStore("user", {
  state: () => ({
    data: null as null | User,
    isLoading: true,
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
  },
});
