export interface User {
  id?: string
  username: string
  password?: string
}

export interface UserToken {
  id: string
  username: string
  token: string
}
