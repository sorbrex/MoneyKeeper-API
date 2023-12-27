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
    headers: {
      type: 'object',
      properties: {
        'Authorization': { type: 'string' }
      },
      required: ['Authorization']
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

export const IResetSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
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

export const IProfilePictureSchema = {
  schema: {
    consumes: ['multipart/form-data'],
    body: {
      type: 'object',
      required: ['profilePicture'],
      properties: {
        // file that gets decoded to string
        profilePicture: {
          type: 'object',
        },
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          url: { type: 'string' }
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

