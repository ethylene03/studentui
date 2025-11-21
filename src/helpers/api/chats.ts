import type { ChatMessageList } from '@/models/chats'
import type { ErrorResponse } from '@/models/global'
import { fetchApi, GET } from './base'

async function getMessages(
  query: Record<string, string>,
  signal: AbortSignal,
): Promise<ChatMessageList | ErrorResponse> {
  try {
    const response = await fetchApi(GET('/chat', query, signal))

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as ChatMessageList
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

export { getMessages }
