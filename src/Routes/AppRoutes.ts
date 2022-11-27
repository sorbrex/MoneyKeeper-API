import { FastifyInstance } from "fastify"

export async function AppRoutes(app: FastifyInstance) {

  app.addHook('onRequest', async () => {
    //TODO: Add JWT Authentication
    //Check Every Request That Comes To App Functionality.
    //If Not Authorized, Return 401.
    //The Client Will Handle That and Redirect To Login Page.
    console.log('onRequest hook')
  })

}
