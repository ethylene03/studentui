export interface ErrorResponse {
  message: string[]
  error: number
  status: string
}

export interface ValidationError {
  field: string
  errors: string[]
}
