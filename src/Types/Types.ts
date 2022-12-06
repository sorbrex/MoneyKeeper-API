export type TSignUpRequest = {
  body: {
    name: string,
    surname: string,
    email: string,
    password: string,
  }
}

export type TemplateRequest = "reset" | "confirm"

export type TChallengeKeyDictionary = {
  id: string,
  challenge: string,
  passphrase: string
}