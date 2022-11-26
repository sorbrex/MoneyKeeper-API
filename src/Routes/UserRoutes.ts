import { ISignUpSchema } from "../Interfaces/Interfaces"
import { FastifyInstance } from "fastify"

export async function UserRoutes(app: FastifyInstance) {

  app.get('/ping', async () => {
    return { pong: 'userPong' }
  })

  app.post('/signup', ISignUpSchema, async (request: any, reply: any) => {
    const result = await app.prisma.user.findUnique({
      where: {
        email: request.body.email
      }
    })

    if (result) {
      return reply.code(409).send({ message: 'User already exists' })
    }

    await app.prisma.user.create({
      data: {
        name: request.body.name,
        surname: request.body.surname,
        email: request.body.email,
        password: request.body.password,
      },
    })
  })
}
