import type { ErrorResponse } from '@/models/global'
import type { User, UserCredentials, UserToken } from '@/models/users'

function getUrl(path: string = ''): string {
  return 'http://localhost:8080/auth' + path
}

const headers = new Headers({ 'Content-Type': 'application/json' })

async function login(user: UserCredentials): Promise<UserToken | ErrorResponse> {
  try {
    const response = await fetch(getUrl('/login'), {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(user),
    })

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as UserToken
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function signup(user: UserCredentials): Promise<User | ErrorResponse> {
  try {
    const response = await fetch(getUrl('/signup'), {
      method: 'POST',
      headers,
      body: JSON.stringify(user),
    })

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as User
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function logout(): Promise<void> {
  try {
    const response = await fetch(getUrl(), {
      method: 'DELETE',
      credentials: 'include',
      headers,
    })

    if (!response.ok) throw new Error('Logout failed with status ' + response.status)
  } catch (error) {
    throw new Error('Error logging out user: ' + error)
  }
}

async function refreshToken(): Promise<UserToken> {
  try {
    const response = await fetch(getUrl('/refresh'), {
      method: 'POST',
      credentials: 'include',
      headers,
    })

    // make user login again
    if (!response.ok) window.location.href = '/'

    return (await response.json()) as UserToken
  } catch (error) {
    throw new Error('Error refreshing token: ' + error)
  }
}

export { login, logout, refreshToken, signup }
