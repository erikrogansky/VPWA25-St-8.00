<template>
  <q-layout view="hHh p fFf">

      <q-page-container>
          <q-card flat class="q-pa-md">

            <!--INSIDE-->
            <q-card-section class="text-center">
              <img src="../assets/logo.png" alt="Convo's logo">
              <div class="text-h5 text-weight-bold q-pa-sm">Sign In</div>
              <div class="">Sign in below to access your account</div>
            </q-card-section>

            <q-card-section>
              <q-input outlined rounded v-model="email" label="Email Address"></q-input>
              <q-input outlined rounded v-model="password" type="password" label="Password" class="q-mt-md"></q-input>
            </q-card-section>

            <q-card-section>
              <q-btn unelevated rounded label="Sign In" to="/app" no-caps class="login-btn" />
            </q-card-section>

            <q-card-section class="text-center q-pt-none">
              <div class="text-8">
                Don't have an account yet?
                <a href="#">Sign up.</a>
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
  }

</style>
