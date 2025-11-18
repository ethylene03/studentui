import { useAuthorizationStore } from '@/helpers/stores/authorization'
import { refreshToken } from './authorization'

const baseUrl = 'http://localhost:8080'

function getHeaders() {
  const auth = useAuthorizationStore()
  const token = auth.token

  return new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  })
}

function POST(url: string, data: Object) {
  return new Request(baseUrl + url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
}

function GET(url: string, query?: Record<string, string>, signal?: AbortSignal) {
  const params = query ? new URLSearchParams(query).toString() : null
  return new Request(baseUrl + url + (params ? '?' + params : ''), {
    method: 'GET',
    headers: getHeaders(),
    signal,
  })
}

function PUT(url: string, data: Object) {
  return new Request(baseUrl + url, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
}

function DELETE(url: string) {
  return new Request(baseUrl + url, {
    method: 'DELETE',
    headers: getHeaders(),
  })
}

async function fetchApi(request: Request) {
  const response = await fetch(request)

  if (response.status === 403) {
    const auth = useAuthorizationStore()
    const newToken = await refreshToken()
    auth.setToken(newToken.token)

    request.headers.set('Authorization', `Bearer ${newToken.token}`)
    return await fetch(request)
  }

  return response
}

export { DELETE, fetchApi, GET, POST, PUT }
