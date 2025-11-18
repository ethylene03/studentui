<script setup lang="ts">
const { title, description, type } = defineProps<{
  title: string
  description: string
  type: 'Main' | 'Form'
}>()
</script>

<template>
  <h2>{{ title }}</h2>
  <p :class="{ 'lead text-primary': type === 'Main' }">{{ description }}</p>
</template>
