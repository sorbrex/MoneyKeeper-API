import fp from 'fastify-plugin'
import {FastifyInstance, FastifyPluginAsync} from 'fastify'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (fastifyInstance: FastifyInstance) => {
  const prisma = new PrismaClient()

  await prisma.$connect()

  fastifyInstance.decorate('prisma', prisma)

  fastifyInstance.addHook('onClose', async (fastifyInstance: FastifyInstance) => {
    await fastifyInstance.prisma.$disconnect()
  })
})

export default prismaPlugin