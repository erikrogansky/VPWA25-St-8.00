<template>
  <q-layout view="hHh p fFf">
    <q-page-container>
      <q-card flat class="q-pa-md">
        <!--INSIDE-->
        <q-card-section class="text-center top-part">
          <a href="#"><img src="../assets/logo.png" alt="Convo's logo"/></a>
          <div class="header q-pa-sm">Create a free account</div>
        </q-card-section>

        <q-card-section>
          <div class="q-gutter">
            <q-input dense outlined rounded v-model="nick_name" placeholder="Nickname"/>
            <div class="q-gutter q-mt-md row">
              <div class="name"><q-input dense outlined rounded v-model="first_name" placeholder="First Name" class="col"/></div>
              <div class="name"><q-input dense outlined rounded v-model="last_name" placeholder="Last Name" class="col"/></div>
            </div>
            <div class="q-gutter q-mt-md row">
              <div class="date_gender">
                  <div style="max-width: 300px">
                    <q-input dense outlined rounded v-model="date_of_birth" mask="date" placeholder="Date of birth">
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
              <div class="date_gender"><q-select dense outlined rounded v-model="gender" :display-value="gender ? gender : 'Gender'"  :class="{ 'no-gender': !gender, 'has-gender': gender }" class="col"  popup-content-class="user-popup" :options="options" /></div>
            </div>
          </div>
          <div class="">
            <q-input dense outlined rounded v-model="phone_number" placeholder="Phone Number" class="q-mt-md"/>
            <q-input dense outlined rounded v-model="email" placeholder="Email Address" class="q-mt-md"/>
            <q-input dense outlined rounded v-model="password" type="password" placeholder="Password" class="q-mt-md"/>
          </div>
        </q-card-section>

        <div class="text-8 text-center terms-text">
          By creating an account, you agree with Convo’s <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>
        </div>

        <q-card-section>
          <q-btn unelevated rounded label="Sign Up" to="/app" no-caps class="login-btn"/>
        </q-card-section>

        <q-card-section class="text-center q-pt-none">
          <div class="text-8 signin-text">
            Already have an account?
            <a href="/login">Sign in</a>
          </div>

        </q-card-section>
        <!--INSIDE-->
      </q-card>
    </q-page-container>

    <FooterLayout />
  </q-layout>
</template>

<script scoped setup lang="ts">
import { ref } from 'vue';
import FooterLayout from 'src/components/FooterLayout.vue';

// Defining the options for gender selection
//const genderOptions = ref<string[]>(['Male', 'Female', 'Other']);

// State variables
const nick_name = ref<string>('');
const first_name = ref<string>('');
const last_name = ref<string>('');
const date_of_birth = ref<string>('');
const gender = ref<string | null>(null)
const phone_number = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');

const options = ['Male', 'Female', 'Non-binary', 'Other']

</script>


<style scoped lang="scss">

  * {
  color: $font !important;;

  body.body--light & {
    color: $l-font !important;
  }
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
    background-color: $primary !important;;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    body.body--light & {
      background-color: $l-primary !important;
    }
  }

  .q-card {
    width: 440px;
    background-color: transparent;
  }

  .login-btn {
    font-size: 15px;
    font-weight: 400;
    display: flex;
    flex-direction: row;
    background: $chat-bubble-outgoing !important;;
    margin-right: 10px;
    padding-left: 20px;
    padding-right: 20px;

    body.body--light & {
      background: $l-chat-bubble-outgoing !important;
    }
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
    background: $popup !important;;

    body.body--light & {
      background-color: $l-popup !important;
    }
  }

  :deep(.q-date__header) {
    background-color: $popup !important;;

    body.body--light & {
      background-color: $l-popup !important;
    }
  }

  :deep(.q-date__main) {
    color: $font;

    body.body--light & {
      color: $l-font !important;
    }
  }

  :deep(.text-primary) {
    color: $font !important;

    body.body--light & {
      color: $l-font !important;
    }
  }

  :deep(.no-gender span) {
     opacity: 0.8;
  }

</style>
