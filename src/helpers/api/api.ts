import { useAuthorizationStore } from '@/helpers/stores/authorization'
import axios from 'axios'
import { refreshToken } from './authorization'

const baseUrl = 'http://localhost:8080'

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

export default api
