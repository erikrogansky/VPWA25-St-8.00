import cron from 'node-cron'
import Channel from '#models/channel'
import { DateTime } from 'luxon'

cron.schedule('0 0 * * *', async () => {
  const thirtyDaysAgo = DateTime.now().minus({ days: 30 }).toISO()
  const inactiveChannels = await Channel.query().where('updated_at', '<', thirtyDaysAgo)

  for (const channel of inactiveChannels) {
    await channel.delete()
  }
})
