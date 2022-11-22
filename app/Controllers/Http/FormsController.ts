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
      const user = await User.find(id)
      user?.merge({
        forms: [...user.forms, form.id],
      })
      await user?.save()
      response.status(201)
      return response.json({
        success: false,
        data: form,
      })
    } catch (error) {
      return response.status(error.state || 500).json({
        success: false,
        error: error.message,
      })
    }
  }

  public async getById({ auth, response }: HttpContextContract) {
    try {
      await auth.use('jwt').check()
      const id = auth.use('jwt').user?.id
      const user = await User.find(id)
      const forms = await Form.findMany([...(user?.forms ?? [])])
      for (let i = 0; i < forms?.length; i++) {
        const questions = await Question.findMany([...forms[i]?.questions])
        forms[i]?.merge({
          form_questions: questions,
        })
        for (let j = 0; j < forms[i]?.form_questions?.length; j++) {
          const options = await Option.findMany([...forms[i]?.form_questions[j]?.options])
          forms[i]?.form_questions[j]?.merge({
            question_options: options,
          })
        }
      }
      return response.json({
        success: true,
        data: forms,
      })
    } catch (error) {
      return response.status(error.state || 500).json({
        success: false,
        error: error.message,
      })
    }
  }

  public async deleteById({ params, response }: HttpContextContract) {
    const id = params.form_id
    try {
      const form = await Form.find(id)
      if (!form) {
        throw new Error('Form not found')
      }
      await form.delete()
      return response.json({
        success: true,
        message: 'Form deleted',
      })
    } catch (error) {
      return response.status(error.state || 500).json({
        success: false,
        error: error.message,
      })
    }
  }
  public async editById({ params, request, response }: HttpContextContract) {
    const id = params.form_id
    const body = request.body()
    try {
      const form = await Form.find(id)
      if (!form) {
        throw new Error('Form not found')
      }
      form.merge({
        name: body.name,
        visible: body.visible,
        priority: body.priority,
      })
      await form.save()
      return response.json({
        success: true,
        data: form,
      })
    } catch (error) {
      return response.status(error.state || 500).json({
        success: false,
        error: error.message,
      })
    }
  }
}
