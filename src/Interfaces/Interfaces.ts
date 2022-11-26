export const ISignUpSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'surname', 'email', 'password'],
      properties: {
        name: { type: 'string' },
        surname: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          jwtToken: { type: 'string' }
        },
      },
      500: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' }
        }
      }
    },

  }
}
