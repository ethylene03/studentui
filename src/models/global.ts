export interface ErrorResponse {
  message: []
  error: number
  status: string
}

export interface ValidationError {
  field: string
  errors: string[]
}
