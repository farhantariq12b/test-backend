import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Question from 'App/Models/Question'
import Form from 'App/Models/Form'
export default class QuestionsController {
  public async storeById({ params, request, response }: HttpContextContract) {
    const id = params.form_id
    const body = request.body()
    body.form_id = id
    try {
      const question = await Question.create(body)
      const form = await Form.find(id)
      form?.merge({
        questions: [...form.questions, question.id],
      })
      form?.save()
      response.status(201)
      return form
    } catch (error) {
      return error.message
    }
  }

  public async getById({ params }: HttpContextContract) {
    const form = await Form.find(params.form_id)
    const questions = await Question.findMany([...(form?.questions ?? [])])
    return questions
  }

  public async deleteById({ params }: HttpContextContract) {
    const id = params.question_id
    try {
      const question = await Question.find(id)
      if (question) {
        await question.delete()
        return 'question with id ' + question?.id + ' deleted'
      } else {
        return 'Question not found'
      }
    } catch (err) {
      return err.message
    }
  }

  public async editById({ params, request }: HttpContextContract) {
    const id = params.question_id
    const body = request.body()
    try {
      const question = await Question.find(id)
      if (question) {
        question?.merge({
          question: body.question,
          visible: body.visible,
          priority: body.priority,
          // questions:[...form.questions,...body.questions || []],
          // user_id: body.user_id
        })
        question?.save()
        return question
      } else {
        return 'Question not found'
      }
    } catch (err) {
      return err.message
    }
  }

}
