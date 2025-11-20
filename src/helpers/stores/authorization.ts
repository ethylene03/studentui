import { defineStore } from 'pinia'

export const useAuthorizationStore = defineStore('authorization', {
  state: () => ({
    token: '',
    id: '',
    username: '',
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
    setUserDetails(id: string, username: string) {
      this.id = id
      this.username = username
    },
  },
})
