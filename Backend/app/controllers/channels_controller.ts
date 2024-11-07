import { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Membership from '#models/user_channel_membership'
import User from '#models/user'

export default class ChannelsController {
  public async getChats({ auth }: HttpContext) {
    const user = await auth.getUserOrFail()
    const allMemberships = user.memberships.filter((membership) => membership.type === 'chat')

    const chats = []

    for (const membership of allMemberships) {
      const channel = await membership.channel
      const unreadMessages = membership.unreadMessages
      chats.push({
        channel,
        unreadMessages,
      })
    }

    return {
      success: true,
      chats,
    }
  }

  public async addChannel({ auth, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const channelData = request.only(['users', 'isPublic', 'title'] as any)

    if (!channelData) {
      return response.status(400).json({ success: false, message: 'Channel name is required' })
    }

    const newChannel = await Channel.create({
      isPublic: channelData.isPublic,
      name: channelData.title,
      ownerId: user.id,
    })

    const userNicks = channelData.users
    const users = await User.query().whereIn('nick', userNicks)

    await Promise.all(
      users.map(async (u) => {
        return await Membership.create({
          userId: u.id,
          channelId: newChannel.id,
          type: 'request',
          unreadMessages: 0,
        })
      })
    )

    return response.status(200).json({
      success: true,
    })
  }
}
