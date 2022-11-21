import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Form from 'App/Models/Form'
import User from 'App/Models/User'
import Question from 'App/Models/Question'
import Option from 'App/Models/Option'
export default class FormsController {
  public async index() {
    console.log('jsd nfjn ')
    return await Form.all()
  }
  public async storeById({ request, auth, response }: HttpContextContract) {
    await auth.use('jwt').check()
    const id = auth.use('jwt').user?.id
    const body = request.body()
    body.user_id = id
    try {
      const form = await Form.create(body)
      console.log(form.id)
      const user = await User.find(id)
      user?.merge({
        forms: [...user.forms, form.id],
      })
      user?.save()
      response.status(201)
      return form
    } catch (error) {
      return error.message
    }
  }
  
  public async getById({auth }: HttpContextContract) {
    await auth.use('jwt').check()
    const id = auth.use('jwt').user?.id
    const user = await User.find(id)
    const forms = await Form.findMany([...(user?.forms ?? [])])
    for(let i=0;i<forms?.length;i++){
      const questions = await Question.findMany([...forms[i]?.questions])
      forms[i]?.merge({
        form_questions:questions
      })
      for(let j=0;j<forms[i]?.form_questions?.length;j++){
        
        const options = await Option.findMany([...forms[i]?.form_questions[j]?.options])
        forms[i]?.form_questions[j]?.merge({
          question_options:options
        })
      }
        
    }
    return forms
  }

  public async deleteById({ params }: HttpContextContract) {

    const id = params.form_id
    try {
      const form = await Form.find(id)
      if (form) {
        await form.delete()
        return form?.name + ' deleted'
      } else {
        return 'Form not found'
      }
    } catch (err) {
      return err.message
    }
  }
  public async editById({ params, request }: HttpContextContract) {
    const id = params.form_id
    const body = request.body()
    try {
      const form = await Form.find(id)
      if (form) {
        form?.merge({
          name: body.name,
          visible: body.visible,
          priority: body.priority,
          // questions:[...form.questions,...body.questions || []],
          // user_id: body.user_id
        })
        form?.save()
        return form
      } else {
        return 'Form not found'
      }
    } catch (err) {
      return err.message
    }
  }
}