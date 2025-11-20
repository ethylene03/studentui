import type { ErrorResponse } from '@/models/global'
import type { User, UserCredentials, UserPasswordChange } from '@/models/users'
import { DELETE, fetchApi, PUT } from './base'

async function changePassword(
  id: string,
  details: UserPasswordChange,
): Promise<User | ErrorResponse> {
  try {
    const response = await fetchApi(PUT('/users/' + id + '/password', details))

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as User
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function changeUsername(id: string, details: UserCredentials): Promise<User | ErrorResponse> {
  try {
    const response = await fetchApi(PUT('/users/' + id + '/username', details))

    if (!response.ok) return (await response.json()) as ErrorResponse

    return (await response.json()) as User
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

async function deleteUser(id: string): Promise<void | ErrorResponse> {
  try {
    const response = await fetchApi(DELETE('/users/' + id))

    if (!response.ok) return (await response.json()) as ErrorResponse
  } catch (error) {
    if (error instanceof TypeError)
      return { message: ['Network or fetch-related error'], error: 500, status: 'error' }

    return { message: ['Unknown error occurred'], error: 500, status: 'error' }
  }
}

export { changePassword, changeUsername, deleteUser }
