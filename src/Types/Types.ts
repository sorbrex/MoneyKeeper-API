export type TSignUpRequest = {
  body: {
    name: string,
    surname: string,
    email: string,
    password: string,
  }
}

export type TemplateRequest = "reset" | "confirm"
