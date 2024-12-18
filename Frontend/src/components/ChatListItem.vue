<template>
  <q-item class="chat-item" @mouseover="hover" @mouseleave="unhover">
    <q-item-section avatar>
      <i class="fas fa-circle-user"></i>
      <i v-if="chat" class="fas fa-circle active-status-help" />
      <i v-if="chat" class="fas fa-circle active-status" :style="{ color: statusCol }"/>
      <i v-if="channel" class="fas fa-circle public-private-help" />
      <img v-if="channel" :src="imageSrc" class="public-private" />
    </q-item-section>
    <q-item-section>
      <div class="chat-item-content">
        <q-item-label class="chat-name">{{ title }}</q-item-label>
        <q-item-label class="chat-message" :class="unread ? 'unread' : ''">{{ lastMessage }}</q-item-label>
      </div>
    </q-item-section>
    <transition name="fade" appear>
      <div v-show="show" class="hover-icon" style="cursor: pointer;">
        <i class="fas fa-ellipsis"></i>
        <q-menu v-if="chat" anchor="bottom left" self="top left" @show="onMenuShow" @hide="onMenuHide" class="user-popup">
          <q-list style="min-width: 200px; height: auto;">
            <q-item clickable @click="onMenuItemClick" v-close-popup>
              <q-item-section avatar><i class="fas fa-envelope"></i></q-item-section>
              <q-item-section>Mark as read</q-item-section>
            </q-item>
            <q-item clickable @click="onMenuItemClick" v-close-popup>
              <q-item-section avatar><i class="fas fa-user"></i></q-item-section>
              <q-item-section>View profile</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="onMenuItemClick" v-close-popup>
              <q-item-section avatar><i class="fas fa-box-archive"></i></q-item-section>
              <q-item-section>Archive chat</q-item-section>
            </q-item>
            <q-item clickable @click="leaveChannel('delete')" v-close-popup>
              <q-item-section avatar><i class="fas fa-trash"></i></q-item-section>
              <q-item-section>Delete chat</q-item-section>
            </q-item>
          </q-list>
        </q-menu>

        <q-menu v-else-if="channel" anchor="bottom left" self="top left" @show="onMenuShow" @hide="onMenuHide" class="user-popup">
          <q-list style="min-width: 200px; height: auto;">
            <q-item clickable @click="onMenuItemClick" v-close-popup>
              <q-item-section avatar><i class="fas fa-envelope"></i></q-item-section>
              <q-item-section>Mark as read</q-item-section>
            </q-item>
            <q-item clickable @click="onMenuItemClick" v-close-popup>
              <q-item-section avatar><i class="fas fa-user"></i></q-item-section>
              <q-item-section>View profile</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="onMenuItemClick" v-close-popup>
              <q-item-section avatar><i class="fas fa-box-archive"></i></q-item-section>
              <q-item-section>Archive channel</q-item-section>
            </q-item>
            <q-item v-if="isOwner" clickable @click="leaveChannel('delete')" v-close-popup>
              <q-item-section avatar><i class="fas fa-right-from-bracket"></i></q-item-section>
              <q-item-section>Delete channel</q-item-section>
            </q-item>
            <q-item v-else clickable @click="leaveChannel()" v-close-popup>
              <q-item-section avatar><i class="fas fa-right-from-bracket"></i></q-item-section>
              <q-item-section>Leave channel</q-item-section>
            </q-item>
          </q-list>
        </q-menu>

        <q-menu v-else-if="request" anchor="bottom left" self="top left" @show="onMenuShow" @hide="onMenuHide" class="user-popup">
          <q-list style="min-width: 200px; height: auto;">
            <q-item clickable @click="acceptRequest" v-close-popup>
              <q-item-section avatar><i class="fas fa-check"></i></q-item-section>
              <q-item-section>Accept request</q-item-section>
            </q-item>
            <q-item clickable @click="declineRequest" v-close-popup>
              <q-item-section avatar><i class="fas fa-xmark"></i></q-item-section>
              <q-item-section>Decline request</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </transition>
  </q-item>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

const show = ref(false);
const hovering = ref(false);
const menuOpen = ref(false);

import { api } from 'src/boot/axios';
import { useRequestStore } from 'src/stores/request-store';
import { useChannelStore } from 'src/stores/channel_store';

const requestStore = useRequestStore();
const channelStore = useChannelStore();

const props = withDefaults(defineProps<{
  title: string
  lastMessage: string
  unread?: boolean
  chat?: boolean
  request?: boolean
  channel?: boolean
  isPublic?: boolean
  isOwner?: boolean
}>(), {
  isPublic: false
});

const statusCol = ref('');

onBeforeMount(async () => {
  if (props.chat) {
    try {
      const response = await api.get('/get-user-status', {
        params: {
          nick: props.title
        }
      });

      if (response.data.status === 'active') {
        statusCol.value = 'lime';
      } else if (response.data.status === 'offline') {
        statusCol.value = 'grey';
      } else {
        statusCol.value = 'red';
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  }
});

const hover = () => {
  hovering.value = true;
  setTimeout(() => {
    show.value = hovering.value || menuOpen.value;
  }, 200);
};

const unhover = () => {
  hovering.value = false;
  setTimeout(() => {
    if (!menuOpen.value) {
      show.value = false;
    }
  }, 200);
};

const onMenuShow = () => {
  menuOpen.value = true;
  show.value = true;
};

const onMenuHide = () => {
  menuOpen.value = false;
  if (!hovering.value) {
    show.value = false;
  }
};

const onMenuItemClick = () => {
  menuOpen.value = false;
  show.value = false;
};

const publicImage = '/src/assets/public.svg';
const privateImage = '/src/assets/padlock.svg';

const imageSrc = ref(props.isPublic ? publicImage : privateImage);



const acceptRequest = async () => {
  menuOpen.value = false;
  show.value = false;
  try {
    await api.post('/accept-request', {
      title: props.title
    });

    await requestStore.fetchChats();

  } catch (error) {
    console.error('Error accepting request:', error);
  }
};

const declineRequest = async () => {
  menuOpen.value = false;
  show.value = false;
  try {
    const response = await api.post('/decline-request', {
      title: props.title
    });

    if (response.data.success === false) {
      console.error('Error declining request:', response.data.message);
    } else {
      await requestStore.fetchChats();
    }

  } catch (error) {
    console.error('Error declining request:', error);
  }
};

const leaveChannel = async (request: string = '') => {
  menuOpen.value = false;
  show.value = false;
  try {
    const response = await api.post('/leave-channel', {
      title: props.title,
      action: request
    });

    if (response.data.success === false) {
      console.error('Error declining request:', response.data.message);
    } else {
      await channelStore.fetchChannels();
    }

  } catch (error) {
    console.error('Error declining request:', error);
  }
};
</script>

<style lang="scss" scoped>
.active-status-help {
  position: absolute;
  font-size: 17px;
  bottom: 3.5px;
  left: 31.5px;
  color: var(--primary-darker-15);
}

.active-status {
  position: absolute;
  font-size: 12px;
  bottom: 6px;
  left: 34px;
}

.unread {
  font-weight: 600;
}

.public-private-help {
  position: absolute;
  font-size: 17px;
  bottom: 3.5px;
  left: 31.5px;
  color: var(--primary-darker-15);
}

.public-private {
  position: absolute;
  width: 12px;
  bottom: 6px;
  left: 34px;
}
</style>
