import fastify, { FastifyInstance } from 'fastify'
import { UserRoutes } from './Routes/UserRoutes'
import prismaPlugin from '../Plugins/prisma'
import { env } from 'process'

const app: FastifyInstance = fastify({ logger: false })

app.get('/', async () => {
  return "Money Keeper API\n\t/ - Home\n\t\t/user - User Routes\n\t\t\t/user/ping - Ping Route\n\t\t\t/user/signup - Signup Route"
})

app.get("/ping", async () => {
  return { pong: "pong" }
})

app.register(prismaPlugin)
app.register(UserRoutes, { prefix: '/user' })

app.listen({ port: parseInt(env.SERVER_PORT || "3000") }, err => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  console.log(`🚀 MoneyKeeper API Server Ready At => http://localhost:${env.SERVER_PORT || "3000"}`)
})