import type { ChatMessage } from '@/models/chats'
import { Client } from '@stomp/stompjs'
import { useAuthorizationStore } from '../stores/authorization'

let stompClient: Client | null = null

export function connect(onMessageCallback: (msg: ChatMessage) => void): void {
  const auth = useAuthorizationStore()
  const token = auth.token

  stompClient = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      stompClient?.subscribe('/topic/global', (message) =>
        onMessageCallback(JSON.parse(message.body)),
      )
    },
    onStompError: (frame) => {
      console.error('Broker reported error:', frame.headers.message, frame.body)
    },
  })

  stompClient.activate()
}

export function stompMessage(message: Partial<ChatMessage>): void {
  if (!stompClient?.connected) {
    console.error('STOMP client not connected yet')
    return
  }

  stompClient.publish({
    destination: '/app/chat',
    body: JSON.stringify(message),
  })
}

export function disconnect(): void {
  stompClient?.deactivate()
}
