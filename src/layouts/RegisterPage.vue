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
                            <q-date dark v-model="date_of_birth">
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
              <div class="date_gender"><q-select dense outlined rounded v-model="gender" label="Gender" class="col" :options="options" /></div>
            </div>
          </div>
          <div class="">
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
const gender = ref<string | null>(null)
const phone_number = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');

const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']

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

</style>
