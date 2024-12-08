<template>
  <q-layout view="hHh p fff">
    <q-page-container>
      <q-card flat class="q-pa-md">

        <q-card-section class="text-center top-part">
          <router-link to="/"><img :src="logoSource" alt="Convo's logo"/></router-link>
          <div class="q-pa-sm header">Sign In</div>
        </q-card-section>

        <!---------- Start of Form ---------->
        <form @submit.prevent="validateAndSubmit">
          <q-card-section>

            <!-- Email Address-->
            <q-input rounded standout v-model="email" label="Email Address"
              :error="!!emailError" :error-message="emailError" :class="{'padding-err': !!emailError}"
            ></q-input>

            <!-- Password -->
            <q-input rounded standout v-model="password" type="password" label="Password" class="q-mt-md"
              :error="!!passwordError" :error-message="passwordError" :class="{'padding-err': !!passwordError}"
            ></q-input>

          </q-card-section>

          <div class="text-8 text-center terms-text"> By signing in, you agree with Convo's
            <router-link to="/privacy-policy">Privacy Policy</router-link> and
            <router-link to="/terms-and-conditions">Terms of Service</router-link>
          </div>

          <q-card-section>
            <q-btn unelevated rounded label="Sign In" no-caps class="login-btn" type="submit"></q-btn>
          </q-card-section>
        </form>
        <!---------- End of Form ---------->

        <!-- Do not have an account? -->
        <q-card-section class="text-center q-pt-none">
          <div class="text-8 signup-text"> Don't have an account yet?
            <router-link to="/register">Sign up</router-link>
          </div>
        </q-card-section>

      </q-card>
    </q-page-container>

    <FooterLayout/>
  </q-layout>
</template>

<script scoped setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import FooterLayout from 'src/components/FooterLayout.vue';
import { api } from 'src/boot/axios';
import axios from 'axios';

const email = ref<string>('');
const password = ref<string>('');
const emailError = ref('');
const passwordError = ref('');

const $q = useQuasar();

const logoSource = computed(() => {
  return $q.dark.isActive
    ? '/src/assets/logo.png'
    : '/src/assets/l-logo.png';
});

const validateAndSubmit = async () => {
  emailError.value = '';
  passwordError.value = '';

  if (!email.value) {
    emailError.value = 'Email is required';
  } else if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email';
  }

  if (!password.value) {
    passwordError.value = 'Password is required';
  } else if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters long';
  }

  if (emailError.value || passwordError.value) return;

  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    });

    if (response.data.success) {
        $q.notify({
          type: 'positive',
          message: 'Login successful',
          position: 'top',
        });

        const token = response.data.value;
        localStorage.setItem('authToken', token);

        if (Notification.permission !== 'granted') {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              console.log('Notification permission granted.');
            } else {
              console.log('Notification permission denied.');
            }
          });
        }

        window.location.href = '/#/app';
      } else {
        $q.notify({
          type: 'negative',
          message: response.data.error || 'Registration failed. Please check your input.',
          position: 'top',
        });
      }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
        $q.notify({
          type: 'negative',
          message: error.response.data?.error || 'Registration failed due to a server error.',
          position: 'top',
        });
      } else {
        $q.notify({
          type: 'negative',
          message: 'Incorrect credentials',
          position: 'top',
        });
      }
  }
};

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
</script>


<style scoped lang="scss">

  * {
  color: var(--font);
  }

  img {
    height: 60px;
  }

  .q-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
  }

  .q-page-container {
    background-color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .q-card {
    width: 440px;
    background-color: transparent;
  }

  .login-btn {
    font-size: 15px;
    font-weight: 400;
    width: 100%;
    display: flex;
    flex-direction: row;
    background: var(--chat-bubble-outgoing);
    margin-right: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .header {
    font-weight: 750;
    font-size: 32px;
    letter-spacing: 0.5px;
  }


  .top-part {
    padding-bottom: 5px;
  }

  .signup-text {
    padding-bottom: 10px;
    font-size: 13px;
    opacity: 0.8;
  }

  .terms-text {
    font-size: 13px;
    padding: 4px 16px 4px 16px;
    opacity: 0.8;
  }

  .q-input {
    padding-bottom: 0;
  }

  .q-input.padding-err {
    padding-bottom: 16px;
  }

</style>
