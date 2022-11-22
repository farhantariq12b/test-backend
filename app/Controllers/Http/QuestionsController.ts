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
      await form?.save()
      return response.status(201).json({
        success: true,
        data: form,
      })
    } catch (error) {
      return response.status(error?.status || 500).json({
        status: false,
        error: error.message,
      })
    }
  }

  public async getById({ params, response }: HttpContextContract) {
    try {
      const form = await Form.find(params.form_id)
      const questions = await Question.findMany([...(form?.questions ?? [])])
      return response.json({
        success: true,
        data: questions,
      })
    } catch (error) {
      return response.status(error?.status || 500).json({
        status: false,
        error: error.message,
      })
    }
  }

  public async deleteById({ params, response }: HttpContextContract) {
    const id = params.question_id
    try {
      const question = await Question.find(id)
      if (!question) {
        throw new Error('Question not found')
      }
      await question.delete()
      const form = await Form.find(question.form_id)
      form?.merge({
        questions: [...form?.questions.filter((item) => item !== +id)],
      })
      await form?.save()
      return response.json({
        success: true,
        message: 'Question Deleted Successfully',
      })
    } catch (error) {
      return response.status(error?.status || 500).json({
        status: false,
        error: error.message,
      })
    }
  }

  public async editById({ params, request, response }: HttpContextContract) {
    const id = params.question_id
    const body = request.body()
    try {
      const question = await Question.find(id)
      if (question) {
        question?.merge({
          question: body.question,
          visible: body.visible,
          priority: body.priority,
        })
        await question?.save()
        return response.json({ success: true, data: question })
      }
      throw new Error('Question not Found')
    } catch (error) {
      return response.status(error?.status || 500).json({
        status: false,
        error: error.message,
      })
    }
  }
}
