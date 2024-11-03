<template>
  <q-layout view="hHh lpr fff">

    <HeaderLayout/>

    <q-page-container>
      <div class="left-container">
        <q-label class="title">
          Stay connected anytime,<br />anywhere
        </q-label>
        <q-paragraph class="paragraph">
          Discover a new way to chat and share moments with friends and family—effortless, engaging, and always at your fingertips.
        </q-paragraph>
        <div class="buttons">
          <template v-if="isAuthenticated">
            <q-btn unelevated rounded :label="`Continue as ${userName || 'Guest'}`" to="/app" no-caps class="join-btn" />
            <q-btn flat rounded label="Log out" @click="logout" no-caps class="log-btn" />
          </template>
          <template v-else>
            <q-btn unelevated rounded label="Join now" to="/register" no-caps class="join-btn" />
            <q-btn flat rounded label="Log in" to="/login" no-caps class="log-btn" />
          </template>
        </div>
      </div>
      <div class="right-container">
      </div>
    </q-page-container>

    <FooterLayout/>

  </q-layout>
</template>

<script scoped setup lang="ts">

import HeaderLayout from 'src/components/HeaderLayout.vue';
import FooterLayout from 'src/components/FooterLayout.vue';
import { computed, ref } from 'vue';
import axios from 'axios'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar';
import { onBeforeMount } from 'vue';

const $q = useQuasar()

const hasToken = computed(() => !!localStorage.getItem('authToken'));
const isAuthenticated = hasToken.value ? ref(true) : ref(false);

const userName = ref('');

onBeforeMount(async () => {
  if (isAuthenticated.value) {
    try {
      const response = await api.get('/get-user-name');
      if (response.data && response.data.firstName) {
        userName.value = response.data.firstName + response.data.lastName;
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }
});

async function logout() {
  try {
    const token = localStorage.getItem('authToken');
    if (token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const response = await api.post('/logout');

    if (response.data.success) {
        $q.notify({
          type: 'positive',
          message: response.data.message || 'You have been succesfully logged out',
          position: 'top',
        });

        localStorage.removeItem('authToken');

        isAuthenticated.value = false;
        userName.value = '';
      } else {
        $q.notify({
          type: 'negative',
          message: response.data.error || 'Logout failed',
          position: 'top',
        });
      }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
        $q.notify({
          type: 'negative',
          message: error.response.data?.error || 'Logout failed due to a server error',
          position: 'top',
        });
      } else {
        $q.notify({
          type: 'negative',
          message: 'Logout failed unexpectedly',
          position: 'top',
        });
      }
  }
}

</script>


<style scoped lang="scss">
* {
  color: var(--font);
}

.q-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.q-page-container {
  background-color: var(--primary);
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: center;

  .left-container {
    width: 720px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    padding: 0 125px;

    .title {
      font-size: 56px;
      font-weight: bolder;
      background: var(--title);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.3;
      padding-bottom: 30px;
    }

    .paragraph {
      font-size: 16px;
      padding-bottom: 30px;
    }
  }

  .right-container {
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .buttons {
    display: flex;
    flex-direction: row;

    * {
      font-size: 15px;
      font-weight: 400;
    }

    .join-btn {
      background: var(--chat-bubble-outgoing);
      color: var(--font-white);
      margin-right: 10px;
      padding-left: 20px;
      padding-right: 20px;
    }

    .log-btn {
      text-decoration: underline;
    }
  }
}

@media (max-height: 650px) {
  .left-container {
    padding-top: 50px !important;
    padding-bottom: 50px !important;
  }
}

@media (max-width: 600px) {
  .left-container {
    padding-left: 50px !important;
    padding-right: 50px !important;
  }
}

@media (max-width: 375px) {
  .left-container {
    padding-left: 25px !important;
    padding-right: 0 !important;
  }
}
</style>
