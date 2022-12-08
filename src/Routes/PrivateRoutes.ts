import { TChallengeKeyDictionary } from "src/Types/Types"
import { FastifyInstance } from "fastify"
import CryptoJS from "crypto-js"
import { env } from 'process'
import assert from 'assert'


export async function PrivateRoutes(app: FastifyInstance) {

  //This will contain multiple Key-Value elements. 
  //Every time i got a request for the Facebook App Id, i generate a key, crypt the App Id with the key, and store the key in this array with a challenge key.
  //The client will get the challenge key, make another request with the challenge key, and the server will return the Passphrase for decrypt the App Id.
  const appIdChallengeKeyDictionary: TChallengeKeyDictionary[] = []

  app.get('/ping', async () => {
    return { pong: 'privatePong' }
  })

  app.get('/facebook_app_id', async (req: any, res: any) => {
    const requestId = req.query.requestId
    assert(requestId, "Request Id Not Found")

    const challengeKey = Math.random().toString(36).substring(7)
    const cryptPassphrase = Math.random().toString(36).substring(7)
    const encryptedAppId = CryptoJS.AES.encrypt(env.FACEBOOK_APP_ID || "", cryptPassphrase)

    appIdChallengeKeyDictionary.push({
      id: requestId,
      challenge: challengeKey,
      passphrase: cryptPassphrase
    })


    return { encryptedAppId: encryptedAppId.toString(), challengeKey: challengeKey }
  })

  app.get('/google_client_id', async (req: any, res: any) => {
    const requestId = req.query.requestId
    assert(requestId, "Request Id Not Found")

    const challengeKey = Math.random().toString(36).substring(7)
    const cryptPassphrase = Math.random().toString(36).substring(7)
    const encryptedAppId = CryptoJS.AES.encrypt(env.GOOGLE_CLIENT_ID || "", cryptPassphrase)

    appIdChallengeKeyDictionary.push({
      id: requestId,
      challenge: challengeKey,
      passphrase: cryptPassphrase
    })


    return { encryptedAppId: encryptedAppId.toString(), challengeKey: challengeKey }
  })

  app.get('/challenge_passphrase', async (req: any, res: any) => {
    const requestId = req.query.requestId
    const challengeKey = req.query.challenge
    const key = appIdChallengeKeyDictionary.filter((element) => element.id === requestId && element.challenge === challengeKey)[0]

    if (key) {
      appIdChallengeKeyDictionary.splice(appIdChallengeKeyDictionary.indexOf(key), 1)
      return { passphrase: key.passphrase }
    }
    return { error: "Invalid Challenge Key" }
  })

}
