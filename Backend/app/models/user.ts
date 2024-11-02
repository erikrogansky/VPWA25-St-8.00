import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import UserChannelMembership from '#models/user_channel_membership'
import { AccessToken } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nick: string

  @column()
  declare email: string

  @column({ serializeAs: null })
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

  @column()
  declare fullName: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => UserChannelMembership)
  declare memberships: HasMany<typeof UserChannelMembership>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  currentAccessToken?: AccessToken
}
