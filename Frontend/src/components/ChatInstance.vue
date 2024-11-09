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
          <q-item-section>
            <div>
              <q-item-label class="chat-header-chat-name">{{ title }}</q-item-label>
            </div>
            <div>
              <q-item-label class="chat-header-active-status">Active</q-item-label>
            </div>
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
              <span v-if="group.type === 'incoming'" class="sender">Name</span>
              <q-bubble
                v-for="(message, i) in group.messages" :key="i" class="bubble"
                :class="{ 'text-message': message.text, 'image-message': message.image,'highlighted-message': message.isMentioned }">

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
              <i v-if="text.length > 0" class="fas fa-circle-user profile-picture" />
              <div v-if="text.length > 0" style="display: flex; flex-direction: column;">
                <span v-if="showTypingText" class="sender">Name</span>
                <q-bubble v-if="text.length > 0" class="bubble text-message typing-indicator" @click="() => {showTypingText = !showTypingText; nextTick(() => {scrollToBottom();});}">
                  <span v-if="!showTypingText"><q-spinner-dots size="20px" /></span>
                  <span v-else>{{ text }}</span>
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
        <q-input rounded standout dense v-model="text" placeholder="Aa" class="text-bar" @keyup.enter="() => { sendMessage(); showTypingText = false; }" />
        <transition name="fade" appear>
          <q-btn v-if="text.length > 0" icon="send" @click="() => { sendMessage(); showTypingText = false; }" flat round dense class="send" />
        </transition>
      </div>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useMessageStore } from 'src/stores/message_store';

const messageStore = useMessageStore();

const messages = ref(messageStore.messages);
const displayedMessages = ref(messageStore.allMessages);

const props = defineProps<{
  title: string
}>();


watch(() => props.title, (newTitle) => {
  messageStore.fetchMessages(newTitle);
});

watch(messageStore.allMessages, () => {
  nextTick(() => {
    scrollToBottom();
  });
});

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
const userName = 'name'; // User name - TEMPORARY (replace in backend phase)
const mentionTag = `@${userName}`;

// Chat data
const text = ref<string>('');
const showTypingText = ref<boolean>(false);
const allMessagesLoaded = ref<boolean>(false);

const chatContent = ref<HTMLElement | null>(null);

watch(text, (newText) => {
  if (newText.length > 0) {
    nextTick(() => {
      scrollToBottom();
    });
  }
});

// Load more messages when scrolling up
const loadMoreMessages = (index: number, done: (stop?: boolean) => void) => {
  const currentLength = displayedMessages.value.length;
  // check if all messages are loaded
  if (currentLength >= messages.value.length) {
    allMessagesLoaded.value = true;
    done(true);
    return;
  }

  // Simulate loading delay (replace in backend phase)
  setTimeout(() => {
    const loadCount = 20;
    const remainingMessages = messages.value.length - currentLength;
    const loadAmount = remainingMessages >= loadCount ? loadCount : remainingMessages;

    const startIndex = messages.value.length - currentLength - loadAmount;
    const newMessages = messages.value.slice(startIndex, startIndex + loadAmount);

    // Record current scroll position
    const scrollPosition = chatContent.value?.scrollHeight || 0;

    displayedMessages.value = newMessages.concat(displayedMessages.value);

    // Wait for DOM update before adjusting scroll
    nextTick(() => {
      if (chatContent.value) {
        // Calculate the new scroll position to maintain scroll offset
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
    if (!currentGroup || currentGroup.type !== message.type) {
      currentGroup = {
        type: message.type,
        messages: [message],
      };
      groups.push(currentGroup);
    } else {
      currentGroup.messages.push(message);
    }
  });

  return groups;
});

// Format message (@mention highlighting)
const formatMessageText = (text: string) => {
  const regex = new RegExp(`(${mentionTag})`, 'g');
  const formattedText = text.replace(regex, '<strong>$1</strong>');
  return formattedText;
};

// Sending a message
const sendMessage = () => {
  if (text.value.trim()) {
    const messageText = text.value.trim();
    const isMentioned = messageText.includes(`@${userName}`);

    const newMessage: Message = {
      id: '',
      createdBy: userName,
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
        createdBy: userName,
        text: '',
        isMentioned: false,
        image: reader.result as string,
        type: 'outgoing',
      };
      messageStore.addMessage(newMessage);

      // Scroll to bottom after sending an image
      nextTick(() => {
        scrollToBottom();
      });
    };
    reader.readAsDataURL(file);
  }
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
