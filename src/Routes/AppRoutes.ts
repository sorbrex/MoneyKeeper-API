import { FastifyInstance } from "fastify"
import JWT from "jsonwebtoken";
import {
  IAccountInfoSchema,
  ICreateCategorySchema, ICreateTransactionSchema, IDeleteTransactionSchema,
  IJWTVerifySchema, IPatchTransactionSchema,
  IProfilePictureSchema
} from "../Interfaces/Interfaces";
import GCStorage from "../Storage/Storage";
import { parseHeaderToUserData } from "../Utils/Utils";
import {Transaction, User} from "../Types/Types";
import path from "path";


export async function AppRoutes(app: FastifyInstance) {

  app.addHook('onRequest', async (request, reply) => {
    try {
      const authToken = request.headers.authorization?.split(' ')[1]

      if (!authToken) {
        return reply.code(401).send({ message: 'Token Not Provided' })
      }

      let decoded = JWT.verify(authToken, process.env.JWT_SECRET_KEY || '')

      if (!decoded) {
        console.error('\x1B[31mToken Invalid or Expired \x1B[0m')
        return reply.code(401).send({ message: 'Invalid Token Provided' })
      }

    } catch (err) {
      console.error(`\x1B[31mToken Invalid or Expired ${err}\x1B[0m`)
      return reply.code(401).send({ message: 'Token Invalid', error: err })
    }
  })

  app.get('/ping', async (_: any, reply: any) => {
    return reply.code(200).send({ message: 'App Pong' })
  })

  //==========================//
  //========== JWT ===========//
  //==========================//
  app.get('/verifyJwt', IJWTVerifySchema, async (_: any, reply: any) => {
    //We have a Hook that verify the JWT on every request, so if we reach this route the JWT is valid
    return reply.code(200).send({ message: 'Token Valid' })
  })

  //==========================//
  //========= ACCOUNT=========//
  //==========================//
  app.get('/getAccountInfo', IAccountInfoSchema, async (req: any, reply: any) => {
    const userData = parseHeaderToUserData(req.headers)
    if (!userData) {
      return reply.code(401).send({ message: 'Invalid Token Provided' })
    }

    const user = await app.prisma.users.findUnique({
      where: {
        id: userData.id
      }
    })

    if (!user) {
      return reply.code(404).send({ message: 'User Not Found' })
    }

    return reply.code(200).send(user as User)

  })

  app.post('/updateProfilePicture', async function (req, reply) {
    try {
      const userData = parseHeaderToUserData(req.headers)

      if (!userData) {
        return reply.code(401).send({ message: 'Invalid Token Provided' })
      }

      const profilePicture = (req.body as { file: Buffer }).file
      const remotePath = `shared/${userData.id}/profile/picture`

      await GCStorage.cleanDirectory(path.join(remotePath, '/'))
      const imageUrl = await GCStorage.uploadFile(profilePicture, `${path.join(remotePath, `${Date.now()}_profile_picture.png`)}`)

      await app.prisma.users.update({
        where: {
          id: userData.id
        },
        data: {
          remoteImageUrl: imageUrl
        }
      })

      return reply.code(200).send({ message: 'Profile Picture Updated', url: imageUrl })
    } catch (err) {
      console.error(err)
      return reply.code(500).send({ message: 'Internal Server Error' })
    }
  })

  app.patch('/changePassword', async (req: any, reply: any) => {
    const userData = parseHeaderToUserData(req.headers)
    if (!userData) {
      return reply.code(401).send({ message: 'Invalid Token Provided' })
    }

    const newPassword = req.body.newPassword

    await app.prisma.users.update({
      where: {
        id: userData.id
      },
      data: {
        password: newPassword
      }
    })

    return reply.code(200).send({ message: 'Password Changed' })
  })

  app.delete('/deleteUser', async (request: any, reply: any) => {
    const userData = parseHeaderToUserData(request.headers)
    if (!userData) {
      return reply.code(401).send({ message: 'Invalid Token Provided' })
    }

    try {
      await app.prisma.transactions.deleteMany({
        where: {
          userId: userData.id
        }
      })

      await app.prisma.users.delete({
        where: {
          id: userData.id
        }
      })
      return reply.code(200).send({ message: 'Account Deleted' })
    } catch (err) {
      console.error(err)
      return reply.code(500).send({ message: 'Internal Server Error', error: err })
    }
  })

  //==========================//
  //====== TRANSACTION =======//
  //==========================//
  // Create Transaction
  app.post('/createTransaction', ICreateTransactionSchema, async (request: any, reply: any) => {
    try {
      const userData = parseHeaderToUserData(request.headers)
      if (!userData) {
        return reply.code(401).send({message: 'Invalid Token Provided'})
      }

      const user = await app.prisma.users.findUnique({
        where: {
          id: userData.id
        }
      })

      const {name, description, amount, categoryId, type} = request.body
      const createdAt = new Date()
      const userId = user?.id as string

      await app.prisma.transactions.create({
        data: {
          name,
          description,
          amount,
          type,
          categoryId,
          createdAt,
          userId
        }
      })

      return reply.code(200).send({message: 'Transaction Created'})
    } catch (error){
      console.error(error)
      return reply.code(500).send({message: 'Internal Server Error', error})
    }
  })

  app.patch('/updateTransaction', IPatchTransactionSchema, async (request: any, reply: any) => {
    try {
      const userData = parseHeaderToUserData(request.headers)
      if (!userData) {
        return reply.code(401).send({message: 'Invalid Token Provided'})
      }

      const user = await app.prisma.users.findUnique({
        where: {
          id: userData.id
        }
      })

      const {id, name, description, amount, categoryId, type} = request.body
      const userId = user?.id as string

      await app.prisma.transactions.update(
        {
          where: {
            id: id,
            userId: userId
          },
          data: {
            name,
            description,
            amount,
            categoryId,
            type
          }
        }
      )

      return reply.code(200).send({message: 'Transaction Updated'})
    } catch (error){
      console.error(error)
      return reply.code(500).send({message: 'Internal Server Error', error})
    }
  })

  app.delete('/deleteTransaction', IDeleteTransactionSchema, async (request: any, reply: any) => {
    const userData = parseHeaderToUserData(request.headers)
    if (!userData) {
      return reply.code(401).send({ message: 'Invalid Token Provided' })
    }

    try {

      const user = await app.prisma.users.findUnique({
        where: {
          id: userData.id
        }
      })

      const transactionId = request.body.transactionId as string

      await app.prisma.transactions.delete({
        where: {
          id: transactionId,
          userId: user?.id as string
        }
      })
      return reply.code(200).send({ message: 'Transaction Deleted' })
    } catch (err) {
      console.error(err)
      return reply.code(500).send({ message: 'Internal Server Error', error: err })
    }
  })

  app.get('/getTransactions', async (request: any, reply: any) => {
    const userData = parseHeaderToUserData(request.headers)
    if (!userData) {
      return reply.code(401).send({ message: 'Invalid Token Provided' })
    }

    //Check if limit is provided
    const limit = request.query.limit as string
    if (limit && isNaN(Number(limit))) {
      return reply.code(400).send({ message: 'Limit must be a number' })
    }

    try {
      const transaction = await app.prisma.transactions.findMany({
        where: {
          userId: userData.id
        },
        take: Number(limit) || undefined,
        orderBy: {
          createdAt: 'desc'
        }
      })
      return reply.code(200).send(transaction)
    } catch (err) {
      console.error(err)
      return reply.code(500).send({ message: 'Internal Server Error', error: err })
    }
  })

  //==========================//
  //======= CATEGORY =========//
  //==========================//
  // House/Car/Food/Hobby/Health
  app.get('/getCategories', async (_: any, reply: any) => {
    try {
      const categories = await app.prisma.category.findMany()
      return reply.code(200).send(categories)
    } catch (err) {
      console.error(err)
      return reply.code(500).send({ message: 'Internal Server Error', error: err })
    }
  })

  // Create Category - Admin Only
  app.post('/createCategory', ICreateCategorySchema, async (request: any, reply: any) => {
    const userData = parseHeaderToUserData(request.headers)
    if (!userData) {
      return reply.code(401).send({ message: 'Invalid Token Provided' })
    }

    const user = await app.prisma.users.findUnique({
      where: {
        id: userData.id
      }
    })

    if (!user) {
      return reply.code(404).send({ message: 'User Not Found' })
    }

    if (user.role !== 'ADMIN') {
      return reply.code(401).send({ message: 'User Not Admin' })
    }

    const { name, description } = request.body

    try {
      await app.prisma.category.create({
        data: {
          name: name,
          description: description
        }
      })
      return reply.code(200).send({ message: 'Category Created' })
    } catch (err) {
      console.error(err)
      return reply.code(500).send({ message: 'Internal Server Error', error: err })
    }
  })

}
