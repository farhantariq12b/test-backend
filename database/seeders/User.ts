import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    User.create({
      name: 'Admin',
      email: 'admin3@gmail.com',
      role: 'admin',
      password: 'admin',
    })
  }
}
