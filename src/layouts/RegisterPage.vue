<template>
  <q-layout view="hHh p fff">
    <q-page-container>
      <q-card flat class="q-pa-md content">

        <!-- Title and Logo -->
        <q-card-section class="text-center top-part">
          <router-link to="/"><img :src="logoSource" alt="Convo's logo"/></router-link>
          <div class="header q-pa-sm">Create a free account</div>
        </q-card-section>

        <!---------- Start of Form ---------->
        <form @submit.prevent="validateAndSubmit">
          <q-card-section>
            <div class="q-gutter">

              <!-- Nickname -->
              <q-input dense rounded standout v-model="nick_name" placeholder="Nickname"
              :error="!!nickError" :error-message="nickError" :class="{'padding-err': !!nickError}"/>

              <!-- First Name and Last Name -->
              <div class="q-gutter q-mt-md row">
                <div class="name">
                  <q-input dense rounded standout v-model="first_name" placeholder="First Name" class="col"
                  :error="!!firstNameError" :error-message="firstNameError" :class="{'padding-err': !!firstNameError}"/>
                </div>
                <div class="name">
                  <q-input dense rounded standout v-model="last_name" placeholder="Last Name" class="col"
                  :error="!!lastNameError" :error-message="lastNameError" :class="{'padding-err': !!lastNameError}"/>
                </div>
              </div>

              <!-- Date of Birth and Gender -->
              <div class="q-gutter q-mt-md row">
                <div class="date_gender">
                  <div style="max-width: 300px">
                    <q-input dense rounded standout v-model="date_of_birth" mask="date" placeholder="Date of birth"
                    :error="!!dateError" :error-message="dateError" :class="{'padding-err': !!dateError}">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date dark v-model="date_of_birth" class="date-picker">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="date_gender">
                  <q-select dense rounded standout v-model="gender" :display-value="gender ? gender : 'Gender'" :class="{ 'no-gender': !gender, 'has-gender': gender, 'padding-err': !!genderError }" class="col" popup-content-class="user-popup" :options="options" :error="!!genderError" :error-message="genderError"/>
                </div>
              </div>
            </div>

            <!-- Phone Number, Email Address, Password -->
            <div>
              <q-input dense rounded standout v-model="phone_number" placeholder="Phone Number" class="q-mt-md" :error="!!phoneError" :error-message="phoneError" :class="{'padding-err': !!phoneError}"/>
              <q-input dense rounded standout v-model="email" placeholder="Email Address" class="q-mt-md" :error="!!emailError" :error-message="emailError" :class="{'padding-err': !!emailError}"/>
              <q-input dense rounded standout v-model="password" type="password" placeholder="Password" class="q-mt-md" :error="!!passwordError" :error-message="passwordError" :class="{'padding-err': !!passwordError}"/>
            </div>
          </q-card-section>

          <div class="text-8 text-center terms-text"> By creating an account, you agree with Convo's
            <router-link to="/privacy-policy">Privacy Policy</router-link> and
            <router-link to="/terms-and-conditions">Terms of Service</router-link>
          </div>

          <q-card-section>
            <q-btn unelevated rounded label="Sign Up" no-caps class="login-btn" type="submit"/>
          </q-card-section>
        </form>
        <!---------- End of Form ---------->

        <!-- Already have an account? -->
        <q-card-section class="text-center q-pt-none">
          <div class="text-8 signin-text">
            Already have an account?
            <router-link to="/login">Sign in</router-link>
          </div>
        </q-card-section>

      </q-card>
    </q-page-container>

    <FooterLayout />
  </q-layout>
</template>

<script scoped setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import FooterLayout from 'src/components/FooterLayout.vue';
import { useQuasar } from 'quasar';

const nick_name = ref<string>('');
const first_name = ref<string>('');
const last_name = ref<string>('');
const date_of_birth = ref<string>('');
const gender = ref<string | null>(null);
const phone_number = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');

const options = ['Male', 'Female', 'Non-binary', 'Other'];

const nickError = ref('');
const firstNameError = ref('');
const lastNameError = ref('');
const dateError = ref('');
const genderError = ref('');
const phoneError = ref('');
const emailError = ref('');
const passwordError = ref('');

const $q = useQuasar();
const router = useRouter();

const logoSource = computed(() => {
  return $q.dark.isActive
    ? '/src/assets/logo.png'
    : '/src/assets/l-logo.png';
});

const validateAndSubmit = () => {
  nickError.value = '';
  firstNameError.value = '';
  lastNameError.value = '';
  dateError.value = '';
  genderError.value = '';
  phoneError.value = '';
  emailError.value = '';
  passwordError.value = '';

  if (!nick_name.value) {
    nickError.value = 'Nickname is required';
  }

  if (!first_name.value) {
    firstNameError.value = 'First name is required';
  }

  if (!last_name.value) {
    lastNameError.value = 'Last name is required';
  }

  if (!date_of_birth.value) {
    dateError.value = 'Date of birth is required';
  }

  if (!gender.value) {
    genderError.value = 'Gender is required';
  }

  if (!phone_number.value) {
    phoneError.value = 'Phone number is required';
  } else if (!validatePhoneNumber(phone_number.value)) {
    phoneError.value = 'Please enter a valid phone number';
  }

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

  // Check for errors
  if (
    !nickError.value &&
    !firstNameError.value &&
    !lastNameError.value &&
    !dateError.value &&
    !genderError.value &&
    !phoneError.value &&
    !emailError.value &&
    !passwordError.value
  ) {
    $q.notify({
      type: 'positive',
      message: 'Registration successful',
      position: 'top',
    });
    router.push('/app');
  } else {
    $q.notify({
      type: 'negative',
      message: 'Please correct the highlighted errors',
      position: 'top',
    });
  }
};

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhoneNumber = (phone: string) => {
  const re = /^\+?\d{10,15}$/;
  return re.test(phone);
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

  .date_gender {
    display: flex;
    flex-direction: column;
    width: 48%;

    .label {
      padding-left: 8px;
      padding-bottom: 6px;
    }
  }

  .q-gutter.q-mt-md.row, .q-gutter.q-mt-sm.row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .name {
    display: flex;
    flex-direction: column;
    width: 48%;
  }

  .header {
    font-weight: 750;
    font-size: 32px;
    letter-spacing: 0.5px;
  }

  .top-part {
    padding-bottom: 5px;
  }

  .signin-text {
    padding-bottom: 10px;
    font-size: 13px;
    opacity: 0.8;
  }

  .terms-text {
    font-size: 13px;
    padding: 4px 16px 4px 16px;
    opacity: 0.8;
  }

  .q-dark {
    background: var(--popup);
  }

  .content {
    background: var(--primary);
  }

  :deep(.q-date__header) {
    background-color: var(--popup);
  }

  :deep(.q-date__main) {
    color: var(--font);
  }

  :deep(.text-primary) {
    color: var(--font);
  }

  :deep(.no-gender span) {
     opacity: 0.8;
  }

  .q-input, .q-select {
    padding-bottom: 0;
  }

  .q-input.padding-err, .q-select.padding-err {
    padding-bottom: 16px;
  }


</style>
