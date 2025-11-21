<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import { getMessages } from '@/helpers/api/chats'
import { connect, disconnect, sendMessage } from '@/helpers/api/websocket'
import { useAuthorizationStore } from '@/helpers/stores/authorization'
import { isError } from '@/helpers/utils'
import type { ChatMessage } from '@/models/chats'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

onMounted(async () => {
  connect((msg) => {
    messages.value.push(msg)
    nextTick(() => {
      chatBox.value?.scrollTo(0, chatBox.value.scrollHeight)
    })
  })
  await fetchMessageHistory()
  chatBox.value?.scrollTo(0, chatBox.value.scrollHeight)
})

onBeforeUnmount(() => {
  disconnect()
})

/*<--------- FETCH MESSAGE HISTORY --------->*/

const messages = ref<ChatMessage[]>([])
const pages = ref(0)
const currentPage = ref(0)

const controller = ref<AbortController | null>(null)
const isFetching = ref(false)
const isErrorFetching = ref(false)

const auth = useAuthorizationStore()

async function fetchMessageHistory() {
  isFetching.value = true
  isErrorFetching.value = false

  if (controller.value) controller.value.abort()
  controller.value = new AbortController()

  const currentScrollPosition = chatBox.value?.scrollHeight || 0
  const query = { page: currentPage.value.toString(), size: '20', sort: 'createdAt,desc' }

  const response = await getMessages(query, controller.value.signal)
  if (!response || isError(response)) {
    isErrorFetching.value = true
    isFetching.value = false
    return
  }

  messages.value = [...response.data.reverse(), ...messages.value]
  pages.value = response.pages
  currentPage.value = response.page
  isFetching.value = false

  nextTick(() => {
    chatBox.value?.scrollTo(0, chatBox.value.scrollHeight - currentScrollPosition)
  })
}

/*<--------- SEND MESSAGE --------->*/

const text = ref('')

function sendMsg() {
  if (!text.value.trim()) return

  const message: Partial<ChatMessage> = {
    userName: auth.name,
    message: text.value.trim(),
  }

  sendMessage(message)
  text.value = ''
}

/*<--------- SCROLL MANAGEMENT --------->*/

const chatBox = ref<HTMLElement | null>(null)

function onScroll() {
  if (!chatBox.value) return

  if (chatBox.value.scrollTop === 0 && !isFetching.value) {
    if (currentPage.value + 1 >= pages.value) return
    currentPage.value += 1
    fetchMessageHistory()
  }
}
</script>

<template>
  <section id="chat" class="w-100">
    <nav-bar />
    <div class="container mt-5 text-center text-md-start">
      <page-header
        title="Community Chat Room"
        description="Message and interact with other users!"
        type="Form"
      />
    </div>

    <div
      ref="chatBox"
      class="container border bg-white rounded py-3 px-4 my-2"
      style="height: 500px; overflow-y: scroll"
      @scroll="onScroll"
    >
      <span v-if="isFetching" class="d-block text-center my-2">Loading messages...</span>
      <span v-if="isErrorFetching" class="d-block text-center my-2 text-danger">
        Error fetching messages. Please try again later.
      </span>

      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message--container"
        :class="{ owner: message.userName === auth.name }"
      >
        <span
          class="message--user mt-3"
          :hidden="index - 1 >= 0 && messages[index - 1]?.userName === message.userName"
        >
          {{ message.userName }}
        </span>
        <span class="message--message">
          {{ message.message }}
        </span>
      </div>
    </div>

    <div class="container input-group-text p-3 gap-3 border">
      <input
        type="text"
        class="form-control py-2 px-3"
        placeholder="Type your message..."
        v-model="text"
        @keyup.enter="sendMsg"
      />
      <button class="btn btn-primary px-5 py-2" @click="sendMsg">Send</button>
    </div>
  </section>
</template>

<style scoped>
.message--container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 0.3rem;
}

.message--user {
  font-weight: 300;
  font-size: 0.8rem;
  padding: 0 0.5rem;
}

.message--message {
  background-color: var(--bs-secondary-bg);
  padding: 0.5rem 1.2rem;
  border-radius: 1.5rem;
  width: fit-content;
}

.message--container.owner {
  align-items: flex-end;
}

.message--container.owner .message--user {
  display: none;
}

.message--container.owner .message--message {
  background-color: var(--bs-primary);
  color: white;
}
</style>
