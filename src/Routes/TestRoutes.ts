import { FastifyInstance } from "fastify"
import {IProfilePictureSchema} from "../Interfaces/Interfaces";
//import GCStorage from "../Storage/Storage";
import JWT, {JwtPayload} from "jsonwebtoken";
import {JWTData} from "../Types/Types";
import GCStorage from "../Storage/Storage";

export async function TestRoutes(app: FastifyInstance) {

  app.get('/ping', async () => {
    return { pong: 'Test Pong' }
  })

  app.post('/update-profile-pictures', IProfilePictureSchema , async function (req, reply) {
    try {
      const profilePicture = (req.body as { profilePicture: string }).profilePicture
      const authToken = (req.headers.authorization as string).split(' ')[1]

      const decoded = JWT.verify(authToken, process.env.JWT_SECRET_KEY || '') as JwtPayload

      const userData = decoded['data'] as JWTData || null

      if (!userData) {
        return reply.code(401).send({ message: 'Invalid Token Provided' })
      }

      const imageUrl = await GCStorage.uploadFile(profilePicture, `shared/${userData.id}/profile/${Date.now()}_profile_pic.png` )

      return reply.code(200).send({ message: 'Profile Picture Updated', url: imageUrl })

    } catch (err) {
      console.log(err)
      return reply.code(500).send({ message: 'Internal Server Error' })
    }
  })


}
