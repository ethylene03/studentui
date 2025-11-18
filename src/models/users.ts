export interface UserToken {
  id: string
  username: string
  token: string
}

export type User = Omit<UserToken, 'token'>

export interface UserCredentials {
  username: string
  password: string
}
