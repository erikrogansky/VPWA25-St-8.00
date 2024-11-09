// FILE: message_store.ts
import { defineStore } from 'pinia';
import { socket } from 'src/boot/socket';

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
    initializeSocket() {
      socket.on('message', (message: MessageItem) => {
        this.addMessage(message);
      });

      socket.on('messages', (messages: MessageItem[]) => {
        this.setMessages(messages);
      });
    },
    fetchMessages(channelId: number) {
      socket.emit('fetchMessages', { channelId });
    },
    addMessage(message: MessageItem) {
      this.messages.push(message);
    },
    setMessages(messages: MessageItem[]) {
      this.messages = messages;
    },
    addDummyMessages(count: number) {
      for (let i = 0; i < count; i++) {
        const dummyMessage: MessageItem = {
          createdBy: 'rtyuu',
          text: `Dummy message ${i}`,
          isMentioned: false,
          type: (['incoming', 'outgoing'] as ('incoming' | 'outgoing')[])[Math.floor(Math.random() * ['incoming', 'outgoing'].length)],
        };
        this.addMessage(dummyMessage);
      }
    }
  },
  getters: {
    allMessages: (state) => state.messages,
  },
});
