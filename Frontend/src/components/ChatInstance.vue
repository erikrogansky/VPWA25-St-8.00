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
                  <q-item clickable v-close-popup @click="openChannelMembersModal">
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
              <i v-if="text.length > 0 && !text.startsWith('/')" class="fas fa-circle-user profile-picture" />
              <div v-if="text.length > 0 && !text.startsWith('/')" style="display: flex; flex-direction: column;">
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
        <q-input rounded standout dense v-model="text" placeholder="Aa" class="text-bar" @keyup.enter="handleMessage" />
        <transition name="fade" appear>
          <q-btn v-if="text.length > 0" icon="send" @click="handleMessage" flat round dense class="send" />
        </transition>
      </div>

      <!-- Channel Members Modal -->
      <q-dialog v-model="isChannelMembersModalOpen">
        <q-card class="dialog">
          <q-card-section class="header">
            <q-label class="h">Channel Members</q-label>
          </q-card-section>

          <q-list>
            <q-item v-for="member in channelMembers" :key="member">
              <q-item-section>{{ member }}</q-item-section>
              <q-item-section side>
                <q-btn color="negative" label="Kick" @click="kickMember(member)" />
              </q-item-section>
            </q-item>
          </q-list>

          <q-card-actions align="right" style="padding-top: 25px;">
            <q-btn flat label="Close" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue';
import { useMessageStore } from 'src/stores/message_store';
import { useUserStore } from 'src/stores/user_store';
import { subscribeToMessages } from 'src/boot/socket';
import { api } from 'src/boot/axios';
import axios from 'axios';

const messageStore = useMessageStore();
const userStore = useUserStore();

const messages = ref(messageStore.messages);
const displayedMessages = ref(messageStore.allMessages);

const props = defineProps<{
  title: string
}>();

const channelMembers = ref<string[]>([]);
const isChannelMembersModalOpen = ref(false);

watch(() => props.title, (newTitle) => {
  messageStore.fetchMessages(newTitle);
  subscribeToMessages(newTitle);
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
const userName = ref('');
const mentionTag = ref('');

onMounted(async () => {
  await userStore.fetchUser();
  userName.value = userStore.user?.nick || '';
  mentionTag.value = `@${userName.value}`;
});

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

import { useQuasar } from 'quasar';
const $q = useQuasar();

// Command handling - Parser
const parseCommand = async (command: string) => {
  const parsedArray = command.split(' ');
  const action = parsedArray[0];
  const entityName = parsedArray[1];
  const channelSettings = parsedArray[2];

  if (!entityName) {
    $q.notify({
      position: 'top',
      type: 'negative',
      message: 'Please provide a name.',
    });
    return;
  }
  if (channelSettings && !['private'].includes(channelSettings)) {
    $q.notify({
      position: 'top',
      type: 'negative',
      message: 'Invalid channel settings.',
    });
    return;
  }


  try {
    let response;
    switch (action) {
      // Invite
      case '/invite':
        response = await api.post('/send-invite', { userName: entityName, channelName: props.title });
        $q.notify({
          position: 'top',
          type: 'positive',
          message: response.data.message || 'Invitation sent!',
        });
        break;
      // Revoke
      case '/revoke':
        response = await api.post('/revoke-user', { userName: entityName, channelName: props.title });
        $q.notify({
          position: 'top',
          type: 'positive',
          message: response.data.message || 'User revoked successfully!',
        });
        break;
      // Kick
      case '/kick':
        //response = await api.post('/kick', { entityName });
        $q.notify({
          position: 'top',
          type: 'positive',
          message: /*response.data.message ||*/ 'User kicked successfully!',
        });
        break;
      case '/join':
        response = await api.post('/join-channel', { channelName: entityName, channelSettings: channelSettings });
        $q.notify({
          position: 'top',
          type: 'positive',
          message: response.data.message || 'Joined channel successfully!',
        });
        break;
      default:

        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'Invalid command!',
        });
    }
  } catch (error) {
    // potom mozno zmenit na swtich a zmenit poradie
    if (axios.isAxiosError(error) && error.response ) {
      // Already a member
      if(error.response.status === 400 && error.response.data.message === 'Already a member') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'You are already a member of this channel.',
        });
      // Private channel
      } else if (error.response.status === 403 && error.response.data.message === 'Private channel') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'Cannot join a private channel.',
        });
      // Channel not found
      } else if (error.response.status === 404 && error.response.data.message === 'Channel not found') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'Channel not found.',
        });
      // User not found
      } else if (error.response.status === 404 && error.response.data.message === 'User not found') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'User not found',
        });
      // Invites - Only admin invites (private channel)
      } else if (error.response.status === 403 && error.response.data.message === 'OnlyAdminInvites') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'Only the channel admin can send invites.',
        });
      // Invites - User error - not a member
      } else if (error.response.status === 403 && error.response.data.message === 'You are not a member of this channel') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'You are not a member of this channel',
        });
      // Invites - User error - already a member
      } else if (error.response.status === 400 && error.response.data.message === 'InviteAlreadyMember') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'User is already a member of this channel',
        });
      // Revoke - Only admin revokes
      } else if (error.response.status === 403 && error.response.data.message === 'OnlyAdminRevoke') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'Only the channel admin can revoke users.',
        });
      } else if (error.response.status === 400 && error.response.data.message === 'UserNotInChannel') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'User is not in this channel.',
        });
      }
    } else {
      $q.notify({
        position: 'top',
        type: 'negative',
        message: 'An error occurred while processing the commandos.',
      });
    }
  }
};

