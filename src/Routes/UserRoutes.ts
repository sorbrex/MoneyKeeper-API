import { IConfirmSchema, ISignUpSchema } from "../Interfaces/Interfaces"
import getTemplate from "../Utils/MailTemplates"
import { FastifyInstance } from "fastify"
import JWT from 'jsonwebtoken'

export async function UserRoutes(app: FastifyInstance) {
  //Ping Route For Testing
  app.get('/ping', async () => {
    return { pong: 'userPong' }
  })

  // 1 - Signup Route
  app.post('/signup', ISignUpSchema, async (request: any, reply: any) => {
    const userData = request.body
    const DB = app.prisma

    try {

      //Check If User With Same Email Exists
      const result = await DB.users.findUnique({
        where: {
          email: userData.email
        }
      })

      if (result) {
        return reply.code(409).send({ message: 'User Already Exists' })
      }

      //User Doesn't Exist, Create New User
      let userCreated = await DB.users.create({
        data: {
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          password: userData.password,
        },
      })

      //User Created, Generate JWT Token for Confirmation Email
      let token = JWT.sign(userData, process.env.SECRET || '');
      await DB.jWT.create({
        data: {
          token: token,
          userId: userCreated.id,
        }
      })

      //JWT Token Created, generate Confirmation URL
      const confirmationURL = `${process.env.BASE_URL}/user/confirm/${token}`

      //Send Confirmation Email
      await app.transporter.sendMail({
        from: {
          name: 'Money Keeper',
          address: process.env.USERNAME || '',
        },
        to: userCreated.email,
        subject: 'Money Keeper Registration',
        html: getTemplate('confirm', confirmationURL),
      })

      console.log('[User Creation] Email Sent')
      return reply.code(200).send({ message: 'User Created. Email Sent.' })

    } catch (err) {
      console.log("[User Creation Error] => ", err)
      return reply.code(500).send({ message: 'Internal Server Error', error: err })
    }
  })

  // 2 - Confirm Route
  app.patch('/confirm/:token', IConfirmSchema, async (request: any, reply: any) => {
    try {
      const DB = app.prisma
      const token = request.params.token

      //Check If Token Exists
      const result = await DB.jWT.findUnique({
        where: {
          token: token
        }
      })

      if (!result) {
        return reply.code(404).send({ message: 'Token Not Found' })
      }

      //Token Exists, Check If Token Is Valid
      let decoded = JWT.verify(token, process.env.SECRET || '')

      if (!decoded) {
        return reply.code(401).send({ message: 'Token Invalid' })
      }

      //Token Is Valid, Update User
      await DB.users.update({
        where: {
          id: result.userId
        },
        data: {
          active: true
        }
      })

      //User Updated, Delete Token
      await DB.jWT.delete({
        where: {
          token: token
        }
      })


    } catch (err) {
      console.log(err)
      return reply.code(500).send({ message: 'Internal Server Error', error: err })
    }
  })

  app.get({
    '/verifyJwt',

  })

  // 3 - Login Route
  app.post('/login', async (request: any, reply: any) => {
    const result = await app.prisma.users.findUnique({
      where: {
        email: request.body.email
      }
    })

    if (!result) {
      return reply.code(404).send({ message: 'User not found' })
    }

    if (result.password !== request.body.password) {
      return reply.code(401).send({ message: 'Invalid password' })
    }

    return reply.code(200).send({ message: 'Login success' })
  })

  // 4 - Logout Route
  app.post('/logout', async (request: any, reply: any) => {
    return reply.code(200).send({ message: 'Logout success' })
  })

  // 5 - Reset Password Route
  app.post('/reset', async (request: any, reply: any) => {
    return reply.code(200).send({ message: 'Reset success' })
  })

  // 6 - Confirm Reset Password Route
  app.post('/confirm-reset', async (request: any, reply: any) => {
    return reply.code(200).send({ message: 'Confirm Reset success' })
  })

  // 7 - Change Password Route
  app.post('/change-password', async (request: any, reply: any) => {
    return reply.code(200).send({ message: 'Change Password success' })
  })

  // 8 - Delete Account Route
  app.delete('/delete', async (request: any, reply: any) => {
    return reply.code(200).send({ message: 'Delete Account success' })
  })


}
