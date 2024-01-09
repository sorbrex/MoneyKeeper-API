import fp from 'fastify-plugin'
import nodemailer, { Transporter } from 'nodemailer'
import {FastifyInstance} from "fastify";

declare module 'fastify' {
  interface FastifyInstance {
    transporter: Transporter
  }
}

const Mailer = fp(async (fastifyInstance: FastifyInstance) => {
  const configuration = {
    host: process.env.NODEMAILER_HOST,
    port: parseInt(process.env.NODEMAILER_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    }
  }
  const transporter = nodemailer.createTransport(configuration)
  fastifyInstance.decorate('transporter', transporter)
})

export default Mailer