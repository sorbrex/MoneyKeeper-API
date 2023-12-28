import { FastifyInstance } from "fastify"
import JWT from "jsonwebtoken";
import { IJWTVerifySchema, IProfilePictureSchema } from "../Interfaces/Interfaces";
import GCStorage from "src/Storage/Storage";
import { parseHeaderToUserData } from "src/Utils/Utils";


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

      return reply.code(200).send({ message: 'Token Valid' })

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

  // 8 - Delete Account Route
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
