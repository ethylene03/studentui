import type { ErrorResponse } from '@/models/global'
import type { User, UserCredentials, UserToken } from '@/models/users'
import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  withCredentials: true,
})

async function login(user: UserCredentials): Promise<UserToken | ErrorResponse> {
  try {
    const response = await api.post('/auth/login', user)
    return response.data as UserToken
  } catch (error) {
    return (error as AxiosError).response?.data as ErrorResponse
  }
}

async function signup(user: UserCredentials): Promise<User | ErrorResponse> {
  try {
    const response = await api.post('/auth/signup', user)
    return response.data as User
  } catch (error) {
    return (error as AxiosError).response?.data as ErrorResponse
  }
}

async function logout(): Promise<void> {
  try {
    await api.delete('/auth')
  } catch (error) {
    throw new Error('Error logging out user: ' + error)
  }
}

async function refreshToken(): Promise<UserToken> {
  try {
    const response = await api.post('/auth/refresh')
    return response.data
  } catch (error) {
    throw new Error('Error refreshing token: ' + error)
  }
}

export { login, signup, logout, refreshToken }
