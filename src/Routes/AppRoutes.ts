import { FastifyInstance } from "fastify"
import JWT from "jsonwebtoken";
import {IAccountInfoSchema, IJWTVerifySchema, IProfilePictureSchema} from "../Interfaces/Interfaces";
import GCStorage from "../Storage/Storage";
import { parseHeaderToUserData } from "../Utils/Utils";
import {User} from "../Types/Types";


export async function AppRoutes(app: FastifyInstance) {

  app.addHook('onRequest', async (request, reply) => {
    try {
      const authToken = request.headers.authorization?.split(' ')[1]

      if (!authToken) {
        return reply.code(401).send({ message: 'Token Not Provided' })
      }

      let decoded = JWT.verify(authToken, process.env.JWT_SECRET_KEY || '')

      if (!decoded) {
        console.log('\x1B[31mToken Invalid or Expired\x1B[0m')
        return reply.code(401).send({ message: 'Invalid Token Provided' })
      }

    } catch (err) {
      console.log(`\x1B[31mToken Invalid or Expired ${err}\x1B[0m`)
      return reply.code(401).send({ message: 'Token Invalid', error: err })
    }
  })


  app.get('/ping', async (_: any, reply: any) => {
    return reply.code(200).send({ message: 'pong' })
  })

  // BASIC ROUTES
  app.get('/verifyJwt', IJWTVerifySchema, async (_: any, reply: any) => {
    //We have a Hook that verify the JWT on every request, so if we reach this route the JWT is valid
    return reply.code(200).send({ message: 'Token Valid' })
  })


  // ACCOUNT ROUTES
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

  app.post('/update-profile-pictures', IProfilePictureSchema, async function (req, reply) {
    try {
      const userData = parseHeaderToUserData(req.headers)

      if (!userData) {
        return reply.code(401).send({ message: 'Invalid Token Provided' })
      }

      const profilePicture = (req.body as { profilePicture: string }).profilePicture
      const imageUrl = await GCStorage.uploadFile(profilePicture, `shared/${userData.id}/profile/${Date.now()}_profile_pic.png`)

      return reply.code(200).send({ message: 'Profile Picture Updated', url: imageUrl })

    } catch (err) {
      console.log(err)
      return reply.code(500).send({ message: 'Internal Server Error' })
    }
  })

  app.post('/change-password', async (req: any, reply: any) => {
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

  app.delete('/delete', async (request: any, reply: any) => {
    try {
      await app.prisma.users.delete({
        where: {
          id: request.body.id,
          email: request.body.email
        }
      })
      return reply.code(200).send({ message: 'Account Deleted' })
    } catch (err) {
      return reply.code(500).send({ message: 'Internal Server Error', error: err })
    }
  })

}
