<template>
  <q-layout view="hHh p fFf">

      <q-page-container>
          <q-card flat class="q-pa-md">

            <!--INSIDE-->
            <q-card-section class="text-center top-part">
              <img src="../assets/logo.png" alt="Convo's logo">
              <div class="q-pa-sm header">Sign In</div>
            </q-card-section>

            <q-card-section>
              <q-input outlined rounded v-model="email" label="Email Address"></q-input>
              <q-input outlined rounded v-model="password" type="password" label="Password" class="q-mt-md"></q-input>
            </q-card-section>

            <div class="text-8 text-center terms-text">
              By signing in, you agree with Convo’s <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a>
            </div>

            <q-card-section>
              <q-btn unelevated rounded label="Sign In" to="/app" no-caps class="login-btn" />
            </q-card-section>

            <q-card-section class="text-center q-pt-none">
              <div class="text-8 signup-text">
                Don't have an account yet?
                <a href="/login">Sign up</a>
              </div>
            </q-card-section>
            <!--INSIDE-->

          </q-card>

      </q-page-container>

    <FooterLayout/>

  </q-layout>


</template>

<script scoped setup lang="ts">
import { ref } from 'vue';
import FooterLayout from 'src/components/FooterLayout.vue';

const email = ref<string>('');
const password = ref<string>('');

</script>

<style scoped lang="scss">

  * {
  color: $font;
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
    background-color: $primary;
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
    background: $chat-bubble-outgoing;
    margin-right: 10px;
    padding-left: 20px;
    padding-right: 20px;

    body.body--light & {
      background-color: $l-chat-bubble-outgoing !important;
    }
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

</style>
