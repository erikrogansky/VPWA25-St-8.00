import { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Membership from '#models/user_channel_membership'
import User from '#models/user'

export default class ChannelsController {
  public async getChats({ auth, response, request }: HttpContext) {
    try {
      const user = await auth.getUserOrFail()
      try {
        await user.load('memberships', (query) => {
          query.preload('channel', (channelQuery: { preload: (arg0: string) => void }) => {
            channelQuery.preload('owner')
          })
        })
      } catch (error) {
        return response.status(200).json({ success: true, message: 'No chats found' })
      }

      const allMemberships = user.memberships.filter((m) => m.type === request.input('type'))

      if (!allMemberships || allMemberships.length === 0) {
        return response.status(200).json({ success: true, message: 'No chats found' })
      }

      const chats = []

      for (const membership of allMemberships) {
        const channel = membership.channel
        if (!channel) {
          continue
        }
        const unreadMessages = membership.unreadMessages
        if (channel.name === user.nick) {
          channel.name = channel.owner.nick
        }
        chats.push({
          channel,
          unreadMessages,
        })
      }

      return {
        success: true,
        chats,
      }
    } catch (error) {
      return response
        .status(500)
        .json({ success: false, message: 'Error fetching chats', error: error.message })
    }
  }

  public async addChannel({ auth, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const channelData = request.only(['users', 'isPublic', 'title'] as any)

    if (!channelData) {
      return response.status(400).json({ success: false, message: 'Channel name is required' })
    }

    const userNicks = channelData.users
    const users = await User.query().whereIn('nick', userNicks)

    if (users.length !== userNicks.length) {
      return response
        .status(400)
        .json({ success: false, message: 'One or more users do not exist' })
    }

    const newChannel = await Channel.create({
      isPublic: channelData.isPublic,
      name: channelData.title,
      userId: user.id,
    })

    await Membership.create({
      userId: user.id,
      channelId: newChannel.id,
      type: 'chat',
      unreadMessages: 0,
    })

    for (const u of users) {
      await Membership.create({
        userId: u.id,
        channelId: newChannel.id,
        type: 'request',
        unreadMessages: 0,
      })
    }

    return response.status(201).json({ success: true, channel: newChannel })
  }
}
