import { defineStore } from 'pinia'

export const useAuthorizationStore = defineStore('authorization', {
  state: () => ({
    token: '',
  }),
  actions: {
    setToken(newToken: string) {
      this.token = newToken
    },
    clearToken() {
      this.token = ''
    },
    isLoggedIn(): boolean {
      return this.token !== ''
    },
  },
})
