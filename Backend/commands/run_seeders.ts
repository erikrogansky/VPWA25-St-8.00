import { BaseCommand } from '@adonisjs/core/ace'
import UserSeeder from '#database/seeders/user_seeder'
import ChannelSeeder from '#database/seeders/channel_seeder'
import MessageSeeder from '#database/seeders/message_seeder'

export default class RunSeeders extends BaseCommand {
  public static commandName = 'db:seed'
  public static description = 'Run database seeders'

  public async run() {
    await UserSeeder.run()
    await ChannelSeeder.run()
    await MessageSeeder.run()
    this.logger.info('Seeding completed')
  }
}