const handleMessage = () => {
  if (text.value.startsWith('/')) {
    parseCommand(text.value);
    text.value = '';
  } else {
    sendMessage();
    showTypingText.value = false;
  }
};

// Open channel members
const openChannelMembersModal = () => {
  channelMembers.value = ['Member 1', 'Member 2', 'Member 3'];
  isChannelMembersModalOpen.value = true;
};

// Kick member
const kickMember = (member: string) => {
  alert(`Kicked ${member}`);
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

// End of script
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

.dialog {
  background-color: var(--popup);
  color: var(--font);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  border-radius: 14px;
  width: 450px;
  height: auto;

  i {
    font-size: 18px;
  }

  .q-separator {
    background-color:var(--popup-separator);
    margin: 0 12px;
  }

  .q-item--active {
    color: var(--font);
    opacity: 0.8;
  }


  .header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    font-size: 15px;
    font-weight: bold;

    :deep(.q-focus-helper) {
      display: none;
    }

    .h {
      font-size: 20px;
    }

    .q-btn {
      position: absolute;
      right: 10px;
      top: 15px;
      min-height: min-content;
      padding: 0;


      :hover {
        color: var(--font-hover);
      }
    }
  }
  :deep(.q-toggle__thumb) {
    height: 15px;
    width: 15px;
  }

  :deep(.q-toggle__inner) {
    height: 18px;
    width: 28.5px;
  }

  :deep(.q-toggle__inner--truthy .q-toggle__track) {
    opacity: 1;
  }

  :deep(.q-toggle__track) {
    height: 18px;
    width: 28px;
    border-radius: 100px;
    background: var(--toggle);

    position: absolute;
    bottom: 1.25px;
    right: 2px
  }

  .section {
    .q-btn {
      font-weight: 400;
    }
  }

  .delete-account {
    font-size: 14px;
    color: var(--negative);
    text-decoration: underline;

    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;

    padding-top: 4px;

    .action-btn {
      :deep(.q-focus-helper) {
        display: none;
      }
      :hover {
        opacity: 0.8;
      }
      padding: 0;
    }
  }

  .section-name {
    font-size: 14px;
    opacity: 0.5;
    font-weight: 400;
  }

  .section-item-description {
    font-size: 11px;
    opacity: 0.5;
    font-weight: 300;
    margin-right: 80px;
    padding-top: 2px;
  }

  .section-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 4px;

    .action-btn {
      :deep(.q-focus-helper) {
        display: none;
      }

      :hover {
        color: var(--font-hover);
      }

      padding: 0;


      .action {
        font-size: 12px;
        padding-right: 8px;
        padding-top: 3px;
      }

      i {
        font-size: 16px;
      }
    }
  }

}
</style>
