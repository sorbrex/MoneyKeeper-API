import { FastifyInstance } from "fastify"

export async function PrivateRoutes(app: FastifyInstance) {

  app.get('/ping', async () => {
    return { pong: 'privatePong' }
  })

}
