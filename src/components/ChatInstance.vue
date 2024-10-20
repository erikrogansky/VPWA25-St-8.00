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
              <q-item-label class="chat-header-chat-name">Chat name</q-item-label>
            </div>
            <div>
              <q-item-label class="chat-header-active-status">Active</q-item-label>
            </div>
          </q-item-section>
        </q-item>
      </div>

      <!-- Chat content (messages) -->
      <div class="chat-content">
        <transition name="fade" appear>
          <div class="chat-bubble-row incoming">
            <i v-if="text.length > 0" class="fas fa-circle-user profile-picture" />
            <div v-if="text.length > 0" style="display: flex; flex-direction: column;">
              <span v-if="showTypingText" class="sender">Name</span>
              <q-bubble v-if="text.length > 0" class="bubble text-message typing-indicator" @click="showTypingText = !showTypingText">
                <span v-if="!showTypingText"><q-spinner-dots size="20px" /></span>
                <span v-else>{{ text }}</span>
              </q-bubble>
            </div>
          </div>
        </transition>

        <div
          v-for="(group, index) in [...groupedMessages].reverse()"
          :key="index"
          class="chat-bubble-row"
          :class="group.type"
        >
          <i
            v-if="group.type === 'incoming'"
            class="fas fa-circle-user profile-picture"
          />
          <div class="messages" :class="group.type">
            <span v-if="group.type === 'incoming'" class="sender">Name</span>
            <q-bubble
              v-for="(message, i) in group.messages"
              :key="i"
              class="bubble"
              :class="{
                'text-message': message.text,
                'image-message': message.image,
                'highlighted-message': message.mentioned, // Apply class if mentioned
              }"
            >
              <div v-if="message.text" v-html="formatMessageText(message.text)"></div>
              <img
                v-if="message.image"
                :src="message.image"
                alt="Sent image"
                class="chat-image"
              />
            </q-bubble>
          </div>
        </div>
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

<script setup scoped lang="ts">
import { ref, computed } from 'vue';

// Message interface
interface Message {
  text?: string;
  image?: string;
  type: string;
  mentioned?: boolean; // New property to indicate a mention
}

// Message group interface
interface MessageGroup {
  type: string;
  messages: Message[];
}

// Chat data
const userName = 'name'; // User name - TEMPORARY (replace in backend phase)
const mentionTag = `@${userName}`;

const text = ref<string>('');
const messages = ref<Message[]>([]);
const showTypingText = ref<boolean>(false);

const groupedMessages = computed<MessageGroup[]>(() => {
  const groups: MessageGroup[] = [];
  let currentGroup: MessageGroup | null = null;

  messages.value.forEach((message) => {
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

const formatMessageText = (text: string) => {
  const regex = new RegExp(`(${mentionTag})`, 'g');
  const formattedText = text.replace(regex, '<strong>$1</strong>');
  return formattedText;
};

// Sending a message
const sendMessage = () => {
  if (text.value.trim()) {
    const messageText = text.value.trim();
    const isMentioned = messageText.includes('@name'); // Detect mention

    messages.value.push({
      text: messageText,
      type: 'outgoing',
      mentioned: isMentioned,
    });

    text.value = '';
    showTypingText.value = false;

    // Simulating incoming messages
    if (Math.random() < 0.5) {
      setTimeout(() => {
        simulateIncomingMessage();
      }, 1000);

      if (Math.random() < 0.65) {
        setTimeout(() => {
          simulateIncomingMessage();
        }, 2000);
      }
    }
  }
};

// Function to simulate incoming messages
const simulateIncomingMessage = () => {
  const incomingMessages = [
    'This is a reply!',
    '@name, you have a new message.',
    'Hello!',
    '@name, don\'t forget our meeting.',
  ];

  const randomMessage =
    incomingMessages[Math.floor(Math.random() * incomingMessages.length)];
  const isIncomingMentioned = randomMessage.includes('@name'); // Detect mention

  messages.value.push({
    text: randomMessage,
    type: 'incoming',
    mentioned: isIncomingMentioned,
  });
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
      messages.value.push({
        image: reader.result as string,
        type: 'outgoing',
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

</style>
