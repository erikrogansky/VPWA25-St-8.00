import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const userData = request.only(['nick', 'email', 'password', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'phoneNumber'])
    try {
      const user = await User.create(userData)
      return response.created({ user })
    } catch (error) {
      return response.badRequest({ error: 'Registration failed', message: error.message })
    }
  }
}
