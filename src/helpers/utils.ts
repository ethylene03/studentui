import type { ErrorResponse } from '@/models/global'

function camelToTitle(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getMessage(messageArr: object): string {
  return Object.entries(messageArr)
    .map(([key, value]) => `In field ${key}, ${value}`)
    .join(', ')
}

function getPath() {
  return window.location.pathname.replace(/\//g, '')
}

function isError(obj: Object): obj is ErrorResponse {
  return Object.keys(obj).includes('message')
}

export { camelToTitle, getMessage, getPath, isError }
