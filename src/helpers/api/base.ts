import { useAuthorizationStore } from '@/helpers/stores/authorization'
import axios from 'axios'
import { refreshToken } from './authorization'

const baseUrl = 'http://localhost:8080'

function getHeaders() {
  const token = localStorage.getItem('token') || ''
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

function GET(url: string, query?: Object, signal?: AbortSignal) {
  const params = query ? new URLSearchParams(query as Record<string, string>).toString() : null
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
    auth.refreshTime()

    request.headers.set('Authorization', `Bearer ${newToken.token}`)
    return await fetch(request)
  }

  return response
}

const api = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
})

api.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('token') || null
    if (token) request.headers['Authorization'] = `Bearer ${token}`
    return request
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config
    if (error.response?.status === 403 && !request._retry) {
      request._retry = true
      try {
        const auth = useAuthorizationStore()

        const response = await refreshToken()
        auth.setToken(response.token)
        auth.refreshTime()

        api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`
        return api(request)
      } catch (error) {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)

export { fetchApi, POST, GET, PUT, DELETE }
