import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

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
      await User.create(userData)
      return response.created({
        success: true,
        message: 'User registered successfully',
      })
    } catch (error) {
      return response.badRequest({ error: 'Registration failed', message: error.message })
    }
  }

  public async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)
    if (!user) {
      return response.badRequest({
        error: 'You are not registered',
      })
    }

    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      return response.badRequest({
        error: 'You have entered an invalid password',
      })
    }

    const token = await User.accessTokens.create(user)

    return {
      success: true,
      type: 'bearer',
      value: token.value!.release(),
    }
  }

  public async logout({ auth }: HttpContext) {
    const user = await auth.getUserOrFail()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return {
      success: true,
      message: 'Logged out successfully',
    }
  }

  public async getUserName({ auth }: HttpContext) {
    const user = await auth.getUserOrFail()

    return {
      success: true,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }
}
