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
          message: { type: 'string' }
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

export const IConfirmSchema = {
  schema: {
    querystring: {
      jwt: { type: 'string' }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' }
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

export const IJWTVerifySchema = {
  schema: {
    querystring: {
      jwt: { type: 'string' }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        },
      },
      401: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' }
        }
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

export const ILoginSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string' },
        password: { type: 'string' }
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          token: { type: 'string' }
        },
      },
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      },
      401: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      },
      500: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string' }
        }
      }
    }
  }
}