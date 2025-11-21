<script setup lang="ts">
import type { ChatMessage } from '@/models/chats'
import { onMounted, ref } from 'vue'

const { isFetching, isErrorFetching, messages, owner } = defineProps<{
  isFetching: boolean
  isErrorFetching: boolean
  messages: ChatMessage[]
  owner: string
}>()

const emit = defineEmits<{
  (event: 'onScroll'): void
  (event: 'boxElement', value: HTMLElement): void
}>()

const chatBox = ref<HTMLElement | null>(null)
onMounted(() => {
  emit('boxElement', chatBox.value as HTMLElement)
})
</script>

<template>
  <div class="container border bg-white rounded py-1 px-1 flex-fill mt-5 mb-3">
    <div
      ref="chatBox"
      class="py-3 px-4"
      style="height: 450px; overflow-y: scroll"
      @scroll="emit('onScroll')"
    >
      <span v-if="isFetching" class="d-block text-center my-2">Loading messages...</span>
      <span v-else-if="isErrorFetching" class="d-block text-center my-2 text-danger">
        Error fetching messages. Please try again later.
      </span>
      <span v-else class="d-block text-center my-2 opacity-0">
        Filler
      </span>

      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message--container"
        :class="{ owner: message.userName === owner }"
      >
        <span
          class="fas fa-user-circle fa-2xl text-secondary mb-3"
          :class="{
            'opacity-0': index - 1 >= 0 && messages[index - 1]?.userId === message.userId,
          }"
        ></span>

        <div class="d-flex flex-column align-items-start gap-2" style="max-width: 50%;">
          <span
            class="message--user mt-3"
            :hidden="index - 1 >= 0 && messages[index - 1]?.userId === message.userId"
          >
            {{ message.userName }}
          </span>
          <span class="message--message flex-fill">
            {{ message.message }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message--container {
  display: flex;
  align-items: end;
  margin-bottom: 0.5rem;
  gap: 0.7rem;
}

.message--user {
  font-weight: 300;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.message--message {
  background-color: var(--bs-secondary-bg);
  padding: 0.5rem 1rem;
  border-radius: 1.2rem;
}

.message--container.owner {
  flex-direction: row-reverse;
}

.message--container.owner .fa-user-circle,
.message--container.owner .message--user {
  display: none;
}

.message--container.owner .message--message {
  background-color: var(--bs-primary);
  color: white;
}
</style>
