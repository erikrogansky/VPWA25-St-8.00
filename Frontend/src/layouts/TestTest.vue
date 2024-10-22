<template>
  <div>
    <q-btn @click="fetchData">Get Data</q-btn>
    <div v-if="data">{{ data }}</div>
    <div v-else>No data available</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from 'src/boot/axios'

const data = ref('')

const fetchData = async () => {
  try {
    const response = await api.get('/data')
    data.value = response.data.message
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

</script>
