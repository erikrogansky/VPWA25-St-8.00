<template>
  <q-menu v-model="menuOpen" class="user-popup">
    <q-list style="min-width: 290px; height: auto;">

      <!-- Account -->
      <q-item clickable @click="accountDialog = true">
        <q-item-section avatar><i class="fas fa-user"></i></q-item-section>
        <q-item-section>Account</q-item-section>

        <q-dialog v-model="accountDialog" @hide="accountSettings = false">
          <q-card class="account">

            <q-card-section class="header">
              <q-label class="h">Account settings</q-label>
              <q-btn flat round dense><i class="fas fa-close"></i></q-btn>
            </q-card-section>

            <q-card-section class="section">
              <div class="section-name">Account</div>
              <div class="section-item"><q-label class="name">ErikR7</q-label><q-btn flat no-caps dense class="action-btn"><q-label class="action">Edit nick</q-label><i class="fas fa-edit"></i></q-btn></div>
              <div class="section-item"><q-label class="name">Erik Roganský</q-label><q-btn flat no-caps dense class="action-btn"><q-label class="action">Edit name</q-label><i class="fas fa-edit"></i></q-btn></div>
              <div class="section-item"><q-label class="name">Male</q-label><q-btn flat no-caps dense class="action-btn"><q-label class="action">Edit gender</q-label><i class="fas fa-edit"></i></q-btn></div>
              <div class="section-item"><q-label class="name">+421 911 111 111</q-label><q-btn flat no-caps dense class="action-btn"><q-label class="action">Edit phone</q-label><i class="fas fa-edit"></i></q-btn></div>
              <div class="delete-account"><q-btn flat no-caps dense class="action-btn">Delete account</q-btn></div>
            </q-card-section>

          </q-card>
        </q-dialog>
      </q-item>

      <!-- Preferences -->
      <q-item clickable @click="preferencesDialog = true">
        <q-item-section avatar><i class="fas fa-gear"></i></q-item-section>
        <q-item-section>Preferences</q-item-section>

        <q-dialog v-model="preferencesDialog" @hide="menuOpen = false">
          <q-card class="preferences">

            <q-card-section class="header">
              <q-label class="h">Preferences</q-label>
              <q-btn flat round dense><i class="fas fa-close"></i></q-btn>
            </q-card-section>

            <q-card-section class="section">
              <div class="section-name">Active status</div>
              <div class="section-item"><q-label class="name">On</q-label><q-radio keep-color dense size="sm" v-model="activeStatus" val="on" color="white" /></div>
              <div class="section-item"><q-label class="name">Off</q-label> <q-radio keep-color dense size="sm" v-model="activeStatus" val="off" color="white" /></div>
              <div class="section-item"><q-label class="name">Do Not Disturb</q-label><q-radio keep-color dense size="sm" v-model="activeStatus" val="dnd" color="white" /></div>
              <div class="section-item-description">Please note that the notifications will be disabled until you turn the Do Not Disturb mode off.</div>
            </q-card-section>

            <q-separator />

            <q-card-section class="section">
              <div class="section-name">Notifications</div>
              <div class="section-item"><q-label class="name">Display notifications</q-label><q-toggle class="custom-toggle" keep-color dense size="sm" v-model="notifications" val="display" color="white" /></div>
              <div class="section-item"><q-label class="name">Play notification sound</q-label> <q-toggle class="custom-toggle" keep-color dense size="sm" v-model="notifications" val="sound" color="white" /></div>
            </q-card-section>

            <q-separator />

            <q-card-section class="section">
              <div class="section-name">Dark mode</div>
              <div class="section-item"><q-label class="name">On</q-label><q-radio keep-color dense size="sm" v-model="mode" val="on" color="white" /></div>
              <div class="section-item"><q-label class="name">Off</q-label> <q-radio keep-color dense size="sm" v-model="mode" val="off" color="white" /></div>
              <div class="section-item"><q-label class="name">System preferences</q-label><q-radio keep-color dense size="sm" v-model="mode" val="sp" color="white" /></div>
              <div class="section-item-description">The display will be automatically adjusted based on your system preferences.</div>
            </q-card-section>

            <q-separator />



            <q-separator />

            <!-- <q-card-actions align="right">
              <q-btn flat label="Decline" color="primary" v-close-popup />
              <q-btn flat label="Accept" color="primary" v-close-popup />
            </q-card-actions> -->
          </q-card>
        </q-dialog>
      </q-item>
      <q-separator />

      <!-- Help -->
      <q-item clickable v-close-popup>
        <q-item-section avatar><i class="fas fa-circle-question"></i></q-item-section>
        <q-item-section>Help</q-item-section>
      </q-item>
      <q-separator />

      <!-- Terms & Conditions -->
      <q-item clickable v-close-popup to="/terms-and-conditions">
        <q-item-section avatar><i class="fas fa-align-left"></i></q-item-section>
        <q-item-section>Terms & Conditions</q-item-section>
      </q-item>
      <q-item clickable v-close-popup to="/privacy-policy">
        <q-item-section avatar><i class="fas fa-align-left"></i></q-item-section>
        <q-item-section>Privacy Policy</q-item-section>
      </q-item>
      <q-item clickable v-close-popup to="/cookie-policy">
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
</template>

<script setup scoped lang="ts">
import { ref, watch } from 'vue';
import { useModeStore } from '../stores/mode-store';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const accountDialog = ref(false);
const preferencesDialog = ref(false);
const menuOpen = ref(false);
const accountSettings = ref(false);
const activeStatus = ref('on');
const modeStore = useModeStore();
const notifications = ref(['display', 'sound']);

const mode = ref(modeStore.mode);

import { Cookies } from 'quasar';

watch(() => modeStore.mode, (newMode) => {
  mode.value = newMode;
  updateDarkMode(newMode);
});

watch(mode, (newMode) => {
  modeStore.setMode(newMode);
  Cookies.set('themeMode', newMode, { expires: 7 });
});

function updateDarkMode(newMode: string) {
  switch (newMode) {
    case 'on':
      $q.dark.set(true);
      document.documentElement.setAttribute('data-theme', 'dark');
      break;
    case 'off':
      $q.dark.set(false);
      document.documentElement.setAttribute('data-theme', 'light');
      break;
    case 'sp':
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      $q.dark.set(isDark);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      break;
  }
}

const storedMode = Cookies.get('themeMode');

if (storedMode && (storedMode === 'on' || storedMode === 'sp' || storedMode === 'off')) {
  mode.value = storedMode;
  modeStore.setMode(storedMode);
  updateDarkMode(storedMode);
} else {
  const defaultMode = modeStore.mode;
  mode.value = defaultMode;
  updateDarkMode(defaultMode);
}

</script>


<style lang="scss" scoped>
.preferences, .account {
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
</style>
