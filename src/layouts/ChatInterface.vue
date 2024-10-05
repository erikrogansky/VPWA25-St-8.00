<template>
  <q-layout view="lHh Lpr lFf">
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
          <q-item clickable v-ripple @click="setActivePanel('chats')" :class="{'active-button': activePanel === 'chats'}">
            <q-item-section avatar>
              <i class="fas fa-comment left-panel-icon"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">Chats</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="setActivePanel('channels')" :class="{'active-button': activePanel === 'channels'}">
            <q-item-section avatar>
              <i class="fas fa-users left-panel-icon channel"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">Channels</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="setActivePanel('requests')" :class="{'active-button': activePanel === 'requests'}">
            <q-item-section avatar>
              <i class="fas fa-comment-dots left-panel-icon"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">Requests</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="setActivePanel('archive')" :class="{'active-button': activePanel === 'archive'}">
            <q-item-section avatar>
              <i class="fas fa-archive left-panel-icon"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">Archive</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-space />
        <template v-if="isWideScreen">
          <div :class="['bottom-section', { collapsed: !expanded }]">
            <q-item clickable v-ripple class="user-item">
              <q-item-section avatar>
                <i class="fas fa-circle-user left-panel-icon user"></i>
              </q-item-section>
              <q-item-section v-if="expanded">
                <q-item-label class="left-panel-text">User name</q-item-label>
              </q-item-section>

              <q-menu class="user-popup">
                <q-list style="min-width: 290px; height: auto;">
                  <q-item clickable v-close-popup>
                    <q-item-section avatar><i class="fas fa-gear"></i></q-item-section>
                    <q-item-section>Preferences</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup>
                    <q-item-section avatar><i class="fas fa-circle-question"></i></q-item-section>
                    <q-item-section>Help</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup>
                    <q-item-section avatar><i class="fas fa-align-left"></i></q-item-section>
                    <q-item-section>Terms & Conditions</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section avatar><i class="fas fa-align-left"></i></q-item-section>
                    <q-item-section>Privacy Policy</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section avatar><i class="fas fa-align-left"></i></q-item-section>
                    <q-item-section>Cookie Policy</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup to="/">
                    <q-item-section avatar><i class="fas fa-right-from-bracket"></i></q-item-section>
                    <q-item-section>Log out</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
            <q-item
              clickable
              v-ripple
              @click="toggleExpand"
              class="expand-item"
            >
              <q-item-section avatar class="expand-colapse">
                <i class="fas fa-table-columns left-panel-icon"></i>
              </q-item-section>
            </q-item>
          </div>
        </template>
        <template v-else>
          <q-item clickable v-ripple class="user-item">
            <q-item-section avatar>
              <i class="fas fa-circle-user left-panel-icon user"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">User name</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </div>
    </q-drawer>

    <q-page-container>

      <ChatList v-if="activePanel === 'chats'" />
      <ChannelList v-if="activePanel === 'channels'" />
      <RequestList v-if="activePanel === 'requests'" />
      <ArchiveList v-if="activePanel === 'archive'" />

      <ChatInstance/>

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

const isWideScreen = ref(window.innerWidth > 1100);

const updateScreenWidth = () => {
  isWideScreen.value = window.innerWidth > 1100;
  if (isWideScreen.value == false) {
    expanded.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

const leftDrawerOpen = ref(false);
const expanded = ref(false);

function toggleExpand() {
  expanded.value = !expanded.value;
}

const activePanel = ref<'chats' | 'channels' | 'requests' | 'archive'>('chats');

function setActivePanel(panel: 'chats' | 'channels' | 'requests' | 'archive') {
  activePanel.value = panel;
}
</script>
