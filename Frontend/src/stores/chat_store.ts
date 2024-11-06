import { defineStore } from 'pinia';

export interface ChatItem {
  title: string;
  lastMessage: string;
  unread: boolean;
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    chatItems: [] as ChatItem[],
  }),
  actions: {
    fetchChatItems() {
      this.chatItems = [
        { title: 'First Chat', lastMessage: 'dfghjkl', unread: true },
        { title: 'Second Chat', lastMessage: 'dfghjkl', unread: false },
      ];
    },
    createChatItem(chatItem: ChatItem) {
      this.chatItems.push(chatItem);
    },
  },
  getters: {
    filteredChatItems: (state) => (search: string) => {
      return state.chatItems.filter((chat) =>
        chat.title.toLowerCase().includes(search.toLowerCase())
      );
    },
  },
});
