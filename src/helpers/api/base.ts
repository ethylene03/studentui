import { useAuthorizationStore } from '@/helpers/stores/authorization'
import axios from 'axios'
import { refreshToken } from './authorization'

const baseUrl = 'http://localhost:8080'

function getToken() {
  const token = localStorage.getItem('token') || null
  return `Bearer ${token}`
}

const headers = new Headers({
  'Content-Type': 'application/json',
  Authorization: getToken(),
})

function POST(url: string, data: Object) {
  return new Request(baseUrl + url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
}

function GET(url: string, query?: Object, signal?: AbortSignal) {
  const params = query ? new URLSearchParams(query as Record<string, string>).toString() : null
  return new Request(baseUrl + url + (params ? '?' + params : ''), {
    method: 'GET',
    headers,
    signal,
  })
}

function PUT(url: string, data: Object) {
  return new Request(baseUrl + url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  })
}

function DELETE(url: string) {
  return new Request(baseUrl + url, {
    method: 'DELETE',
    headers,
  })
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

export { api, POST, GET, PUT, DELETE }
