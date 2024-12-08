<template>
  <q-page id="chat-page">
    <div class="chat-container">
      <!-- Chat header -->
      <div class="chat-header">
        <q-item class="chat-header-info">
          <q-item-section avatar>
            <i class="fas fa-circle-user"></i>
            <i class="fas fa-circle active-status-help" />
            <i class="fas fa-circle active-status" />
          </q-item-section>
          <q-item-section class="fill">
            <div>
              <q-item-label class="chat-header-chat-name">{{ title }}</q-item-label>
            </div>
            <div>
              <q-item-label class="chat-header-active-status">Active</q-item-label>
            </div>
          </q-item-section>
          <q-item-section class="menu">
            <q-item-label>
              <q-btn>
                <i class="fas fa-ellipsis-v" style="font-size: 20px;"></i>
              </q-btn>
              <q-menu class="user-popup">
                <q-list>
                  <q-item clickable v-close-popup @click="OpenChannelMembersDrawer">
                    <q-item-section avatar><i class="fas fa-users"></i></q-item-section>
                    <q-item-section>Channel Members</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <!-- Chat content (messages) -->
      <div class="chat-content" ref="chatContent">
        <q-infinite-scroll @load="loadMoreMessages" reverse :offset="1000" :disable="allMessagesLoaded">
          <!-- Messages -->
          <div v-for="(group, index) in groupedMessages" :key="index" class="chat-bubble-row" :class="group.type">
            <i v-if="group.type === 'incoming'" class="fas fa-circle-user profile-picture" />

            <div class="messages" :class="group.type">
              <span v-if="group.type === 'incoming'" class="sender">{{ group.messages[0].createdBy }}</span>
              <q-bubble
                v-for="(message, i) in group.messages" :key="i" class="bubble"
                :class="{ 'text-message': message.text, 'image-message': message.image, 'highlighted-message': message.text.includes(mentionTag) }">

                <div v-if="message.text" v-html="formatMessageText(message.text)"></div>
                <img v-if="message.image" :src="message.image" alt="Sent image" class="chat-image"/>
              </q-bubble>
            </div>
          </div>

          <!-- Loading animation (infnite scroll) -->
          <template #loading>
            <div class="loading-container">
              <q-spinner-dots color="primary" size="40px" />
            </div>
          </template>
        </q-infinite-scroll>

        <transition name="fade" appear>
          <div class="chat-bubble-row incoming">
            <i v-if="typingText.length > 0 && !text.startsWith('/')" class="fas fa-circle-user profile-picture" />
            <div v-if="typingText.length > 0 && !text.startsWith('/')" style="display: flex; flex-direction: column;">
              <span v-if="showTypingText" class="sender">{{ typingNick }}</span>
              <q-bubble v-if="typingText.length > 0" class="bubble text-message typing-indicator" @click="() => {showTypingText = !showTypingText; nextTick(() => {scrollToBottom();});}">
                <span v-if="!showTypingText"><q-spinner-dots size="20px" /></span>
                <span v-else>{{ typingText }}</span>
              </q-bubble>
            </div>
          </div>
        </transition>
      </div>

      <!-- Chat footer (typing bar) -->
      <div class="chat-footer">
        <q-item class="photos">
          <q-item-section>
            <i class="far fa-image" @click="selectImage"></i>
            <input type="file" ref="fileInput" @change="handleImageUpload" style="display:none" accept="image/*" />
          </q-item-section>
        </q-item>
        <q-input @blur="handleBlur" rounded standout dense v-model="text" placeholder="Aa" class="text-bar" @keyup.enter="handleMessage" />
        <transition name="fade" appear>
          <q-btn v-if="text.length > 0" icon="send" @click="handleMessage" flat round dense class="send" />
        </transition>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue';
import { useMessageStore } from 'src/stores/message_store';
import { useUserStore } from 'src/stores/user_store';
import { subscribeToMessages, subscribeToAllChannels } from 'src/boot/socket';
import { useQuasar } from 'quasar';
import { parseCommand } from 'src/utils/commandParser';
import { useIstypingStore } from 'src/stores/istyping_store';
import { socket } from 'src/boot/socket';

const $q = useQuasar();
const messageStore = useMessageStore();
const userStore = useUserStore();
subscribeToAllChannels();

const props = defineProps<{
  title: string
}>();

const emit = defineEmits(['open-channel-members']);

const messages = ref(messageStore.messages);
const displayedMessages = ref(messageStore.allMessages);

watch(() => props.title, (newTitle) => {
  subscribeToMessages(newTitle);
  messageStore.fetchMessages(newTitle);
  displayedMessages.value = messageStore.allMessages
});

watch(messageStore.allMessages, () => {
  displayedMessages.value = messageStore.allMessages
  nextTick(() => {
    scrollToBottom();
  });
});

const istypingStore = useIstypingStore();
const typingText = ref('');
const typingNick = ref('');

watch(
  () => istypingStore.getIsTypingText,
  (newValue) => {
    typingText.value = newValue.text;
    typingNick.value = newValue.nick;
    nextTick(() => {
      scrollToBottom();
    });
  },
  { immediate: true }
);

const scrollToBottom = () => {
  if (chatContent.value) {
    chatContent.value.scrollTop = chatContent.value.scrollHeight;
  }
};

