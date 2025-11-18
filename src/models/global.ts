export interface ErrorResponse {
  message: string[] | string
  error: number
  status: string
}

export interface ValidationError {
  field: string
  errors: string[]
}
