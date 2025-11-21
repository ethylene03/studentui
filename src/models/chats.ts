export interface ChatMessage {
  id: string
  userName: string
  message: string
}

export interface ChatMessageList {
  total: number
  pages: number
  page: number
  size: number
  data: ChatMessage[]
}
