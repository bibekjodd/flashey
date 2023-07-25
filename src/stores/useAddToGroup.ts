import { searchUsers } from "@/lib/fetchers";
import { defineStore } from "pinia";

export const useAddToGroup = defineStore("addtogroup", {
  state: () => ({
    isOpen: false,
    users: [] as User[],
    selectedUsers: [] as User[],
    chat: undefined as undefined | Chat,
    createMode: false,
  }),

  actions: {
    open({ chat, createMode }: { chat?: Chat; createMode?: boolean }) {
      this.chat = chat;
      this.createMode = !!createMode;
      this.isOpen = true;
    },

    close() {
      this.isOpen = false;
      this.users = [];
      this.selectedUsers = [];
      this.chat = undefined;
      this.createMode = false;
    },

    selectUser(user: User) {
      this.selectedUsers.push(user);
      this.selectedUsers = filterUniqueUsers(this.selectedUsers);
    },

    deselectUser(user: User) {
      this.selectedUsers = this.selectedUsers.filter(
        (selectedUser) => selectedUser._id !== user._id
      );
    },

    deselectAllUsers() {
      this.selectedUsers = [];
    },

    addUserToGroup() {
      this.selectedUsers = [];
      this.users = [];
    },

    async fetchUsers(input: string) {
      const { users } = await searchUsers(input);
      if (users) {
        this.users = users;
      }
    },
  },
});

function filterUniqueUsers(users: User[]): User[] {
  const includedUsers: string[] = [];

  users = users.filter((user) => {
    if (includedUsers.includes(user._id)) return false;
    includedUsers.push(user._id);
    return true;
  });

  return users;
}
