import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import axios from 'axios';

export interface RequestItem {
  title: string;
  lastMessage: string;
  unread: boolean;
}

export const useRequestStore = defineStore('request', {
  state: () => ({
    requestItems: [] as RequestItem[],
  }),
  actions: {
    async fetchChats() {
      try {
        const response = await api.get('/get-channels', {
          params: {
            type: 'request'
          }
        });
        if (Array.isArray(response.data.chats)) {
          this.requestItems = response.data.chats.map((chat: { channel: { name: string }; unreadMessages: number }) => ({
            title: chat.channel.name,
            lastMessage: 'Last message.',
            unread: chat.unreadMessages > 0,
          }));
        } else {
          this.requestItems = [];
        }
      } catch (error: unknown) {
        this.requestItems = [];
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.data.message !== 'No chats found') {
            console.error('Error fetching chats:', error);
            console.error('Error response data:', error.response.data);
          }
        } else {
          console.error('Error fetching chats:', error);
        }
      }
    },
  },
  getters: {
    filteredChatItems: (state) => (search: string) => {
      return state.requestItems.filter((chat) =>
        chat.title.toLowerCase().includes(search.toLowerCase())
      );
    },
  },
});
