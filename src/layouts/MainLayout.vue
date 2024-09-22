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
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <i class="fas fa-comment left-panel-icon"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">Chats</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <i class="fas fa-users left-panel-icon channel"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">Channels</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <i class="fas fa-comment-dots left-panel-icon"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label class="left-panel-text">Requests</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
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
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineOptions({
  name: 'MainLayout',
});

const isWideScreen = ref(window.innerWidth > 800);

const updateScreenWidth = () => {
  isWideScreen.value = window.innerWidth > 800;
  if (isWideScreen.value == false) {
    expanded.value = false;
  }
};

// Set up event listeners for window resize
onMounted(() => {
  window.addEventListener('resize', updateScreenWidth);
});

// Clean up the event listener
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

const leftDrawerOpen = ref(false);
const expanded = ref(false);

function toggleExpand() {
  expanded.value = !expanded.value;
}
</script>
