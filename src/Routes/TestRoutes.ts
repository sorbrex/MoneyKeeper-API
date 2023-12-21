import { FastifyInstance } from "fastify"

export async function TestRoutes(app: FastifyInstance) {

  app.get('/ping', async () => {
    return { pong: 'Test Pong' }
  })

  app.post('/update-profile-pictures', async (request: any, reply: any) => {
    const data = await request.file()
    console.log(JSON.stringify(data))
  })


}
