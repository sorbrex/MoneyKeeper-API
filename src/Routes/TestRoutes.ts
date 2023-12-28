import { FastifyInstance } from "fastify"

export async function TestRoutes(app: FastifyInstance) {

  app.get('/ping', async () => {
    return { pong: 'Test Pong' }
  })


}
