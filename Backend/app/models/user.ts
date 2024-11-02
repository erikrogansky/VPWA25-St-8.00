import { DateTime } from 'luxon'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import UserChannelMembership from 'app/models/user_channel_membership.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nick: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column.date()
  declare dateOfBirth: DateTime

  @column()
  declare gender: 'male' | 'female' | 'nonbinary' | 'other'

  @column()
  declare phoneNumber?: string

  @column.dateTime()
  declare lastActive?: DateTime

  @column()
  declare mode: 'dark' | 'light' | 'system'

  @column()
  declare notifications: 'none' | 'sound' | 'nosound'

  @column()
  declare activeStatus: 'active' | 'offline' | 'dnd'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => UserChannelMembership)
  declare memberships: HasMany<typeof UserChannelMembership>
}
