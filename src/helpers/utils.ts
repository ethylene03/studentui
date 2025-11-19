import type { ErrorResponse } from '@/models/global'

function camelToTitle(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getMessage(messageArr: string[]): string {
  return Object.entries(messageArr)
    .map(([key, value]) => `In field ${key}, ${value}`)
    .join(', ')
}

function getPath() {
  return window.location.pathname.replace(/\//g, '')
}

function isError(obj: object): obj is ErrorResponse {
  return Object.keys(obj).includes('message')
}

function buildCacheKey(query: Record<string, string>): string {
  return Object.entries(query)
    .map(([key, value]) => {
      return `${key}=${value}`
    })
    .join('|')
}

export { camelToTitle, getMessage, getPath, isError, buildCacheKey }
