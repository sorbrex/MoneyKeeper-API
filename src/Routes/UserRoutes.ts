import { IConfirmSchema, IJWTVerifySchema, ISignUpSchema, ILoginSchema } from "../Interfaces/Interfaces"
import getTemplate from "../Utils/MailTemplates"
import { FastifyInstance } from "fastify"
import JWT from 'jsonwebtoken'
import crypto from 'crypto'

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

      if (result && result.completed) {
        console.error("User Already Exists")
        return reply.code(409).send({ message: 'Internal Server Error', error: "User Already Exists" })
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
      let token = JWT.sign(userData, process.env.JWT_SECRET_KEY || '',{ expiresIn: '48h' })
      let tokenHash = crypto.createHash('sha256').update(token).digest('hex')
      await DB.jWT.create({
        data: {
          token: token,
          hashed: tokenHash,
          userId: userCreated.id,
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
      console.log("[User Creation Error] => ", err)
      return reply.code(500).sendFile("Error.html")
    }
  })

  // 2 - Confirm Route
  app.get('/confirm', IConfirmSchema, async (request: any, reply: any) => {
    try {
      const DB = app.prisma
      const token = request.query.jwt

      if (!token) {
        return reply.code(400).sendFile("Error.html")
      }

      //Check If Token Exists
      const result = await DB.jWT.findUnique({
        where: {
          hashed: token
        }
      })

      if (!result) {
        console.error("Token Not Found")
        return reply.code(404).sendFile("Error.html")
      }

      //Token Exists, Check If Token Is Valid
      let decoded = JWT.verify(result.token, process.env.JWT_SECRET_KEY || '')

      if (!decoded) {
        //Token Is Invalid, Delete Token
        await DB.jWT.delete({
          where: {
            token: token
          }
        })

        console.error("Invalid Token Provided")
        return reply.code(401).sendFile("Error.html")
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

      return reply.sendFile('Redirect.html').status(200).message('User Confirmed')

    } catch (err) {
      console.log(err)
      return reply.code(500).sendFile("Error.html").message(err)
    }
  })

  app.post('/verifyJwt', IJWTVerifySchema, async (request: any, reply: any) => {
    const token = request.body.jwt

    try {
      if (!token) {
        return reply.code(400).send({ message: 'Token Not Provided' })
      }

      const tokenObject = await app.prisma.jWT.findUnique({
        where: {
          hashed: token
        }
      })

      if (!tokenObject) {
        return reply.code(404).send({ message: 'Token Not Found' })
      }

      const decoded = JWT.verify(tokenObject.token, process.env.JWT_SECRET_KEY || '')
      return reply.code(200).send({ message: 'Token Valid' })
    } catch (err) {
      return reply.code(401).send({ message: 'Token Invalid', error: err })
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

      const tokenHash = crypto.createHash('sha256').update(generatedToken).digest('hex')

      //Check If JWT Token Exists
      let savedJwt = await app.prisma.jWT.findUnique({
        where: {
          userId: dbUser.id
        }
      })

      //Save JWT On Database
      if (savedJwt) {
        await app.prisma.jWT.update({
          where: {
            userId: dbUser.id
          },
          data: {
            hashed: tokenHash,
            token: generatedToken
          }
        })
      } else {
        await app.prisma.jWT.create({
          data: {
            token: generatedToken,
            hashed: tokenHash,
            userId: dbUser.id
          }
        })
      }

      //Return JWT Token
      return reply.code(200).send({
        message: 'Login success',
        token: tokenHash
      })
    } catch {
      return reply.code(500).send({ message: 'Internal Server Error' })
    }
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
    try {
      await app.prisma.users.delete({
        where: {
          id: request.body.id,
          email: request.body.email
        }
      })
      return reply.code(200).send({ message: 'Account Deleted' })
    } catch (err) {
      return reply.code(500).send({ message: 'Internal Server Error', error: err })
    }
  })


}
