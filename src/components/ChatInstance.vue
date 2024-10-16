<template>
  <q-page id="chat-page">
    <div class="chat-container">
      <div class="chat-header">
        <q-item class="chat-header-info">
          <q-item-section avatar>
            <i class="fas fa-circle-user"></i>
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

      <div class="chat-content">
        <div
          v-for="(group, index) in [...groupedMessages].reverse()"
          :key="index"
          class="chat-bubble-row"
          :class="group.type"
        >
          <q-bubble v-for="(message, i) in group.messages" :key="i" class="bubble" :class="{'text-message': message.text,'image-message': message.image}">
            <div v-if="message.text">{{ message.text }}</div>
            <img v-if="message.image" :src="message.image" alt="Sent image" class="chat-image" />
          </q-bubble>
        </div>
      </div>

      <div class="chat-footer">
        <q-item class="photos">
          <q-item-section>
            <i class="far fa-image" @click="selectImage"></i>
            <input type="file" ref="fileInput" @change="handleImageUpload" style="display:none" accept="image/*" />
          </q-item-section>
        </q-item>
        <q-input
          rounded
          standout
          dense
          v-model="text"
          placeholder="Aa"
          class="text-bar"
          @keyup.enter="sendMessage"
        />
        <transition name="fade" appear>
          <q-btn v-if="text.length > 0" icon="send" @click="sendMessage" flat round dense class="send" />
        </transition>
      </div>
    </div>
  </q-page>
</template>


<script setup scoped lang="ts">
import { ref, computed } from 'vue';

interface Message {
  text?: string;
  image?: string;
  type: string;
}

interface MessageGroup {
  type: string;
  messages: Message[];
}

const text = ref<string>('');
const messages = ref<Message[]>([]);

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

const sendMessage = () => {
  if (text.value.trim()) {
    messages.value.push({
      text: text.value,
      type: 'outgoing',
    });

    text.value = '';

    // Simulating incoming messages
    if (Math.random() < 0.5) {
      setTimeout(() => {
        messages.value.push({
          text: 'This is a reply!',
          type: 'incoming',
        });
      }, 1000);

      if (Math.random() < 0.65) {
        setTimeout(() => {
          messages.value.push({
            text: 'This is another reply!',
            type: 'incoming',
          });
        }, 2000);
      }
    }
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
  background: $scrollbar !important;
  border-radius: 10px;
  border: 3px solid $primary !important;
}

::-webkit-scrollbar-thumb:hover {
  background: $scrollbar-hover !important;
}

body.body--light ::-webkit-scrollbar-thumb {
  background: $l-scrollbar !important;
  border: 3px solid $l-primary !important;
}

body.body--light ::-webkit-scrollbar-thumb:hover {
  background: $l-scrollbar-hover !important;
}

</style>
