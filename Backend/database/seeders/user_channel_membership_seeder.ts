import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Channel from '#models/channel'
import UserChannelMembership from '#models/user_channel_membership'

export default class UserChannelMembershipSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  async run() {
    console.log('Running UserChannelMembershipSeeder...')

    const user1 = await User.findByOrFail('nick', 'user1')
    const user2 = await User.findByOrFail('nick', 'user2')
    const channel1 = await Channel.findByOrFail('name', 'TestujemeChannel')
    const channel2 = await Channel.findByOrFail('name', 'ExploreChannel')

    await UserChannelMembership.createMany([
      {
        userId: user1.id,
        channelId: channel1.id,
        unreadMessages: 0,
        type: 'channel',
      },
      {
        userId: user2.id,
        channelId: channel2.id,
        unreadMessages: 0,
        type: 'channel',
      },
    ])
  }
}
