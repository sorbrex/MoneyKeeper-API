import { IConfirmSchema, ISignUpSchema, ILoginSchema, IResetSchema } from "../Interfaces/Interfaces"
import getTemplate from "../Utils/MailTemplates"
import { FastifyInstance } from "fastify"
import JWT from 'jsonwebtoken'
import crypto from 'crypto'
import { generatePassword } from "../Utils/Utils";

export async function UserRoutes(app: FastifyInstance) {
  //Ping Route For Testing
  app.get('/ping', async () => {
    return { pong: 'userPong' }
  })

  // 1 - Signup Route
  app.post('/signup', ISignUpSchema, async (request: any, reply: any) => {
    const userData = request.body

    try {

      //Check If User With Same Email Exists
      const result = await app.prisma.users.findUnique({
        where: {
          email: userData.email
        }
      })

      if (result && result.completed) {
        console.error("User Already Exists")
        return reply.code(409).send({ message: 'Internal Server Error', error: "User Already Exists" })
      }

      //User Doesn't Exist, Create New User
      let userCreated = await app.prisma.users.create({
        data: {
          name: userData.name,
          surname: userData.surname,
          email: userData.email,
          password: userData.password,
        },
      })

      //User Created, Generate JWT Token for Confirmation Email
      let token = JWT.sign(userData, process.env.JWT_SECRET_KEY || '', { expiresIn: '48h' })
      let tokenHash = crypto.createHash('sha256').update(token).digest('hex')
      await app.prisma.verificationTokens.create({
        data: {
          token: token,
          hashed: tokenHash,
          userId: userCreated.id
        }
      })

      //JWT Token Created, generate Confirmation URL
      const confirmationURL = `${process.env.BASE_URL}/user/confirm?jwt=${tokenHash}`

      //Send Confirmation Email
      await app.transporter.sendMail({
        from: {
          name: 'Money Keeper',
          address: process.env.NODEMAILER_USERNAME || '',
        },
        to: userCreated.email,
        subject: 'Money Keeper Registration',
        html: getTemplate('confirm', confirmationURL),
      })

      await app.prisma.users.update({
        where: {
          id: userCreated.id
        },
        data: {
          completed: true
        }
      })

      return reply.code(200).send({ message: 'User Created. Email Sent.' })

    } catch (err) {
      console.error("[User Creation Error] => ", err)
      reply.sendFile("Error.html")
      reply.code(500)
      return reply
    }
  })

  // 2 - Confirm Route (When The User Click On The Email Link)
  app.get('/confirm', IConfirmSchema, async (request: any, reply: any) => {
    try {
      const hashedToken = request.query.jwt

      if (!hashedToken) {
        reply.sendFile("Error.html")
        reply.code(400)
        return reply
      }

      //Check If Token Exists
      const result = await app.prisma.verificationTokens.findUnique({
        where: {
          hashed: hashedToken
        }
      })

      if (!result) {
        console.error("Token Not Found")
        reply.sendFile("Error.html")
        reply.code(404)
        return reply
      }

      //Token Exists, Check If Token Is Valid
      let decoded = JWT.verify(result.token, process.env.JWT_SECRET_KEY || '')

      if (!decoded) {
        //Token Is Invalid, Delete Token
        await app.prisma.verificationTokens.delete({
          where: {
            hashed: hashedToken
          }
        })

        console.error("Invalid Token Provided")
        reply.sendFile("Error.html")
        reply.code(401)
        return reply
      }

      //Token Is Valid, Update User
      await app.prisma.users.update({
        where: {
          id: result.userId
        },
        data: {
          active: true
        }
      })

      //User Updated, Delete Token
      await app.prisma.verificationTokens.delete({
        where: {
          hashed: hashedToken
        }
      })

      reply.redirect(`${process.env.BASE_UI_URL}/#/login`)
      reply.status(200)
      return reply
    } catch (err) {
      console.error(err)
      reply.sendFile("Error.html")
      reply.code(500)
      return reply
    }
  })

  // 3 - Login Route
  app.post('/login', ILoginSchema, async (request: any, reply: any) => {
    try {
      //Check If User Exists
      const dbUser = await app.prisma.users.findUnique({
        where: {
          email: request.body.email
        }
      })

      if (!dbUser) {
        return reply.code(404).send({ message: 'User Not Found' })
      }

      if (!dbUser.active) {
        return reply.code(401).send({ message: 'User Not Active' })
      }

      //Check If Password Is Correct
      if (dbUser.password !== request.body.password) {
        return reply.code(401).send({ message: 'Invalid password' })
      }

      //Password Is Correct, Generate JWT Token
      const generatedToken = JWT.sign({
        data: {
          id: dbUser.id,
          email: dbUser.email
        }
      }, process.env.JWT_SECRET_KEY || '', { expiresIn: '24h' });

      //Return JWT Token
      return reply.code(200).send({
        message: 'Login success',
        token: generatedToken
      })
    } catch {
      return reply.code(500).send({ message: 'Internal Server Error' })
    }
  })

  // 5 - Reset Password Route
  app.post('/reset', IResetSchema, async (request: any, reply: any) => {
    try {

      //Check If User Exists
      const dbUser = await app.prisma.users.findUnique({
        where: {
          email: request.body.email
        }
      })

      if (!dbUser) {
        return reply.code(404).send({ message: 'User Not Found' })
      }

      if (!dbUser.active) {
        return reply.code(401).send({ message: 'User Not Active' })
      }

      //Generate New Password
      const superSecretPassword = generatePassword({
        length: 12,
        minSpecial: 2,
        minLowercase: 2,
        minUppercase: 2,
        minNumber: 2
      })

      const loginUrl = `${process.env.BASE_UI_URL}/#/login`

      //Send Confirmation Email
      await app.transporter.sendMail({
        from: {
          name: 'Money Keeper',
          address: process.env.NODEMAILER_USERNAME || '',
        },
        to: request.body.email,
        subject: 'Money Keeper Password Reset',
        html: getTemplate('reset', loginUrl, superSecretPassword),
      })


      await app.prisma.users.update({
        where: {
          email: request.body.email
        },
        data: {
          password: crypto.createHash('sha256').update(superSecretPassword).digest('hex')
        }
      })

      return reply.code(200).send({ message: 'Password Reset. Email Sent With New Password.' })

    } catch (err) {
      console.error("[Password Reset Error] => ", err)
      reply.sendFile("Error.html")
      reply.code(500)
      return reply
    }
  })

}
