import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  async run() {
    console.log('Running UserSeeder...')
    await User.createMany([
      {
        nick: 'user1',
        email: 'user1@example.com',
        password: 'password1',
        firstName: 'User',
        lastName: 'One',
        dateOfBirth: DateTime.local(2001, 1, 1),
        gender: 'male',
        phoneNumber: '+421911111111',
        mode: 'dark',
        notifications: 'sound',
        activeStatus: 'active',
      },
      {
        nick: 'user2',
        email: 'user2@example.com',
        password: 'password2',
        firstName: 'User',
        lastName: 'Two',
        dateOfBirth: DateTime.local(2002, 2, 2),
        gender: 'female',
        phoneNumber: '+421922222222',
        mode: 'dark',
        notifications: 'sound',
        activeStatus: 'active',
      },
    ])
  }
}
