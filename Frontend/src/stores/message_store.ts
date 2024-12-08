// FILE: message_store.ts
import { defineStore } from 'pinia';
import { socket } from 'src/boot/socket';
import { api } from 'src/boot/axios';
import { v4 as uuidv4 } from 'uuid';

export interface MessageItem {
  id: string;
  createdBy: string;
  text: string;
  isMentioned: boolean;
  type: 'incoming' | 'outgoing';
}

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [] as MessageItem[],
    sentMessageIds: new Set<string>(),
  }),
  actions: {
    fetchMessages(title: string) {
      if (this.messages.length !== 0) {
        this.messages = [];
      }
      socket.emit('fetchMessages', { title });
    },
    addMessage(message: MessageItem) {
      if (!this.sentMessageIds.has(message.id)) {
        this.messages.push(message);
      }
    },
    setMessages(messages: MessageItem[]) {
      this.messages.push(...messages);
    },
    sendMessage(message: MessageItem, title: string) {
      const messageId = uuidv4();
      message.id = messageId;
      this.messages.push(message);
      this.sentMessageIds.add(messageId);
      try {
        api.post('/send-messages', { title: title, text: message.text, id: messageId });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    clearMessages() {
      this.messages = [];
      this.sentMessageIds.clear();
    },
  },
  getters: {
    allMessages: (state) => state.messages,
  },
});
