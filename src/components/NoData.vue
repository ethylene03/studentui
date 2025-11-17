<script setup lang="ts">
const { message } = withDefaults(defineProps<{ message?: string }>(), {
  message: 'No data available.',
})
</script>

<template>
  <div class="text-center my-5">
    <img
      src="https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127823.jpg?semt=ais_incoming&w=740&q=80"
      alt="no data available"
      class="d-block mx-auto my-5 w-25"
    />
    <p class="text-center my-5">{{ message }}</p>
  </div>
</template>
