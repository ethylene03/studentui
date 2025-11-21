<script setup lang="ts">
import ChatBox from '@/components/ChatBox.vue'
import NavBar from '@/components/NavBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import { getMessages } from '@/helpers/api/chats'
import { connect, disconnect, stompMessage } from '@/helpers/api/websocket'
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
  const query = { page: currentPage.value.toString(), size: '10', sort: 'createdAt,desc' }

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

function sendMessage() {
  if (!text.value.trim()) return

  const message: Partial<ChatMessage> = {
    userName: auth.name,
    message: text.value.trim(),
  }

  stompMessage(message)
  text.value = ''
}

/*<--------- SCROLL MANAGEMENT --------->*/

const chatBox = ref<HTMLElement | null>(null)

async function onScroll() {
  if (!chatBox.value) return

  if (chatBox.value.scrollTop === 0 && !isFetching.value) {
    if (currentPage.value + 1 >= pages.value) return
    currentPage.value += 1
    await fetchMessageHistory()

    if (isErrorFetching.value) {
      currentPage.value -= 1
    }
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

    <ChatBox
      :is-fetching="isFetching"
      :is-error-fetching="isErrorFetching"
      :messages="messages"
      :owner="auth.name"
      @on-scroll="onScroll"
      @box-element="chatBox = $event"
    />

    <div class="container input-group-text p-3 gap-3 border">
      <input
        type="text"
        class="form-control py-2 px-3"
        placeholder="Type your message..."
        v-model="text"
        @keyup.enter="sendMessage"
      />
      <button class="btn btn-primary px-5 py-2" @click="sendMessage">Send</button>
    </div>
  </section>
</template>
