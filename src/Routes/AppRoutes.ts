import { FastifyInstance } from "fastify"
import JWT from "jsonwebtoken";
import {IJWTVerifySchema} from "../Interfaces/Interfaces";

export async function AppRoutes(app: FastifyInstance) {

  app.addHook('onRequest', async (request, reply) => {
    console.log('onRequest hook')
    try {
      const authToken = request.headers.authorization?.split(' ')[1]

      if (!authToken) {
        return reply.code(401).send({ message: 'Token Not Provided' })
      }

      console.log(`\x1B[34m [DEBUG] Headers Token : ${authToken}\x1B[0m`)

      let decoded = JWT.verify(authToken, process.env.JWT_SECRET_KEY || '')

      if (!decoded) {
        console.log('\x1B[31mToken Invalid or Expired\x1B[0m')
        return reply.code(401).send({ message: 'Invalid Token Provided' })
      }

      console.log(`\x1B[31mData Inside Token: ${JSON.stringify(decoded)}\x1B[0m`)

      return reply.code(200).send({ message: 'Token Valid' })

    } catch (err) {
      console.log(`\x1B[31mToken Invalid or Expired ${err}\x1B[0m`)
      return reply.code(401).send({ message: 'Token Invalid', error: err })    }
  })


  app.get('/ping', async (_: any, reply: any) => {
    return reply.code(200).send({ message: 'pong' })
  })

  // 4 - Verify JWT (When The User Navigate To The App we check if the JWT saved in his session is valid)
  app.get('/verifyJwt', IJWTVerifySchema, async (_: any, reply: any) => {
    //We have a Hook that verify the JWT on every request, so if we reach this route the JWT is valid
    return reply.code(200).send({ message: 'Token Valid' })
  })

  // 7 - Change Password Route
  app.post('/change-password', async (request: any, reply: any) => {
    return reply.code(200).send({ message: 'Change Password success' })
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
