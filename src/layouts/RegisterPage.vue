<!--<template>
  <q-layout view="hHh p fFf">

      <q-page-container>
          <q-card flat class="q-pa-md">

            <q-card-section class="text-center">
              <img src="../assets/logo.png" alt="Convo's logo">
              <div class="text-h5 text-weight-bold q-pa-sm">Create an Account</div>

            </q-card-section>

            <q-card-section>
              <q-input dense outlined rounded v-model="email" label="Email Address"></q-input>
              <q-input dense outlined rounded v-model="password" type="password" label="Password" class="q-mt-md"></q-input>
              <q-input dense outlined rounded v-model="email" label="Email Address" class="q-mt-md"></q-input>
              <q-input dense outlined rounded v-model="email" label="Email Address" class="q-mt-md"></q-input>
              <q-input dense outlined rounded v-model="email" label="Email Address" class="q-mt-md"></q-input>
              <q-input dense outlined rounded v-model="email" label="Email Address" class="q-mt-md"></q-input>
            </q-card-section>

            <q-card-section>
              <q-btn unelevated rounded label="Sign Up" to="/app" no-caps class="login-btn" />
            </q-card-section>

            <q-card-section class="text-center q-pt-none">
              <div class="text-8">
                Already have an account?
                <a href="#">Sign in.</a>
              </div>
            </q-card-section>

          </q-card>

      </q-page-container>

    <FooterLayout/>

  </q-layout>

</template>

<script scoped setup lang="ts">
import { ref } from 'vue';
import FooterLayout from 'src/components/FooterLayout.vue';

const nick_name = ref<string>('');
const first_name = ref<string>('');
const last_name = ref<string>('');
const date_of_birth = ref<string>('');
const gender = ref<string>('');

const phone_number = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');

</script>-->

<template>
  <q-layout view="hHh p fFf">
    <q-page-container>
      <q-card flat class="q-pa-md">
        <!--INSIDE-->
        <q-card-section class="text-center">
          <a href="#"><img src="../assets/logo.png" alt="Convo's logo"/></a>
          <div class="text-h5 text-weight-bold q-pa-sm">Create an Account</div>
        </q-card-section>

        <q-card-section>
          <div class="q-gutter">
            <q-input dense outlined rounded v-model="nick_name" placeholder="Nickname"/>
            <div class="q-gutter q-mt-md row">
              <q-input dense outlined rounded v-model="first_name" placeholder="First Name" class="col"/>
              <q-input dense outlined rounded v-model="last_name" placeholder="Last Name" class="col"/>
            </div>
            <div class="q-gutter q-mt-md row">
              <q-input dense outlined rounded v-model="date_of_birth" type="date" label="Date of Birth" class="col"/>
              <q-input dense outlined rounded v-model="gender" label="Gender" class="col"/>
            </div>

          </div>
          <div class="">
            <!--<div class="q-gutter-md row">
              <q-input dense outlined rounded v-model="date_of_birth" label="Date of Birth" class="col" type="date"/>
              <q-select dense outlined rounded v-model="gender" label="Gender" :options="genderOptions" class="col"/>
            </div>-->
            <q-input dense outlined rounded v-model="phone_number" placeholder="Phone Number" class="q-mt-md"/>
            <q-input dense outlined rounded v-model="email" placeholder="Email Address" class="q-mt-md"/>
            <q-input dense outlined rounded v-model="password" type="password" placeholder="Password" class="q-mt-md"/>
          </div>
        </q-card-section>

        <q-card-section>
          <q-btn unelevated rounded label="Sign Up" to="/app" no-caps class="login-btn"/>
        </q-card-section>

        <q-card-section class="text-center q-pt-none">
          <div class="text-8">
            Already have an account?
            <a href="#">Sign in.</a>
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
const gender = ref<string>('');
const phone_number = ref<string>('');
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
