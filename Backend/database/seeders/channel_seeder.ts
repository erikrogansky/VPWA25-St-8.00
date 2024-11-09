import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Channel from '#models/channel'

export default class ChannelSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  async run() {
    console.log('Running ChannelSeeder...')
    const user1 = await User.findByOrFail('nick', 'user1')
    const user2 = await User.findByOrFail('nick', 'user2')

    await Channel.createMany([
      {
        name: 'TestujemeChannel',
        isPublic: true,
        userId: user1.id,
      },
      {
        name: 'ExploreChannel',
        isPublic: false,
        userId: user2.id,
      },
    ])
  }
}
