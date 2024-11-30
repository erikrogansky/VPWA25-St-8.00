import { reactive } from 'vue';
import { io } from 'socket.io-client';
import { MessageItem, useMessageStore } from 'src/stores/message_store';
const messageStore = useMessageStore();

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

let currentRoom: string | null = null;

const URL = process.env.VUE_APP_SOCKET_URL || 'http://localhost:3333';

export const socket = io(URL, {
  auth: {
    token: localStorage.getItem('authToken')
  }
});

socket.on('connect_error', (error) => {
  console.error('Connection Error:', error);
});

socket.on('connect', () => {
  state.connected = true;
});

socket.on('disconnect', () => {
  state.connected = false;
});

socket.on('message', (message: {text: string, createdBy: string, isMentioned: boolean, messageId: string, channel: string, channelIfChat: string}) => {
  const newMessage: MessageItem = {
    id: message.messageId,
    createdBy: message.createdBy,
    text: message.text,
    isMentioned: message.isMentioned,
    type: 'incoming'
  };

  if (message.channel === currentRoom || message.channelIfChat === currentRoom) {
    messageStore.addMessage(newMessage);
  }

  if (document.visibilityState === 'hidden' && Notification.permission === 'granted') {
    new Notification(newMessage.createdBy, {
      body: newMessage.text,
      icon: '/src/assets/logo.png',
    });
  }
});

socket.on('messages', (messages: MessageItem[]) => {
  messageStore.setMessages(messages);
});

export const subscribeToMessages = (title: string) => {
  //socket.emit('subscribeToMessages', { title });
  currentRoom = title;
};

export const subscribeToAllChannels = () => {
  socket.emit('subscribeToAllChannels');
}

export default { state, socket, /*subscribeToMessages,*/ subscribeToAllChannels };
