import { ContactRoutes } from './Routes/ContactRoutes'
import fastify, { FastifyInstance } from 'fastify'
import { UserRoutes } from './Routes/UserRoutes'
import { AppRoutes } from './Routes/AppRoutes'
import prismaPlugin from './Plugins/Prisma'
import Mailer from './Plugins/Mailer'
import cors from '@fastify/cors'
import { env } from 'process'
import { PrivateRoutes } from './Routes/PrivateRoutes'
import path from 'path'

const app: FastifyInstance = fastify({ logger: true })

app.register(cors, {
  hook: 'preHandler',
})

app.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public')
})



app.get('/', (_, res) => {
  return res.status(200).send(
    "Money Keeper API Server"
  ).type('text/html')
})

app.get('/health', (_, res) => {
  if (!prismaPlugin || !Mailer) {
    return res.status(500).send({ error: 'Server is not up' })
  }

  return res.status(200)
})

//Plugins Register
app.register(prismaPlugin)
app.register(Mailer)

//Routes Register
app.register(UserRoutes, { prefix: '/user' })
app.register(AppRoutes, { prefix: '/app' })
app.register(ContactRoutes, { prefix: '/contact' })
app.register(PrivateRoutes, { prefix: '/private' })

app.listen({ port: parseInt(env.SERVER_PORT || "3000"), host: '0.0.0.0' }, err => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  console.log(`🚀 MoneyKeeper API Server Ready at http://localhost:${env.SERVER_PORT || "3000"}`)
})