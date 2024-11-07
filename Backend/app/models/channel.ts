import { DateTime } from 'luxon'
import type { HasOne, HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasOne, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import UserChannelMembership from '#models/user_channel_membership'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare isPublic: boolean

  @column()
  declare ownerId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasOne(() => User)
  declare owner: HasOne<typeof User>

  @hasMany(() => UserChannelMembership)
  declare memberships: HasMany<typeof UserChannelMembership>
}
