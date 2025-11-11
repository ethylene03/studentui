import { defineStore } from 'pinia'

export const useAuthorizationStore = defineStore('authorization', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    generatedTime: localStorage.getItem('generatedTime') || null,
  }),
  actions: {
    setToken(newToken: string) {
      this.token = newToken
      localStorage.setItem('token', newToken)
    },
    clearToken() {
      this.token = null
      localStorage.removeItem('token')
    },
    isLoggedIn(): boolean {
      return this.token !== null
    },
    refreshTime() {
      const currentTime = new Date().toISOString()
      this.generatedTime = currentTime
      localStorage.setItem('generatedTime', currentTime)
    },
  },
})
