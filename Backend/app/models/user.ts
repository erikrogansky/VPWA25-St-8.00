import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

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
}
