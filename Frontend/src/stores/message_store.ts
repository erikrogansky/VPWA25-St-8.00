// FILE: message_store.ts
import { defineStore } from 'pinia';
import { socket } from 'src/boot/socket';
import { api } from 'src/boot/axios';

export interface MessageItem {
  createdBy: string;
  text: string;
  isMentioned: boolean;
  type: 'incoming' | 'outgoing';
}

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [] as MessageItem[],
  }),
  actions: {
    fetchMessages(title: string) {
      socket.emit('fetchMessages', { title });
    },
    addMessage(message: MessageItem) {
      this.messages.push(message);
    },
    setMessages(messages: MessageItem[]) {
      this.messages.push(...messages);
    },
    sendMessage(message: MessageItem, title: string) {
      this.messages.push(message);
      try {
        api.post('/send-messages', { title: title, text: message.text});
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
  },
  getters: {
    allMessages: (state) => state.messages,
  },
});
