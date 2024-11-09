import { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Message from '#models/message'
import User from '#models/user'
import { io } from '#start/ws'

export default class MessagesController {
  public async getMessages(data: { title: string; user: User; id: string }) {
    try {
      const channel = await Channel.query()
        .where('name', data.title)
        .orWhere('nameIfChat', data.title)
        .preload('messages', (query) => {
          query.preload('user')
        })
        .firstOrFail()

      const messages = channel.messages

      const messageItems = messages.map((message: Message) => ({
        messageId: message.uuid,
        createdBy: message.user.nick,
        text: message.message,
        isMentioned: !!message.mentionedUserId,
        type: message.createdBy === data.user.id ? 'outgoing' : 'incoming',
      }))

      return messageItems
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  public async writeMessages({ auth, request }: HttpContext) {
    try {
      const user = await auth.user
      const data = request.only(['text', 'title', 'id'])

      const channel = await Channel.query()
        .where('name', data.title)
        .orWhere('nameIfChat', data.title)
        .firstOrFail()

      await channel.related('messages').create({
        uuid: data.id,
        message: data.text,
        mentionedUserId: null,
        createdBy: user?.id,
      })

      const newMessageToBeEmitted = {
        messageId: data.id,
        createdBy: user?.nick,
        text: data.text,
        isMentioned: false,
      }

      // eslint-disable-next-line prettier/prettier
      const results = await Channel.query().where('name', data.title).orWhere('nameIfChat', data.title).firstOrFail()
      console.log('Title 2:', results.name)
      io.to(results.name).emit('message', newMessageToBeEmitted)
    } catch (error) {
      console.error('Error writing messages:', error)
    }
  }
}
