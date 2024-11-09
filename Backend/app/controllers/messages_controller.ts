import type { HttpContext } from '@adonisjs/core/http'

export default class MessagesController {
  public async getMessages({ auth, response, request }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { channelId } = request.all()
  }
}