// Message interface
interface Message {
  id: string;
  image?: string;
  createdBy: string;
  text: string;
  isMentioned: boolean;
  type: 'incoming' | 'outgoing';
}

// Message group interface
interface MessageGroup {
  type: string;
  messages: Message[];
}

// User data
const userName = ref('');
const mentionTag = ref('');

onMounted(async () => {
  clearPreviousData();
  await userStore.fetchUser();
  userName.value = userStore.user?.nick || '';
  mentionTag.value = `@${userName.value}`;

});
// Chat data
const text = ref<string>('');
const showTypingText = ref<boolean>(false);
const allMessagesLoaded = ref<boolean>(false);

const chatContent = ref<HTMLElement | null>(null);

const handleBlur = () => {
  socket.emit('stoppedTyping', { title: props.title });
};

watch(text, (newText) => {
  if (!newText.startsWith('/') || newText.length > 0) {
    socket.emit('isTypingText', { text: newText, title: props.title });
  } else {
    socket.emit('stoppedTyping', { title: props.title });
  }
});

// Load more messages when scrolling up
const loadMoreMessages = (index: number, done: (stop?: boolean) => void) => {
  const currentLength = displayedMessages.value.length;
  if (currentLength >= messages.value.length) {
    allMessagesLoaded.value = true;
    done(true);
    return;
  }

  setTimeout(() => {
    const loadCount = 20;
    const remainingMessages = messages.value.length - currentLength;
    const loadAmount = remainingMessages >= loadCount ? loadCount : remainingMessages;

    const startIndex = messages.value.length - currentLength - loadAmount;
    const newMessages = messages.value.slice(startIndex, startIndex + loadAmount);

    const scrollPosition = chatContent.value?.scrollHeight || 0;
    displayedMessages.value = newMessages.concat(displayedMessages.value);

    nextTick(() => {
      if (chatContent.value) {
        const newScrollHeight = chatContent.value.scrollHeight;
        chatContent.value.scrollTop = newScrollHeight - scrollPosition;
      }
      done();
    });
  }, 1000);
};

const groupedMessages = computed<MessageGroup[]>(() => {
  const groups: MessageGroup[] = [];
  let currentGroup: MessageGroup | null = null;

  displayedMessages.value.forEach((message) => {
    if (!currentGroup || currentGroup.type !== message.type || currentGroup.messages[0].createdBy !== message.createdBy) {
      currentGroup = {
        type: message.type,
        messages: []
      };
      groups.push(currentGroup);
    }
    currentGroup.messages.push(message);
  });

  return groups;
});

const formatMessageText = (text: string) => {
  const regex = new RegExp(`(${mentionTag.value})`, 'g');
  if (text.includes(mentionTag.value)) {
    return text.replace(regex, '<strong>$1</strong>');
  }
  return text;
};

// Sending a message
const sendMessage = () => {
  if (text.value.trim()) {
    const messageText = text.value.trim();
    const isMentioned = messageText.includes(`@${userName.value}`);

    const newMessage: Message = {
      id: '',
      createdBy: userName.value,
      text: messageText,
      type: 'outgoing',
      isMentioned: isMentioned,
    };

    messageStore.sendMessage(newMessage, props.title);

    text.value = '';
    showTypingText.value = false;

    // Scroll to bottom after sending a message
    nextTick(() => {
      scrollToBottom();
    });
  }
};

// Command handling - Parser
const handleMessage = () => {
  if (text.value.startsWith('/')) {
    if (text.value === '/list') {
      OpenChannelMembersDrawer();
    } else {
      parseCommand(text.value, props, $q);
    }
    text.value = '';
  } else {
    sendMessage();
    showTypingText.value = false;
  }
};

// Emit event to parent component (ChatInterface) -> open channel members drawer
const OpenChannelMembersDrawer = () => {
  emit('open-channel-members', props.title);
};

// Handling image selection
const fileInput = ref<HTMLInputElement | null>(null);

const selectImage = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const newMessage: Message = {
        id: '',
        createdBy: userName.value,
        text: '',
        isMentioned: false,
        image: reader.result as string,
        type: 'outgoing',
      };
      messageStore.addMessage(newMessage);

      nextTick(() => {
        scrollToBottom();
      });
    };
    reader.readAsDataURL(file);
  }
};

const clearPreviousData = () => {
  messageStore.clearMessages();
};

</script>


<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar);
  border-radius: 10px;
  border: 3px solid var(--primary);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-hover);
}

.fill {
  width: 100%;
}

.menu {
  display: flex;
  align-items: flex-end;

  .q-btn {
    padding: 0 5px;
  }
}

.user-popup > div {
  width: 225px !important;
}

.active-status-help {
  position: absolute;
  font-size: 18px !important;
  bottom: 5px;
  left: 41.5px;
  color: var(--primary-darker-15);
}

.active-status {
  position: absolute;
  font-size: 13px !important;
  bottom: 7px;
  left: 44px;
  color: lime;
}

.highlighted-message {
  box-shadow: 0 0 8px rgba(255, 196, 20, 0.664);
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.q-infinite-scroll__loading {
  width: 100%;
}

</style>
