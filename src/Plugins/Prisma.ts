import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (fastifyInstance) => {
  const prisma = new PrismaClient()

  await prisma.$connect()

  fastifyInstance.decorate('prisma', prisma)

  fastifyInstance.addHook('onClose', async (fastifyInstance) => {
    await fastifyInstance.prisma.$disconnect()
  })
})

export default prismaPlugin