import Channel from '#models/channel'
import User from '#models/user'

export default class ChannelSeeder {
  public static async run() {
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
