import { ContactRoutes } from './Routes/ContactRoutes'
import fastify, { FastifyInstance } from 'fastify'
import { UserRoutes } from './Routes/UserRoutes'
import { AppRoutes } from './Routes/AppRoutes'
import prismaPlugin from './Plugins/Prisma'
import Mailer from './Plugins/Mailer'
import cors from '@fastify/cors'
import { env } from 'process'

const app: FastifyInstance = fastify({ logger: false })
app.register(cors, {
  hook: 'preHandler',
})

app.get('/', async () => {
  return "Money Keeper API\n\t/ - Home\n\t\t/user - User Routes\n\t\t\t/user/ping - Ping Route\n\t\t\t/user/signup - Signup Route"
})

//Plugins Register
app.register(prismaPlugin)
app.register(Mailer)

//Routes Register
app.register(UserRoutes, { prefix: '/user' })
app.register(AppRoutes, { prefix: '/app' })
app.register(ContactRoutes, { prefix: '/contact' })

app.listen({ port: parseInt(env.SERVER_PORT || "3000") }, err => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  console.log(`🚀 MoneyKeeper API Server Ready At => http://localhost:${env.SERVER_PORT || "3000"}`)
})