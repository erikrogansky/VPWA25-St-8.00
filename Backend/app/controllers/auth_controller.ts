import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    const userData = request.only([
      'nick',
      'email',
      'password',
      'firstName',
      'lastName',
      'dateOfBirth',
      'gender',
      'phoneNumber',
    ] as any)

    userData.mode = 'system'
    userData.notifications = 'sound'
    userData.activeStatus = 'active'

    const requiredFields = [
      'nick',
      'email',
      'password',
      'firstName',
      'lastName',
      'dateOfBirth',
      'gender',
      'phoneNumber',
    ]

    for (const field of requiredFields) {
      if (!userData[field]) {
        return response.badRequest({ error: `Missing field: ${field}` })
      }
    }

    const dateOfBirth = new Date(userData.dateOfBirth)
    if (Number.isNaN(dateOfBirth.getTime())) {
      return response.badRequest({ error: 'Invalid date format for dateOfBirth' })
    }

    const phoneRegex = /^[+]?[0-9]{10,14}$/
    if (!phoneRegex.test(userData.phoneNumber)) {
      return response.badRequest({ error: 'Invalid phone number format' })
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    if (!emailRegex.test(userData.email)) {
      return response.badRequest({ error: 'Invalid email format' })
    }

    const allowedGenders = ['male', 'female', 'nonbinary', 'other']
    if (!allowedGenders.includes(userData.gender)) {
      return response.badRequest({
        error: 'Invalid gender. Allowed values: male, female, nonbinary, other',
      })
    }

    try {
      const user = await User.create(userData)
      return response.created({ user })
    } catch (error) {
      return response.badRequest({ error: 'Registration failed', message: error.message })
    }
  }

  public async login({ auth, request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    try {
      const token = await auth.use('api').verifyCredentials(email, password)
      return token
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async logout({ auth }: HttpContext) {
    await auth.use('api').logout()
    return { message: 'Logged out successfully' }
  }
}
