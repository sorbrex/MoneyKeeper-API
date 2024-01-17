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
      '4xx': {
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
      '4xx': {
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
      '4xx': {
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
      '4xx': {
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

export const IAccountInfoSchema = {
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
          id: { type: 'string' },
          name: { type: 'string' },
          surname: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          remoteImageUrl: { type: 'string' }
        }
      },
      '4xx': {
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

export const ICreateCategorySchema = {
  schema: {
    headers: {
      type: 'object',
      properties: {
        'Authorization': { type: 'string' }
      },
      required: ['Authorization']
    },
    body: {
      type: 'object',
      required: ['name', "description"],
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      '4xx': {
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

export const ICreateTransactionSchema = {
  schema: {
    headers: {
      type: 'object',
      properties: {
        'Authorization': { type: 'string' }
      },
      required: ['Authorization']
    },
    body: {
      type: 'object',
      required: ['name', "description", "amount", "categoryId", "type"],
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        amount: { type: 'number' },
        categoryId: { type: 'string' },
        type: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      '4xx': {
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

export const IPatchTransactionSchema = {
  schema: {
    headers: {
      type: 'object',
      properties: {
        'Authorization': { type: 'string' }
      },
      required: ['Authorization']
    },
    body: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        amount: { type: 'number' },
        categoryId: { type: 'string' },
        type: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      '4xx': {
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


export const IDeleteTransactionSchema = {
  schema: {
    headers: {
      type: 'object',
      properties: {
        'Authorization': { type: 'string' }
      },
      required: ['Authorization']
    },
    body: {
      type: 'object',
      required: ["transactionId"],
      properties: {
        transactionId: { type: 'string' }
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      '4xx': {
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
