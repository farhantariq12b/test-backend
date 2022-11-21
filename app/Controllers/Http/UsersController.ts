import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
export default class UsersController {
  public async login({ request, response, auth, session }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    
    try{
      if(await auth.attempt(email, password)){

      const user = await User.findBy("email",email);
      const jwt = await auth.use("jwt").generate(user as User);
      Object.assign(user as User, jwt)
      console.log('im here !!');
      return {user, token: jwt.accessToken}
      }
      const user = await User.find(1);

      // const jwt = await auth.use("jwt").generate(user as User);
      // console.log('im here !!');
      // return jwt
    } catch(error){
      console.log('im in catch ');
      // session.flash('form','Your email or password is incorrect')
      return error.message
    }
  }
  public async logout({response, auth}) {
    try{
      await auth.logout()
      return 'logged out'
    } catch(error){
      return error.message
    }
  }
  public async signup({ request, response, auth }: HttpContextContract) {
    const body = request.body()
    const user = await User.create(body)
    await auth.login(user)
    response.status(201)
    return 'User with email '+user.email + ' signed up and logged in'
  }
}
