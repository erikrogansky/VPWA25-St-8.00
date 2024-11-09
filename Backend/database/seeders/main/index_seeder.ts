import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'

export default class IndexSeeder extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in a environment specified in Seeder
     */
    if (
      !Seeder.default.environment ||
      (!Seeder.default.environment.includes('production') && app.inProduction)
    ) {
      return
    }

    await new Seeder.default(this.client).run()
  }

  async run() {
    console.log('Running IndexSeeder...')
    await this.seed(await import('#database/seeders/user_seeder'))
    await this.seed(await import('#database/seeders/channel_seeder'))
    await this.seed(await import('#database/seeders/user_channel_membership_seeder'))
    await this.seed(await import('#database/seeders/message_seeder'))
    console.log('Seeders finished.')
  }
}