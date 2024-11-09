import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Channel from '#models/channel'
import Message from '#models/message'

export default class MessageSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  async run() {
    console.log('Running MessageSeeder...')
    const user1 = await User.findByOrFail('nick', 'user1')
    const user2 = await User.findByOrFail('nick', 'user2')
    const channel1 = await Channel.findByOrFail('name', 'TestujemeChannel')
    const channel2 = await Channel.findByOrFail('name', 'ExploreChannel')

    await Message.createMany([
      // Channel 1 messages
      {
        createdBy: user1.id,
        channelId: channel1.id,
        message: 'Hey! How is it going?',
      },
      {
        createdBy: user2.id,
        channelId: channel1.id,
        message: 'Pretty good, thanks! Just relaxing. You?',
      },
      {
        createdBy: user1.id,
        channelId: channel1.id,
        message: 'What did you think of the new movie?',
      },
      {
        createdBy: user2.id,
        channelId: channel1.id,
        message: 'Honestly, it was better than I expected! Really enjoyed it.',
      },
      // Channel 2 messages
      {
        createdBy: user1.id,
        channelId: channel2.id,
        message: 'I just want to finish this project already!',
      },
      {
        createdBy: user2.id,
        channelId: channel2.id,
        message: 'Yes. It is taking forever!',
      },
      {
        createdBy: user1.id,
        channelId: channel2.id,
        message: 'I know, right? I am so tired of it.',
      },
      {
        createdBy: user2.id,
        channelId: channel2.id,
        message: 'I am too. I just want to move on to something else.',
      },
    ])
  }
}
