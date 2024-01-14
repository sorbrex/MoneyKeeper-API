export type TemplateRequest = "reset" | "confirm"

export type JWTData = {
  email: string,
  id: string,
}

export type User = {
  id: string,
  role: string,
  name: string,
  surname: string,
  email: string,
  password: string,
  remoteImageUrl: string
}

export type Transaction = {
  id: string
  name: string
  description?: string
  amount: number
  userId: string
  categoryId: string
  type: "expense" | "income"
  createdAt: Date
}