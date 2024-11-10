import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  public async getUser({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      return response.json(user)
    } catch (error) {
      return response.status(401).json({ error: 'User not authenticated' })
    }
  }
}
