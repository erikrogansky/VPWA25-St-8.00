import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Channel from '#models/channel'

export default class Ban extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare bannedUserId: number

  @column()
  declare channelId: number

  @column()
  declare kickInitiatedBy: number

  @column()
  declare kickConfirmedBy: number

  @column()
  declare kickFinalizedBy: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'bannedUserId' })
  declare bannedUser: BelongsTo<typeof User>

  @belongsTo(() => Channel)
  declare channel: BelongsTo<typeof Channel>

  @belongsTo(() => User, { foreignKey: 'kickInitiatedBy' })
  declare initiator: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'kickConfirmedBy' })
  declare confirmer: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'kickFinalizedBy' })
  declare finalizer: BelongsTo<typeof User>
}
