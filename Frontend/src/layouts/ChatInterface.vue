<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Left Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      :mini="!expanded"
      :mini-width="56"
      :width="250"
      show-if-above
      :breakpoint="0"
      side="left"
      class="left-panel"
      id="left-panel"
    >
      <div class="left-panel-content">
        <q-list class="left-panel-list">
          <!-- Chats -->
          <q-item clickable v-ripple @click="handlePanelClick('chats')" :class="{'active-button': activePanel === 'chats'}">
            <q-item-section avatar>
              <i class="fas fa-comment left-panel-icon"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">Chats</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Channels -->
          <q-item clickable v-ripple @click="handlePanelClick('channels')" :class="{'active-button': activePanel === 'channels'}">
            <q-item-section avatar>
              <i class="fas fa-users left-panel-icon channel"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">Channels</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Requests -->
          <q-item clickable v-ripple @click="handlePanelClick('requests')" :class="{'active-button': activePanel === 'requests'}">
            <q-item-section avatar>
              <i class="fas fa-comment-dots left-panel-icon"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">Requests</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Archive -->
          <q-item clickable v-ripple @click="handlePanelClick('archive')" :class="{'active-button': activePanel === 'archive'}">
            <q-item-section avatar>
              <i class="fas fa-archive left-panel-icon"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">Archive</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-space />

        <!-- User Section -->
        <div :class="['bottom-section', { collapsed: !expanded }]" v-if="isWideScreen">
          <q-item clickable v-ripple class="user-item">
            <q-item-section avatar>
              <i class="fas fa-circle-user left-panel-icon user"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">User name</q-item-label>
            </q-item-section>
            <UserMenu/>
          </q-item>
          <q-item clickable v-ripple @click="toggleExpand" class="expand-item">
            <q-item-section avatar class="expand-colapse">
              <i class="fas fa-table-columns left-panel-icon"></i>
            </q-item-section>
          </q-item>
        </div>

        <template v-else>
          <q-item clickable v-ripple class="user-item">
            <q-item-section avatar>
              <i class="fas fa-circle-user left-panel-icon user"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">User name</q-item-label>
            </q-item-section>
            <UserMenu/>
          </q-item>
        </template>
      </div>
    </q-drawer>

    <!-- Right Drawer (Channel Members) -->
    <q-drawer
      v-model="isChannelMembersDrawerOpen"
      side="right"
      class="right-panel"
      :content-class="isWideScreen ? '' : 'fit'"
    >
      <q-card class="dialog">
        <q-card-section class="header">
          <q-label class="h">Channel Members</q-label>
        </q-card-section>

        <q-list>
          <q-item v-for="member in channelMembers" :key="member">
            <q-item-section>{{ member }}</q-item-section>
          </q-item>
        </q-list>

        <q-card-actions align="right" style="padding-top: 25px;">
          <q-btn flat label="Close" @click="isChannelMembersDrawerOpen = false" />
        </q-card-actions>
      </q-card>
    </q-drawer>

    <q-page-container>
      <!-- Panels -->
      <ChatList v-if="activePanel === 'chats' && (isWideScreen || showPanel)" @chat-item-click="handleChatItemClick" />
      <ChannelList v-if="activePanel === 'channels' && (isWideScreen || showPanel)" @chat-item-click="handleChatItemClick" />
      <RequestList v-if="activePanel === 'requests' && (isWideScreen || showPanel)" @chat-item-click="handleChatItemClick" />
      <ArchiveList v-if="activePanel === 'archive' && (isWideScreen || showPanel)" @chat-item-click="handleChatItemClick" />

      <!-- ChatInstance -->
      <ChatInstance
        v-if="isWideScreen || !showPanel"
        :title="titleChat"
        @open-channel-members="openChannelMembersDrawer"
      />
    </q-page-container>
  </q-layout>
</template>

<script scoped setup lang="ts">
import ArchiveList from 'src/components/ArchiveList.vue';
import RequestList from 'src/components/RequestList.vue';
import ChannelList from 'src/components/ChannelList.vue';
import ChatList from 'src/components/ChatList.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import ChatInstance from 'src/components/ChatInstance.vue';
import UserMenu from 'src/components/UserMenu.vue';
import { api } from 'src/boot/axios';

const leftDrawerOpen = ref(false);
const expanded = ref(false);
const isWideScreen = ref(window.innerWidth > 850);
const activePanel = ref<'chats' | 'channels' | 'requests' | 'archive'>('chats');
const showPanel = ref(false);
const titleChat = ref('New chat');

const isChannelMembersDrawerOpen = ref(false);
const channelMembers = ref<string[]>([]);

function updateScreenWidth() {
  isWideScreen.value = window.innerWidth > 850;
  if (!isWideScreen.value) {
    expanded.value = false;
    showPanel.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

function handlePanelClick(panel: 'chats' | 'channels' | 'requests' | 'archive') {
  if (activePanel.value === panel && !isWideScreen.value) {
    showPanel.value = !showPanel.value;
  } else {
    showPanel.value = true;
  }
  activePanel.value = panel;
}

function toggleExpand() {
  expanded.value = !expanded.value;
}

function handleChatItemClick(title: string) {
  titleChat.value = title;
}

async function openChannelMembersDrawer(channelName: string) {
  try {
    const response = await api.get('/get-channel-members', {
      params: { channelName }
    });

    if (response.data.success) {
      channelMembers.value = response.data.members;
      isChannelMembersDrawerOpen.value = true;
    } else {
      console.error('Failed to fetch channel members:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching channel members:', error);
  }
}
</script>
