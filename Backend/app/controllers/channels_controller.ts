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
          channel.name = channel.nameIfChat
        }
        chats.push({
          channel,
          unreadMessages,
          channelOwner: channel.owner.id === user.id,
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

    if (channelData.users.length === 0) {
      return response
        .status(400)
        .json({ success: false, message: 'Please specify at least one user' })
    }

    const userNicks = channelData.users
    const users = await User.query().whereIn('nick', userNicks)

    if (users.length !== userNicks.length) {
      return response
        .status(400)
        .json({ success: false, message: 'One or more users do not exist' })
    }

    // Check if the channel name is unique
    const existingChannel = await Channel.query()
      .where('name', channelData.title)
      .orWhere('nameIfChat', channelData.title)
      .first()
    if (existingChannel) {
      return response.status(400).json({ success: false, message: 'Channel already exists' })
    }

    const newChannel = await Channel.create({
      isPublic: channelData.isPublic,
      name: channelData.title,
      userId: user.id,
    })

    if (newChannel && users.length === 1) {
      newChannel.nameIfChat = user.nick

      newChannel.save()
    }

    await Membership.create({
      userId: user.id,
      channelId: newChannel.id,
      type: !newChannel.isPublic && users.length === 1 ? 'chat' : 'channel',
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

  public async acceptRequest({ auth, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const channelData = request.only(['title'] as any)

    const channel = await Channel.query()
      .where('name', channelData.title)
      .orWhere('name', user.nick)
      .preload('memberships')
      .orderByRaw(`CASE WHEN name = ? THEN 1 ELSE 2 END`, [channelData.title])
      .first()

    if (!channel) {
      return response.status(400).json({ success: false, message: 'Channel not found' })
    }

    const membership = await Membership.query()
      .where('channelId', channel.id)
      .andWhere('userId', user.id)
      .first()

    if (!membership) {
      return response.status(400).json({ success: false, message: 'Membership not found' })
    }

    if (channel.memberships.length === 2 && !channel.isPublic) {
      membership.type = 'chat'
    } else {
      membership.type = 'channel'
    }

    await membership.save()

    return response.status(200).json({ success: true, message: 'Request accepted', membership })
  }

  public async declineRequest({ auth, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const channelData = request.only(['title'] as any)

    const channel = await Channel.query()
      .where('name', channelData.title)
      .orWhere('name', user.nick)
      .preload('memberships')
      .orderByRaw(`CASE WHEN name = ? THEN 1 ELSE 2 END`, [channelData.title])
      .first()

    if (!channel) {
      return response.status(400).json({ success: false, message: 'Channel not found' })
    }

    const membership = await Membership.query()
      .where('channelId', channel.id)
      .andWhere('userId', user.id)
      .first()

    if (!membership) {
      return response.status(400).json({ success: false, message: 'Membership not found' })
    }

    await membership.delete()

    if (channel.memberships.length - 1 < 2) {
      await channel.delete()
    }

    return response.status(200).json({ success: true, message: 'Request accepted', membership })
  }

  public async leaveChannel({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const channelData = request.only(['title', 'action'] as any)

    const channel = await Channel.query()
      .where('name', channelData.title)
      .orWhere('name', user.nick)
      .preload('memberships')
      .orderByRaw(`CASE WHEN name = ? THEN 1 ELSE 2 END`, [channelData.title])
      .first()

    if (channelData.action === 'delete') {
      channel?.delete()

      return response.status(200).json({ success: true, message: 'Channel deleted' })
    } else {
      const memberships = channel?.memberships.filter((m) => m.userId === user.id)

      if (!memberships) {
        return response.status(400).json({ success: false, message: 'Could not delete' })
      }

      if (memberships.length <= 2) {
        channel?.delete()
        return response.status(400).json({ success: false, message: 'Left channel' })
      }

      for (const membership of memberships) {
        await membership.delete()
      }

      return response.status(200).json({ success: true, message: 'Left channel' })
    }
  }

  public async getPublicChannels({ request, response }: HttpContext) {
    try {
      const channelData = request.only(['search'] as const)

      if (!channelData.search) {
        return response
          .status(400)
          .json({ success: false, message: 'Search parameter is required' })
      }

      const channels = await Channel.query()
        .where('isPublic', true)
        .andWhere('name', 'like', `%${channelData.search}%`)

      return response.status(200).json({ success: true, channels })
    } catch (error) {
      return response
        .status(500)
        .json({ success: false, message: 'Server Error', error: error.message })
    }
  }

  public async joinChannel({ auth, request, response }: HttpContext) {
    const { channelName } = request.only(['channelName'])
    console.log(channelName)
    try {
      // Find the channel by name
      const channel = await Channel.query().where('name', channelName).firstOrFail()

      // Check if the channel is public
      if (!channel.isPublic) {
        return response.status(403).json({
          message: 'Cannot join a private channel directly.',
        })
      }

      // Find the user by ID
      const user = await auth.getUserOrFail()
      // Check if the user is already a member of the channel
      const existingMembership = await Membership.query()
        .where('userId', user.id)
        .andWhere('channelId', channel.id)
        .first()

      if (existingMembership) {
        console.log('User is already a member of the channel.')
        return response.status(400).json({
          message: 'Already a member',
        })
      }

      //Create a new membership record
      await Membership.create({
        userId: user.id,
        channelId: channel.id,
        unreadMessages: 0,
        type: 'channel',
      })

      // Return response
      return response.status(200).json({
        message: 'Joined channel successfully!',
        channel,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'An error occurred while joining the channel.',
        error: error.message,
      })
    }
  }
}
