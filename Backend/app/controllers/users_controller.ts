import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
//import User from '#models/user'

export default class UsersController {
  public async getUser({ auth, response }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      return response.json(user)
    } catch (error) {
      return response.status(401).json({ error: 'User not authenticated' })
    }
  }

  public async setStatus({ auth, request, response }: HttpContext) {
    const data = request.only(['status'] as any)
    try {
      const user = await auth.getUserOrFail()
      user.activeStatus = data.status
      await user.save()
      return response.status(200)
    } catch (error) {
      return response.status(401).json({ error: 'User not authenticated' })
    }
  }

  public async setTheme({ auth, request, response }: HttpContext) {
    const data = request.only(['theme'] as any)
    try {
      const user = await auth.getUserOrFail()
      user.mode = data.theme
      await user.save()
      return response.json(user)
    } catch (error) {
      return response.status(401).json({ error: 'User not authenticated' })
    }
  }

  public async getStatus({ request, response }: HttpContext) {
    const data = request.only(['nick'] as any)
    try {
      const user = await User.findBy('nick', data.nick)
      return response.json({ status: user?.activeStatus })
    } catch (error) {
      return response.status(401).json({ error: 'User not authenticated' })
    }
  }
}
