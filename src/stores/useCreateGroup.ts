import { createGroup } from "@/lib/apiActions";
import { searchUsers } from "@/lib/fetchers";
import { defineStore } from "pinia";

export const useCreateGroup = defineStore("addtogroup", {
  state: () => ({
    isOpen: false,
    users: [] as User[],
    selectedUsers: [] as User[],
    chat: undefined as undefined | Chat,
    isCreating: false,
  }),

  actions: {
    open() {
      this.isOpen = true;
    },

    close() {
      this.isOpen = false;
      this.users = [];
      this.selectedUsers = [];
      this.chat = undefined;
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

    async createGroupAction(groupName: string, image: string) {
      this.isCreating = true;
      const users = this.selectedUsers.map((user) => user._id);
      const { error, chat } = await createGroup(groupName, users, image);
      this.isCreating = false;

      if (!error) {
        this.deselectAllUsers();
        this.users = [];
        this.close();
      }
      return { error, chat };
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
