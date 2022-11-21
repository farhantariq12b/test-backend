import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Option from 'App/Models/Option'
import Question from 'App/Models/Question'
export default class OptionsController {
  public async storeById({ params, request, response }: HttpContextContract) {
    const id = params.question_id
    const body = request.body()
    body.question_id = id
    try {
      const option = await Option.create(body)
      const question = await Question.find(id)
      question?.merge({
        options: [...question.options, option.id],
      })
      question?.save()
      response.status(201)
      return option
    } catch (error) {
      return error.message
    }
  }

  public async getById({ params }: HttpContextContract) {
    const question = await Question.find(params.question_id)
    const options = await Option.findMany([...(question?.options ?? [])])
    return options
  }

  public async deleteById({ params }: HttpContextContract) {
    const id = params.option_id
    try {
      const option = await Option.find(id)
      if (option) {
        await option.delete()
        return 'option with id ' + option?.id + ' deleted'
      } else {
        return 'option not found'
      }
    } catch (err) {
      return err.message
    }
  }

  public async editById({ params, request }: HttpContextContract) {
    const id = params.option_id
    const body = request.body()
    try {
      const option = await Option.find(id)
      if (option) {
        option?.merge({
          name: body.name,
          visible: body.visible,
          priority: body.priority,
          // questions:[...form.questions,...body.questions || []],
          // user_id: body.user_id
        })
        option?.save()
        return option
      } else {
        return 'Option not found'
      }
    } catch (err) {
      return err.message
    }
  }
}
  