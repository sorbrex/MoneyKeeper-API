import { FastifyInstance } from "fastify"

export async function ContactRoutes(app: FastifyInstance) {

  app.post('/send', async (request: any, reply: any) => {
    try {
      const { name, email, message } = request.body

      await app.transporter.sendMail({
        from: {
          name: 'Money Keeper Contact',
          address: process.env.NODEMAILER_USERNAME || '',
        },
        to: process.env.PERSONAL_CONTACT_EMAIL || '',
        subject: 'Money Keeper Contact Form',
        html: `
          <h1>Money Keeper Contact Form</h1>
          <h2>Name: ${name}</h2>
          <h2>Email: ${email}</h2>
          <p>Message: ${message}</p>
          `,
      })

      console.log('Message sent successfully')
      return reply.code(200).send({ message: 'Message Sent' })
    } catch (error) {
      console.error('[Contact Email] Internal Server Error', error)
      return reply.code(500).send({ message: '[Contact Email] Internal Server Error', error: error })
    }
  })
}