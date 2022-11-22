import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
export default class UsersController {
  public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    try {
      if (await auth.attempt(email, password)) {
        const user = await User.findBy('email', email)
        const jwt = await auth.use('jwt').generate(user as User)
        return { success: true, data: { user, token: jwt.accessToken } }
      }
      throw new Error('Email or password is incorrect')
    } catch (error) {
      return response.status(error?.status || 500).json({
        status: false,
        error: error.message,
      })
    }
  }
  public async logout({ response, auth }) {
    try {
      await auth.logout()
      await auth.use('jwt').logout()
      return response.json({ success: true })
    } catch (error) {
      return response.status(error?.status || 500).json({
        status: false,
        error: error.message,
      })
    }
  }
  public async signup({ request, response, auth }: HttpContextContract) {
    try {
      const body = request.body()
      const user = await User.create(body)
      await auth.login(user)
      const jwt = await auth.use('jwt').generate(user)
      response.status(201)
      return { success: true, data: { user, token: jwt.accessToken } }
    } catch (error) {
      return response.status(error?.status || 500).json({
        status: false,
        error: error.message,
      })
    }
  }
}
