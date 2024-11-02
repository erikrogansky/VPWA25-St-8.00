import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.text('nick').notNullable().unique()
      table.text('email').notNullable().unique()
      table.text('password').notNullable()
      table.text('first_name').notNullable()
      table.text('last_name').notNullable()
      table.date('date_of_birth').notNullable()
      table.enum('gender', ['male', 'female', 'nonbinary', 'other']).notNullable()
      table.text('phone_number')
      table.timestamp('last_active')
      table.enum('mode', ['dark', 'light', 'system']).notNullable()
      table.enum('notifications', ['none', 'sound', 'nosound']).notNullable()
      table.enum('active_status', ['active', 'offline', 'dnd']).notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
