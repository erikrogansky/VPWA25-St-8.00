import { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import Membership from '#models/user_channel_membership'
import User from '#models/user'
import Ban from '#models/ban'

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

    if (
      channel.memberships.length === 2 &&
      !channel.isPublic &&
      (channel.name === user.nick || channel.nameIfChat === user.nick)
    ) {
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
    const { channelName, channelSettings } = request.only(['channelName', 'channelSettings'])

    try {
      const channel = await Channel.query()
        .where('name', channelName)
        .orWhere('nameIfChat', channelName)
        .first()

      const user = await auth.getUserOrFail()

      // Check if the channel exists
      if (!channel) {
        /*return response.status(404).json({
          message: 'Channel not found',
        })*/
        const isPublic = channelSettings !== 'private'
        const newChannel = await Channel.create({
          isPublic: isPublic,
          name: channelName,
          userId: user.id,
        })
        newChannel.save()

        await Membership.create({
          userId: user.id,
          channelId: newChannel.id,
          type: 'channel',
          unreadMessages: 0,
        })
        // PRIDAT ESTE LOGIKU PRE CHAT / CHANNEL? - user problems
        return response.status(200).json({
          message: 'Channel created successfully!',
          channel: newChannel,
        })
      }

      // Check if the user is already a member of the channel
      const existingMembership = await Membership.query()
        .where('userId', user.id)
        .andWhere('channelId', channel.id)
        .first()

      if (existingMembership) {
        return response.status(400).json({
          message: 'Already a member',
        })
      }

      // Check if the channel is public
      if (!channel.isPublic) {
        console.log('Channel is private.')
        return response.status(403).json({
          message: 'Private channel',
        })
      }

      //Create a new membership
      await Membership.create({
        userId: user.id,
        channelId: channel.id,
        unreadMessages: 0,
        type: 'channel',
      })

      // Join the channel
      return response.status(200).json({
        message: 'Joined channel successfully!',
        channel,
      })
    } catch (error) {
      // Error joining the channel
      return response.status(500).json({
        message: 'An error occurred while joining the channel.',
        error: error.message,
      })
    }
  }

  public async sendInvite({ auth, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { userName, channelName } = request.only(['userName', 'channelName'])

    // Validate the request data
    if (!userName || !channelName) {
      return response.status(400).json({ message: 'Invalid request data' })
    }

    // Check if the channel exists
    const channel = await Channel.query().where('name', channelName).first()
    if (!channel) {
      return response.status(404).json({ message: 'Channel not found' })
    }

    // Check if the user exists
    const invitee = await User.query().where('nick', userName).first()
    if (!invitee) {
      return response.status(404).json({ message: 'User not found' })
    }

    // Check if the user has a ban
    const existingBan = await Ban.query()
      .where('banned_user_id', invitee.id)
      .andWhere('channel_id', channel.id)
      .first()

    if (existingBan) {
      if (channel.userId !== user.id && existingBan.kickFinalizedBy) {
        return response.status(403).json({ message: 'UserBanned' })
      } else if (existingBan.kickFinalizedBy) {
        // Remove the ban if the invitation is sent by the channel admin
        await existingBan.delete()
      }
    }

    if (channel.isPublic) {
      const membership = await Membership.query()
        .where('channel_id', channel.id)
        .andWhere('user_id', user.id)
        .first()

      if (!membership) {
        return response.status(403).json({
          success: false,
          message: 'You are not a member of this channel',
        })
      }
    } else {
      if (channel.userId !== user.id) {
        return response.status(403).json({
          success: false,
          message: 'OnlyAdminInvites',
        })
      }
    }

    // Check if the invitee is already a member
    const existingMembership = await Membership.query()
      .where('channel_id', channel.id)
      .andWhere('user_id', invitee.id)
      .first()

    if (existingMembership) {
      return response.status(400).json({ message: 'InviteAlreadyMember' })
    }

    // Create the invite
    await Membership.create({
      channelId: channel.id,
      userId: invitee.id,
      type: 'request',
    })

    return response.status(200).json({ success: true, message: 'Invitation sent successfully' })
  }

  public async revokeUser({ auth, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { userName, channelName } = request.only(['userName', 'channelName'])

    // Validate the request data
    if (!userName || !channelName) {
      return response.status(400).json({ message: 'Invalid request data' })
    }

    // Check if the channel exists
    const channel = await Channel.query().where('name', channelName).first()
    if (!channel) {
      return response.status(404).json({ message: 'Channel not found' })
    }

    // Check if the user exists
    const member = await User.query().where('nick', userName).first()
    if (!member) {
      return response.status(404).json({ message: 'User not found' })
    }

    // Check if the user is the channel admin
    if (channel.userId !== user.id) {
      return response.status(403).json({ message: 'OnlyAdminRevoke' })
    }

    // Prevent the admin from revoking themselves
    if (member.id === user.id) {
      return response.status(400).json({ message: 'AdminCannotRevokeSelf' })
    }

    // Check if the member is part of the channel
    const membership = await Membership.query()
      .where('channel_id', channel.id)
      .andWhere('user_id', member.id)
      .first()

    if (!membership) {
      return response.status(400).json({ message: 'UserNotInChannel' })
    }

    // Remove the user from the channel
    await membership.delete()

    return response.status(200).json({ success: true, message: 'User removed from channel' })
  }

  public async kickUser({ auth, request, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { userName, channelName } = request.only(['userName', 'channelName'])

    // Validate the request data
    if (!userName || !channelName) {
      return response.status(400).json({ message: 'Invalid request data' })
    }

    // Check if the channel exists
    const channel = await Channel.query().where('name', channelName).first()
    if (!channel) {
      return response.status(404).json({ message: 'Channel not found' })
    }

    // Check if the user exists
    const member = await User.query().where('nick', userName).first()
    if (!member) {
      return response.status(404).json({ message: 'User not found' })
    }

    // Check if the member is part of the channel
    const membership = await Membership.query()
      .where('channel_id', channel.id)
      .andWhere('user_id', member.id)
      .first()

    if (!membership) {
      return response.status(400).json({ message: 'UserNotInChannel' })
    }

    // Prevent kicking the channel admin
    if (channel.userId === member.id) {
      return response.status(403).json({ message: 'CannotKickChannelAdmin' })
    }

    // Check if the user is the channel admin
    if (channel.userId === user.id) {
      // Check if there is an existing ban entry
      const existingKick = await Ban.query()
        .where('banned_user_id', member.id)
        .andWhere('channel_id', channel.id)
        .first()

      if (existingKick) {
        // Update the existing entry
        existingKick.kickInitiatedBy = user.id
        existingKick.kickConfirmedBy = user.id
        existingKick.kickFinalizedBy = user.id
        await existingKick.save()
      } else {
        // Create a new entry
        await Ban.create({
          bannedUserId: member.id,
          channelId: channel.id,
          kickInitiatedBy: user.id,
          kickConfirmedBy: user.id,
          kickFinalizedBy: user.id,
        })
      }

      // Remove the user from the channel
      await membership.delete()

      return response.status(200).json({ success: true, message: 'User banned from channel' })
    }

    // Check if the user is already banned
    const existingKick = await Ban.query()
      .where('banned_user_id', member.id)
      .andWhere('channel_id', channel.id)
      .andWhere((query) => {
        query
          .where('kick_initiated_by', user.id)
          .orWhere('kick_confirmed_by', user.id)
          .orWhere('kick_finalized_by', user.id)
      })
      .first()

    if (existingKick) {
      return response.status(400).json({ message: 'KickAlreadyInitiatedByUser' })
    }

    const existingBan = await Ban.query()
      .where('banned_user_id', member.id)
      .andWhere('channel_id', channel.id)
      .andWhereNotNull('kick_initiated_by')
      .first()
    if (existingBan) {
      // Confirm kick (second vote)
      if (!existingBan.kickConfirmedBy) {
        existingBan.kickConfirmedBy = user.id
        await existingBan.save()
        return response.status(200).json({ success: true, message: 'Kick confirmed' })
        // Finalize kick (third vote)
      } else if (!existingBan.kickFinalizedBy) {
        existingBan.kickFinalizedBy = user.id
        await existingBan.save()

        // Remove the user from the channel
        await membership.delete()

        return response.status(200).json({ success: true, message: 'User banned from channel' })
      } else {
        return response.status(400).json({ message: 'UserAlreadyBanned' })
      }
    }

    // Initiate kick (first vote)
    await Ban.create({
      bannedUserId: member.id,
      channelId: channel.id,
      kickInitiatedBy: user.id,
    })

    return response.status(200).json({ success: true, message: 'Kick initiated' })
  }
}
